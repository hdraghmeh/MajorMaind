import { Router, type IRouter, type Request, type Response } from "express";
import { db, feedbackTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import crypto from "crypto";

const router: IRouter = Router();

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function validateFeedbackBody(body: unknown): { sessionId?: string; rating: number; comment?: string } | null {
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;

  const rating = b.rating;
  if (typeof rating !== "number" || !Number.isInteger(rating) || rating < 1 || rating > 5) return null;

  const sessionId = b.sessionId;
  if (sessionId !== undefined && (typeof sessionId !== "string" || !UUID_RE.test(sessionId))) return null;

  const comment = b.comment;
  if (comment !== undefined && (typeof comment !== "string" || comment.length > 1000)) return null;

  return {
    rating,
    sessionId: typeof sessionId === "string" ? sessionId : undefined,
    comment: typeof comment === "string" && comment.trim() ? comment.trim() : undefined,
  };
}

router.post("/feedback", async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const data = validateFeedbackBody(req.body);
  if (!data) {
    return res.status(400).json({ error: "Invalid input" });
  }

  const { sessionId, rating, comment } = data;
  const userId = req.user.id;

  if (sessionId) {
    const existing = await db
      .select({ id: feedbackTable.id })
      .from(feedbackTable)
      .where(eq(feedbackTable.sessionId, sessionId))
      .limit(1);
    if (existing.length > 0) {
      return res.json({ id: existing[0].id, duplicate: true });
    }
  }

  const id = crypto.randomUUID();
  await db.insert(feedbackTable).values({
    id,
    sessionId: sessionId ?? null,
    userId,
    rating,
    comment: comment ?? null,
  });

  return res.status(201).json({ id });
});

router.get("/feedback/:sessionId", async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { sessionId } = req.params as { sessionId: string };
  if (!UUID_RE.test(sessionId)) {
    return res.status(400).json({ error: "Invalid session ID" });
  }

  const rows = await db
    .select()
    .from(feedbackTable)
    .where(eq(feedbackTable.sessionId, sessionId))
    .limit(1);

  if (!rows.length) return res.status(404).json({ error: "Not found" });
  return res.json(rows[0]);
});

export default router;
