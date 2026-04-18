import type {
  CreateSessionInput,
  JoinSessionInput,
  LanguageView,
  SessionMode,
  UpdateLineInput,
} from "./types";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function asNonEmptyString(value: unknown, field: string, maxLength = 120): string {
  if (typeof value !== "string") {
    throw new Error(`${field} must be a string.`);
  }
  const normalized = value.trim();
  if (!normalized) {
    throw new Error(`${field} is required.`);
  }
  if (normalized.length > maxLength) {
    throw new Error(`${field} must be at most ${maxLength} characters.`);
  }
  return normalized;
}

function asLanguageView(value: unknown): LanguageView {
  if (value === "both" || value === "tamil" || value === "english") {
    return value;
  }
  throw new Error("languageView is invalid.");
}

function asSessionMode(value: unknown): SessionMode {
  if (
    value === "Host controls each line" ||
    value === "Call and repeat" ||
    value === "Auto-scroll with audio"
  ) {
    return value;
  }
  throw new Error("mode is invalid.");
}

export function parseCreateSessionInput(payload: unknown): CreateSessionInput {
  if (!isObject(payload)) {
    throw new Error("Invalid session payload.");
  }

  return {
    title: asNonEmptyString(payload.title, "title", 100),
    slokaId: asNonEmptyString(payload.slokaId, "slokaId", 50),
    scheduledAt: asNonEmptyString(payload.scheduledAt, "scheduledAt", 80),
    languageView: asLanguageView(payload.languageView),
    mode: asSessionMode(payload.mode),
  };
}

export function parseJoinSessionInput(payload: unknown): JoinSessionInput {
  if (!isObject(payload)) {
    throw new Error("Invalid join payload.");
  }
  return {
    inviteCode: asNonEmptyString(payload.inviteCode, "inviteCode", 24).toUpperCase(),
    name: asNonEmptyString(payload.name, "name", 60),
  };
}

export function parseUpdateLineInput(payload: unknown): UpdateLineInput {
  if (!isObject(payload)) {
    throw new Error("Invalid line update payload.");
  }

  const action = payload.action;
  if (action !== "next" && action !== "prev") {
    throw new Error("action must be next or prev.");
  }

  return {
    action,
    hostKey: asNonEmptyString(payload.hostKey, "hostKey", 120),
  };
}
