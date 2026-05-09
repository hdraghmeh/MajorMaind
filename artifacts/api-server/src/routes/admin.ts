import fs from "fs";
import path from "path";
import { Router, type IRouter, type Request, type Response } from "express";

const router: IRouter = Router();

const DATA_DIR = path.resolve(
  path.dirname(new URL(import.meta.url).pathname),
  "../../data/completed-interviews",
);

function getAdminToken(): string {
  return process.env.ADMIN_TOKEN ?? "";
}

function isAuthorized(req: Request): boolean {
  const token = getAdminToken();
  if (!token) return false;
  const auth = req.headers["authorization"] ?? "";
  if (auth.startsWith("Bearer ")) return auth.slice(7) === token;
  // also allow ?token= query param
  return req.query.token === token;
}

async function readAllRecords(): Promise<unknown[]> {
  try {
    await fs.promises.mkdir(DATA_DIR, { recursive: true });
    const files = await fs.promises.readdir(DATA_DIR);
    const jsonFiles = files
      .filter((f) => f.endsWith(".json"))
      .sort()
      .reverse(); // newest first

    const records = await Promise.all(
      jsonFiles.map(async (file) => {
        try {
          const content = await fs.promises.readFile(
            path.join(DATA_DIR, file),
            "utf8",
          );
          return { ...JSON.parse(content), _filename: file };
        } catch {
          return null;
        }
      }),
    );

    return records.filter(Boolean);
  } catch {
    return [];
  }
}

// GET /api/admin/interviews — list all completed interviews
router.get("/admin/interviews", async (req: Request, res: Response) => {
  if (!isAuthorized(req)) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const records = await readAllRecords();
  return res.json({ total: records.length, interviews: records });
});

// GET /api/admin/interviews/:recordId — single record detail
router.get(
  "/admin/interviews/:recordId",
  async (req: Request, res: Response) => {
    if (!isAuthorized(req)) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { recordId } = req.params;
    const records = (await readAllRecords()) as Array<{ recordId?: string }>;
    const found = records.find((r) => r.recordId === recordId);

    if (!found) {
      return res.status(404).json({ error: "Record not found" });
    }

    return res.json(found);
  },
);

export default router;
