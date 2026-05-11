import { Router, type IRouter, type Request, type Response } from "express";
import { HealthCheckResponse } from "@workspace/api-zod";
import { cleanupStats } from "../lib/cleanupStats";

const router: IRouter = Router();

const startedAt = new Date().toISOString();

router.get("/healthz", (_req, res) => {
  const data = HealthCheckResponse.parse({ status: "ok" });
  res.json(data);
});

router.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    startedAt,
    uptimeSeconds: Math.floor(process.uptime()),
    lastCleanupAt: cleanupStats.lastCleanupAt,
    rowsRemovedAtLastCleanup: cleanupStats.rowsRemovedAtLastCleanup,
  });
});

export default router;
