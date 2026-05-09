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
  syncSessionToServer(sessions[session.id]);
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

async function syncSessionToServer(session: StoredSession): Promise<void> {
  try {
    await fetch(`/api/interview-sessions/${session.id}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(session),
    });
  } catch {
    // Silently ignore server sync failures — localStorage is the source of truth for guests
  }
}

export async function loadSessionsFromServer(): Promise<StoredSession[]> {
  try {
    const res = await fetch("/api/interview-sessions", { credentials: "include" });
    if (!res.ok) return [];
    const data = (await res.json()) as { sessions: StoredSession[] };
    return data.sessions ?? [];
  } catch {
    return [];
  }
}

export async function mergeServerSessions(serverSessions: StoredSession[]): Promise<void> {
  const local = getSessions();
  let changed = false;
  for (const s of serverSessions) {
    const existing = local[s.id];
    if (!existing || new Date(s.updatedAt) > new Date(existing.updatedAt)) {
      local[s.id] = s;
      changed = true;
    }
  }
  if (changed) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(local));
  }
}

export async function backfillLocalSessionsToServer(serverSessions: StoredSession[]): Promise<void> {
  const local = getSessions();
  const serverIds = new Set(serverSessions.map((s) => s.id));

  const toUpload = Object.values(local).filter((s) => {
    if (s.messages.length === 0) return false;
    if (!serverIds.has(s.id)) return true;
    const serverVersion = serverSessions.find((sv) => sv.id === s.id);
    return serverVersion && new Date(s.updatedAt) > new Date(serverVersion.updatedAt);
  });

  await Promise.allSettled(
    toUpload.map((session) =>
      fetch(`/api/interview-sessions/${session.id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(session),
      }),
    ),
  );
}
