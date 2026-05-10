import { isNull } from "drizzle-orm";
import { db, interviewSessionsTable, completedInterviewsTable } from "@workspace/db";
import app from "./app";
import { logger } from "./lib/logger";

const MAX_LOGGED_IDS = 10;

function cappedIds(ids: string[]): { sampleIds: string[]; totalCount: number } {
  return { sampleIds: ids.slice(0, MAX_LOGGED_IDS), totalCount: ids.length };
}

async function cleanupNullUserRows(): Promise<void> {
  const deletedSessions = await db
    .delete(interviewSessionsTable)
    .where(isNull(interviewSessionsTable.userId))
    .returning({ id: interviewSessionsTable.id });

  if (deletedSessions.length > 0) {
    logger.warn(
      cappedIds(deletedSessions.map((r) => r.id)),
      "Startup cleanup: deleted interview_sessions rows with NULL user_id",
    );
  }

  const deletedInterviews = await db
    .delete(completedInterviewsTable)
    .where(isNull(completedInterviewsTable.userId))
    .returning({ id: completedInterviewsTable.id });

  if (deletedInterviews.length > 0) {
    logger.warn(
      cappedIds(deletedInterviews.map((r) => r.id)),
      "Startup cleanup: deleted completed_interviews rows with NULL user_id",
    );
  }
}

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

cleanupNullUserRows()
  .catch((err) => {
    logger.error({ err }, "Startup cleanup failed; server will continue");
  })
  .then(() => {
    app.listen(port, (err) => {
      if (err) {
        logger.error({ err }, "Error listening on port");
        process.exit(1);
      }

      logger.info({ port }, "Server listening");
    });
  });
