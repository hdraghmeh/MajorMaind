import { Router, type IRouter, type Request, type Response } from "express";
import { db, interviewSessionsTable, completedInterviewsTable } from "@workspace/db";
import { desc, eq, sql } from "drizzle-orm";
import { SaveInterviewSessionBody } from "@workspace/api-zod";
import crypto from "crypto";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const router: IRouter = Router();

// ---------------------------------------------------------------------------
// Guest-claim HMAC secret
// ---------------------------------------------------------------------------
// Priority: COOKIE_SECRET > ADMIN_TOKEN > per-process random (dev only).
// In production, COOKIE_SECRET or ADMIN_TOKEN MUST be set; a random per-process
// secret would invalidate all guest cookies on every server restart, so the
// server logs a startup error when neither is present in production.
const GUEST_COOKIE_SECRET: string = (() => {
  const explicit = process.env.COOKIE_SECRET ?? process.env.ADMIN_TOKEN;
  if (explicit) return explicit;
  if (process.env.NODE_ENV === "production") {
    console.error(
      "[SECURITY] Neither COOKIE_SECRET nor ADMIN_TOKEN is set in production. " +
      "Guest claim cookies will be invalidated on each server restart. " +
      "Set COOKIE_SECRET to a high-entropy secret."
    );
  }
  // Development / fallback: use a random secret stable for this process lifetime.
  return crypto.randomBytes(32).toString("hex");
})();

// Name of the per-session HttpOnly cookie that carries the HMAC-signed claim.
export function guestClaimCookieName(sessionId: string): string {
  return `gsc_${sessionId}`;
}

// Generate an HMAC-SHA256 token for the given sessionId.
function signGuestClaim(sessionId: string): string {
  return crypto.createHmac("sha256", GUEST_COOKIE_SECRET).update(sessionId).digest("hex");
}

// Verify that the cookie value is the correct HMAC for this sessionId.
export function verifyGuestClaim(sessionId: string, cookieValue: string | undefined): boolean {
  if (!cookieValue) return false;
  const expected = signGuestClaim(sessionId);
  try {
    return crypto.timingSafeEqual(Buffer.from(cookieValue, "hex"), Buffer.from(expected, "hex"));
  } catch {
    return false;
  }
}

// GET /api/interview-sessions — list sessions for the authenticated user
router.get("/interview-sessions", async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const rows = await db
    .select()
    .from(interviewSessionsTable)
    .where(eq(interviewSessionsTable.userId, req.user.id));

  const sessions = rows.map((row) => row.data);
  return res.json({ sessions });
});

