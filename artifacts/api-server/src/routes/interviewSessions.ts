import { Router, type IRouter, type Request, type Response } from "express";
import { db, interviewSessionsTable } from "@workspace/db";
import { and, eq } from "drizzle-orm";
import { SaveInterviewSessionBody } from "@workspace/api-zod";

const router: IRouter = Router();

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

router.put("/interview-sessions/:sessionId", async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { sessionId } = req.params;
  const parsed = SaveInterviewSessionBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid session data" });
  }

  if (parsed.data.id !== sessionId) {
    return res.status(400).json({ error: "Session ID in body does not match path parameter" });
  }

  const sessionData = { ...parsed.data, updatedAt: new Date().toISOString() };

  await db
    .insert(interviewSessionsTable)
    .values({
      id: sessionId,
      userId: req.user.id,
      data: sessionData as unknown as Record<string, unknown>,
    })
    .onConflictDoUpdate({
      target: [interviewSessionsTable.userId, interviewSessionsTable.id],
      targetWhere: and(
        eq(interviewSessionsTable.userId, req.user.id),
        eq(interviewSessionsTable.id, sessionId),
      ),
      set: {
        data: sessionData as unknown as Record<string, unknown>,
        updatedAt: new Date(),
      },
    });

  return res.json(sessionData);
});

export default router;
