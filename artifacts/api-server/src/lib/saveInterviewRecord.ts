import crypto from "crypto";
import { db, completedInterviewsTable } from "@workspace/db";

export interface InterviewMessage {
  role: "student" | "advisor";
  content: string;
}

export interface InterviewRecommendation {
  recommendedMajor: string;
  matchScore: number;
  whyItFits: string[];
  alternativeMajors: string[];
  academicStrengths: string[];
  careerAdvice: string[];
  closingMessage: string;
  admissionNote?: string | null;
}

export interface InterviewRecordUser {
  id: string;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
}

export interface InterviewRecord {
  recordId: string;
  savedAt: string;
  user: InterviewRecordUser | null;
  totalMessages: number;
  studentAnswers: Array<{ question: string; answer: string }>;
  recommendation: InterviewRecommendation;
  fullConversation: InterviewMessage[];
}

function extractQA(
  messages: InterviewMessage[],
): Array<{ question: string; answer: string }> {
  const pairs: Array<{ question: string; answer: string }> = [];
  for (let i = 0; i < messages.length - 1; i++) {
    if (messages[i].role === "advisor" && messages[i + 1].role === "student") {
      pairs.push({
        question: messages[i].content,
        answer: messages[i + 1].content,
      });
    }
  }
  return pairs;
}

export async function saveInterviewRecord(
  messages: InterviewMessage[],
  recommendation: InterviewRecommendation,
  user: InterviewRecordUser | null,
): Promise<string> {
  const recordId = crypto.randomBytes(8).toString("hex");

  const record: InterviewRecord = {
    recordId,
    savedAt: new Date().toISOString(),
    user: user
      ? {
          id: user.id,
          email: user.email ?? null,
          firstName: user.firstName ?? null,
          lastName: user.lastName ?? null,
        }
      : null,
    totalMessages: messages.length,
    studentAnswers: extractQA(messages),
    recommendation,
    fullConversation: messages,
  };

  await db.insert(completedInterviewsTable).values({
    id: recordId,
    userId: user?.id ?? null,
    userEmail: user?.email ?? null,
    userFirstName: user?.firstName ?? null,
    userLastName: user?.lastName ?? null,
    recommendedMajor: recommendation.recommendedMajor,
    matchScore: recommendation.matchScore,
    totalMessages: messages.length,
    record: record as unknown as Record<string, unknown>,
  });

  return recordId;
}
