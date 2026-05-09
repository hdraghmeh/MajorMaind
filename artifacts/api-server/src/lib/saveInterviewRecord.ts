import fs from "fs";
import path from "path";
import crypto from "crypto";

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

// Resolve the storage directory relative to this file's location
const DATA_DIR = path.resolve(
  path.dirname(new URL(import.meta.url).pathname),
  "../../data/completed-interviews",
);

/** Pair each advisor question with the student answer that followed it. */
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

/**
 * Save a completed interview to disk as a JSON file.
 * Directory is created automatically if it does not exist.
 * Returns the path of the saved file.
 */
export async function saveInterviewRecord(
  messages: InterviewMessage[],
  recommendation: InterviewRecommendation,
  user: InterviewRecordUser | null,
): Promise<string> {
  const recordId = crypto.randomBytes(8).toString("hex");
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = `${timestamp}_${recordId}.json`;

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

  await fs.promises.mkdir(DATA_DIR, { recursive: true });

  const filePath = path.join(DATA_DIR, filename);
  await fs.promises.writeFile(filePath, JSON.stringify(record, null, 2), "utf8");

  return filePath;
}
