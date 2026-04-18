export type LanguageView = "both" | "tamil" | "english";

export type SessionMode =
  | "Host controls each line"
  | "Call and repeat"
  | "Auto-scroll with audio";

export type SlokaLine = {
  tamil: string;
  english: string;
  pronunciation?: string;
  meaning: string;
};

export type Sloka = {
  id: string;
  title: string;
  titleTamil: string;
  category: string;
  duration: string;
  icon: string;
  lines: SlokaLine[];
};

export type SlokaSummary = Omit<Sloka, "lines"> & {
  lineCount: number;
};

export type SessionRecord = {
  id: string;
  inviteCode: string;
  title: string;
  slokaId: string;
  scheduledAt: string;
  languageView: LanguageView;
  mode: SessionMode;
  hostKey: string;
  participantCount: number;
  currentLine: number;
  createdAt: string;
  updatedAt: string;
};

export type SessionPublic = Omit<SessionRecord, "hostKey">;

export type CreateSessionInput = {
  title: string;
  slokaId: string;
  scheduledAt: string;
  languageView: LanguageView;
  mode: SessionMode;
};

export type JoinSessionInput = {
  inviteCode: string;
  name: string;
};

export type UpdateLineInput = {
  action: "next" | "prev";
  hostKey: string;
};
