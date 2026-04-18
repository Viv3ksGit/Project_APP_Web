import { randomBytes, randomUUID } from "node:crypto";
import { getSlokaById } from "@/lib/domain/slokas";
import type { CreateSessionInput, SessionPublic, SessionRecord, UpdateLineInput } from "@/lib/domain/types";

const sessions = new Map<string, SessionRecord>();
const inviteIndex = new Map<string, string>();

function nowIso(): string {
  return new Date().toISOString();
}

function createInviteCode(): string {
  return randomBytes(4).toString("hex").toUpperCase();
}

function createHostKey(): string {
  return randomBytes(16).toString("hex");
}

function toPublic(session: SessionRecord): SessionPublic {
  const { hostKey, ...publicSession } = session;
  void hostKey;
  return publicSession;
}

export function listSessions(): SessionPublic[] {
  return Array.from(sessions.values())
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    .map(toPublic);
}

export function getSessionById(sessionId: string): SessionPublic | null {
  const session = sessions.get(sessionId);
  if (!session) return null;
  return toPublic(session);
}

export function getSessionByInviteCode(inviteCode: string): SessionPublic | null {
  const sessionId = inviteIndex.get(inviteCode.toUpperCase());
  if (!sessionId) return null;
  return getSessionById(sessionId);
}

export function createSession(input: CreateSessionInput): SessionPublic & { hostKey: string } {
  const sloka = getSlokaById(input.slokaId);
  if (!sloka) {
    throw new Error("Selected sloka was not found.");
  }

  const id = randomUUID();
  const inviteCode = createInviteCode();
  const hostKey = createHostKey();
  const timestamp = nowIso();

  const record: SessionRecord = {
    id,
    inviteCode,
    title: input.title,
    slokaId: input.slokaId,
    scheduledAt: input.scheduledAt,
    languageView: input.languageView,
    mode: input.mode,
    hostKey,
    participantCount: 1,
    currentLine: 0,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  sessions.set(id, record);
  inviteIndex.set(inviteCode, id);

  return { ...toPublic(record), hostKey };
}

export function joinSessionByInvite(inviteCode: string): SessionPublic {
  const sessionId = inviteIndex.get(inviteCode.toUpperCase());
  if (!sessionId) {
    throw new Error("Session invite code is invalid.");
  }
  const session = sessions.get(sessionId);
  if (!session) {
    throw new Error("Session was not found.");
  }

  session.participantCount += 1;
  session.updatedAt = nowIso();

  return toPublic(session);
}

export function updateSessionLine(sessionId: string, input: UpdateLineInput): SessionPublic {
  const session = sessions.get(sessionId);
  if (!session) {
    throw new Error("Session was not found.");
  }
  if (session.hostKey !== input.hostKey) {
    throw new Error("Host key is invalid.");
  }

  const sloka = getSlokaById(session.slokaId);
  if (!sloka) {
    throw new Error("Sloka for this session was not found.");
  }

  if (input.action === "next") {
    session.currentLine = Math.min(sloka.lines.length - 1, session.currentLine + 1);
  } else {
    session.currentLine = Math.max(0, session.currentLine - 1);
  }

  session.updatedAt = nowIso();
  return toPublic(session);
}
