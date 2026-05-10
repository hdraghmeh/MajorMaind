import { jsonb, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { usersTable } from "./auth";

export const interviewSessionsTable = pgTable("interview_sessions", {
  id: varchar("id").primaryKey(),
  userId: varchar("user_id").references(() => usersTable.id, {
    onDelete: "set null",
  }),
  data: jsonb("data").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type InterviewSessionRow = typeof interviewSessionsTable.$inferSelect;
