import type { InterviewMessage, InterviewRecommendation } from "@workspace/api-client-react";

export type StoredSession = {
  id: string;
  createdAt: string;
  updatedAt: string;
  messages: InterviewMessage[];
  progress?: { percent: number; stage: string };
  recommendation?: InterviewRecommendation | null;
  title?: string;
};

const STORAGE_KEY = "majormind.sessions.v1";

export function getSessions(): Record<string, StoredSession> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to parse sessions", e);
    return {};
  }
}

export function getSession(id: string): StoredSession | null {
  const sessions = getSessions();
  return sessions[id] || null;
}

export function saveSession(session: StoredSession) {
  const sessions = getSessions();
  sessions[session.id] = { ...session, updatedAt: new Date().toISOString() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

export function createSession(): StoredSession {
  const newSession: StoredSession = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    messages: [],
  };
  saveSession(newSession);
  return newSession;
}
