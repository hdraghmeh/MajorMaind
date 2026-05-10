import { Router, type IRouter, type Request, type Response } from "express";
import { db, completedInterviewsTable } from "@workspace/db";
import { desc, eq } from "drizzle-orm";

const router: IRouter = Router();

function isAuthorized(req: Request): boolean {
  const token = process.env.ADMIN_TOKEN ?? "";
  if (!token) return false;
  const auth = req.headers["authorization"] ?? "";
  if (auth.startsWith("Bearer ")) return auth.slice(7) === token;
  return req.query.token === token;
}

// GET /api/admin/interviews — list all completed interviews
router.get("/admin/interviews", async (req: Request, res: Response) => {
  if (!isAuthorized(req)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const rows = await db
      .select()
      .from(completedInterviewsTable)
      .orderBy(desc(completedInterviewsTable.savedAt));

    const interviews = rows.map((row) => ({
      ...(row.record as object),
      _dbId: row.id,
    }));

    return res.json({ total: interviews.length, interviews });
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch interviews" });
  }
});

// GET /api/admin/interviews/:recordId — single record detail
router.get(
  "/admin/interviews/:recordId",
  async (req: Request, res: Response) => {
    if (!isAuthorized(req)) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const recordId = req.params.recordId as string;

    try {
      const rows = await db
        .select()
        .from(completedInterviewsTable)
        .where(eq(completedInterviewsTable.id, recordId))
        .limit(1);

      if (!rows.length) {
        return res.status(404).json({ error: "Record not found" });
      }

      return res.json({ ...(rows[0].record as object), _dbId: rows[0].id });
    } catch (err) {
      return res.status(500).json({ error: "Failed to fetch record" });
    }
  },
);

export default router;