// PUT /api/interview-sessions/:sessionId — upsert a session (authenticated or guest)
// Ownership rules:
//   - New row: create it, binding userId (or null for guests). Sets HMAC-signed claim cookie for guests.
//   - Existing row owned by a different authenticated user: 403 Forbidden.
//   - Existing guest row: require signed claim cookie on UPDATE; allow authenticated claim.
//   - Existing row owned by requester: allow update.
// Concurrency: rejects stale writes (409) returning server version for client merge.
router.put("/interview-sessions/:sessionId", async (req: Request, res: Response) => {
  const sessionId = req.params.sessionId as string;

  if (!UUID_RE.test(sessionId)) {
    return res.status(400).json({ error: "Invalid session ID format" });
  }

  const callerId = req.isAuthenticated() ? req.user.id : null;

  const parsed = SaveInterviewSessionBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid session data" });
  }

  if (parsed.data.id !== sessionId) {
    return res.status(400).json({ error: "Session ID in body does not match path parameter" });
  }

  // Ownership + concurrency check: fetch existing row (userId + updatedAt)
  const existing = await db
    .select({
      userId: interviewSessionsTable.userId,
      updatedAt: interviewSessionsTable.updatedAt,
    })
    .from(interviewSessionsTable)
    .where(eq(interviewSessionsTable.id, sessionId))
    .limit(1);

  if (existing.length > 0) {
    const ownerUserId = existing[0].userId ?? null;

    if (ownerUserId !== null) {
      // Row is owned by a registered user — deny if requester is different
      if (ownerUserId !== callerId) {
        return res.status(403).json({ error: "Forbidden" });
      }
    } else if (callerId === null) {
      // Updating an existing guest row — require the signed HMAC claim cookie
      const cookieVal = req.cookies?.[guestClaimCookieName(sessionId)];
      if (!verifyGuestClaim(sessionId, cookieVal)) {
        return res.status(403).json({ error: "Forbidden" });
      }
    }
    // Authenticated user updating a guest-owned row is allowed (auth claim flow)

    // Optimistic concurrency guard: reject stale writes.
    // Returns the current server version so the client can merge.
    const dbUpdatedAt = existing[0].updatedAt;
    const clientUpdatedAt = parsed.data.updatedAt ? new Date(parsed.data.updatedAt) : null;
    if (dbUpdatedAt && clientUpdatedAt && clientUpdatedAt < dbUpdatedAt) {
      const serverRows = await db
        .select({ data: interviewSessionsTable.data })
        .from(interviewSessionsTable)
        .where(eq(interviewSessionsTable.id, sessionId))
        .limit(1);
      return res.status(409).json(serverRows[0]?.data ?? { error: "Conflict" });
    }
  }

  const sessionData = { ...parsed.data, updatedAt: new Date().toISOString() };

  // Preserve existing userId when callerId is null (guest update on a guest-owned row)
  const effectiveUserId = callerId ?? (existing[0]?.userId ?? null);

  await db
    .insert(interviewSessionsTable)
    .values({
      id: sessionId,
      userId: effectiveUserId,
      data: sessionData as unknown as Record<string, unknown>,
    })
    .onConflictDoUpdate({
      target: interviewSessionsTable.id,
      set: {
        userId: effectiveUserId ?? undefined,
        data: sessionData as unknown as Record<string, unknown>,
        updatedAt: new Date(),
      },
    });

  // For new guest sessions: set the HMAC-signed per-session HttpOnly claim cookie
  if (callerId === null && existing.length === 0) {
    res.cookie(guestClaimCookieName(sessionId), signGuestClaim(sessionId), {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
  }

  return res.json(sessionData);
});

// GET /api/interview-result/:sessionId — retrieve a completed interview by session ID.
// Ownership: authenticated users see only their own records; guests must hold the signed claim cookie.
// Uses ORDER BY saved_at DESC to deterministically return the latest record if duplicates exist.
router.get("/interview-result/:sessionId", async (req: Request, res: Response) => {
  const sessionId = req.params.sessionId as string;

  if (!UUID_RE.test(sessionId)) {
    return res.status(400).json({ error: "Invalid session ID format" });
  }

  const requestingUserId = req.isAuthenticated() ? req.user.id : null;

  try {
    const rows = await db
      .select()
      .from(completedInterviewsTable)
      .where(sql`${completedInterviewsTable.record}->>'sessionId' = ${sessionId}`)
      .orderBy(desc(completedInterviewsTable.savedAt))
      .limit(1);

    if (!rows.length) {
      return res.status(404).json({ error: "Record not found" });
    }

    const record = rows[0].record as { sessionId?: string; user?: { id?: string } | null };
    const recordUserId = record?.user?.id ?? null;

    if (recordUserId !== null) {
      // Authenticated-user record: require the same user to be logged in
      if (recordUserId !== requestingUserId) {
        return res.status(403).json({ error: "Forbidden" });
      }
    } else {
      // Guest record: require the HMAC-signed claim cookie set when the session was created
      const cookieVal = req.cookies?.[guestClaimCookieName(sessionId)];
      if (!verifyGuestClaim(sessionId, cookieVal)) {
        return res.status(403).json({ error: "Forbidden" });
      }
    }

    return res.json(rows[0].record);
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch record" });
  }
});

export default router;
