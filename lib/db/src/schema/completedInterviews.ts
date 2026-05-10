import { integer, jsonb, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { usersTable } from "./auth";

export const completedInterviewsTable = pgTable("completed_interviews", {
  id: varchar("id").primaryKey(),
  savedAt: timestamp("saved_at", { withTimezone: true }).notNull().defaultNow(),
  userId: varchar("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  userEmail: varchar("user_email"),
  userFirstName: varchar("user_first_name"),
  userLastName: varchar("user_last_name"),
  recommendedMajor: varchar("recommended_major").notNull(),
  matchScore: integer("match_score").notNull(),
  totalMessages: integer("total_messages").notNull(),
  record: jsonb("record").notNull(),
});

export type CompletedInterviewRow = typeof completedInterviewsTable.$inferSelect;
