import { Router, type IRouter, type Request, type Response } from "express";
import { db, interviewSessionsTable, completedInterviewsTable, usersTable } from "@workspace/db";
import { and, desc, eq, sql, isNull, or } from "drizzle-orm";
import { SaveInterviewSessionBody } from "@workspace/api-zod";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const router: IRouter = Router();

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

// PUT /api/interview-sessions/:sessionId — upsert a session (authenticated users only)
router.put("/interview-sessions/:sessionId", async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const sessionId = req.params.sessionId as string;

  if (!UUID_RE.test(sessionId)) {
    return res.status(400).json({ error: "Invalid session ID format" });
  }

  const callerId = req.user.id;

  const parsed = SaveInterviewSessionBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid session data" });
  }

  if (parsed.data.id !== sessionId) {
    return res.status(400).json({ error: "Session ID in body does not match path parameter" });
  }

  // Ownership + concurrency check
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

    if (ownerUserId !== null && ownerUserId !== callerId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    // Optimistic concurrency guard
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

  await db
    .insert(interviewSessionsTable)
    .values({
      id: sessionId,
      userId: callerId,
      data: sessionData as unknown as Record<string, unknown>,
    })
    .onConflictDoUpdate({
      target: interviewSessionsTable.id,
      set: {
        userId: callerId,
        data: sessionData as unknown as Record<string, unknown>,
        updatedAt: new Date(),
      },
    });

  // Back-fill user's first/last name from profileData if still empty
  const profileData = parsed.data.profileData as Record<string, unknown> | null | undefined;
  if (profileData?.name && typeof profileData.name === "string") {
    const parts = (profileData.name as string).trim().split(/\s+/);
    const firstName = parts[0] ?? null;
    const lastName = parts.slice(1).join(" ") || null;
    if (firstName) {
      await db
        .update(usersTable)
        .set({ firstName, lastName })
        .where(
          and(
            eq(usersTable.id, callerId),
            or(isNull(usersTable.firstName), eq(usersTable.firstName, "")),
          ),
        );
    }
  }

  return res.json(sessionData);
});

// GET /api/interview-result/:sessionId — retrieve a completed interview by session ID (auth required)
router.get("/interview-result/:sessionId", async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const sessionId = req.params.sessionId as string;

  if (!UUID_RE.test(sessionId)) {
    return res.status(400).json({ error: "Invalid session ID format" });
  }

  const requestingUserId = req.user.id;

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

    // Deny access if record has no owner (legacy guest) or belongs to a different user
    if (recordUserId === null || recordUserId !== requestingUserId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    return res.json(rows[0].record);
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch record" });
  }
});

export default router;
