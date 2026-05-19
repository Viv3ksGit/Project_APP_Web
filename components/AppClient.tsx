"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type TouchEvent as ReactTouchEvent } from "react";
import Image from "next/image";
import Sanscript from "@indic-transliteration/sanscript";
import type { Sloka, SlokaSummary } from "@/lib/domain/types";

type Route = "landing" | "home" | "calendar" | "gods" | "sessions" | "chantlists" | "library" | "detail" | "favorites" | "profile" | "phase2";
type AppClientProps = {
  initialSlokaList: SlokaSummary[];
  initialSloka: Sloka;
};
type SlokaLineItem = Sloka["lines"][number];
type SearchSuggestion = {
  value: string;
  rank: number;
};
type ReaderLanguage = "tamil" | "english";
type SetupLanguageChoice = "tamil" | "english";
type SetupViewMode = "tamil_only" | "tamil_english";
type SetupRitualStyle = "calm" | "count" | "timed";
type SetupScrollSpeed = "slow" | "medium" | "fast";
type SetupReminderPreset = "morning" | "evening" | "custom" | "none";
type TamilCalendarToday = {
  date: string;
  weekday: string;
  tithi: string;
  paksha: string;
  masa: string;
  highlight: string;
  festivals: Array<{ name: string; category: string }>;
  location: string;
};

const STORAGE_KEYS = {
  favorites: "sloka_sabha_favorites_v2",
  chantProgress: "sloka_sabha_chant_progress_v1",
  slokaPractice: "sloka_sabha_sloka_practice_v1",
  chantLists: "sloka_sabha_chant_lists_v1",
  reminders: "sloka_sabha_reminders_v1",
  readerPrefs: "sloka_sabha_reader_prefs_v1",
  setupProfile: "sloka_sabha_setup_profile_v1",
  theme: "msr_theme_v1",
};
const WEEK_DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;
const DAILY_TARGET_OPTIONS = [11, 21, 51] as const;
const SLOKA_RECOMMENDATIONS: Record<string, { days: string[]; reason: string }> = {
  // Shiva — Monday
  "lingashtakam": { days: ["Monday"], reason: "Traditionally chanted for Shiva on Mondays." },
  "shiva-panchakshara-stotram": { days: ["Monday"], reason: "A common Shiva stotram for Monday prayers." },
  "maha-mrityunjaya": { days: ["Monday"], reason: "Chanted on Mondays for Lord Shiva's blessings." },
  "shiva-moola-mantra": { days: ["Monday"], reason: "Om Namah Shivaya is chanted every Monday." },
  "shiva-ashtakam": { days: ["Monday"], reason: "Monday Shiva worship tradition." },
  "shiva-tandava-stotram": { days: ["Monday", "Friday"], reason: "Chanted for Shiva on Mondays and auspicious Fridays." },
  "shiva-chalisa": { days: ["Monday"], reason: "Shiva Chalisa chanted on Mondays." },
  // Vishnu / Guruvayurappan — Thursday, Saturday
  "shantakaram-bhujagashayanam": { days: ["Thursday", "Saturday"], reason: "Vishnu prayers observed on Thursdays and Saturdays." },
  "vishnu-sahasranama-excerpt": { days: ["Thursday", "Saturday"], reason: "Vishnu Sahasranama chanted on Thursdays." },
  "venkateshwara-suprabhatam": { days: ["Thursday", "Saturday"], reason: "Venkateshwara Suprabhatam chanted daily, especially on Saturdays." },
  "narayaniyam-dhyanam": { days: ["Thursday"], reason: "Guruvayurappan worship is observed on Thursdays." },
  // Devi — Friday
  "ya-devi-sarva-bhuteshu": { days: ["Friday"], reason: "Friday is the auspicious day for Devi worship." },
  "lalitha-sahasranama-excerpt": { days: ["Friday"], reason: "Lalitha Sahasranama is chanted on Fridays." },
  "mahalakshmi-ashtakam": { days: ["Friday"], reason: "Lakshmi puja is observed on Fridays." },
  // Hanuman — Tuesday, Saturday
  "hanuman-chalisa": { days: ["Tuesday", "Saturday"], reason: "Tuesday and Saturday are dedicated to Lord Hanuman." },
  "hanuman-dhyanam": { days: ["Tuesday", "Saturday"], reason: "Hanuman worship on Tuesdays and Saturdays." },
  // Muruga — Tuesday, Friday (from xlsx)
  "kanda-shashti-kavasam-excerpt": { days: ["Tuesday", "Friday"], reason: "Muruga worship on Tuesdays; Skanda Sashti falls on Fridays." },
  "subramanya-bhujangam": { days: ["Tuesday", "Friday"], reason: "Subramanya puja on Tuesdays and Fridays." },
  "thirumurugatrupadai-excerpt": { days: ["Tuesday"], reason: "Thirumurugatrupadai chanted on Tuesdays for Muruga." },
  "kandar-anoobothi": { days: ["Tuesday", "Friday"], reason: "Muruga devotion on Tuesdays and Fridays." },
  "kandar-alangaram": { days: ["Friday"], reason: "Kandar Alangaram chanted on Fridays for family harmony." },
  "vel-maral": { days: ["Tuesday"], reason: "Vel Maral chanted on Tuesdays for strength and obstacle removal." },
  "thirupugazh-arumugam": { days: ["Tuesday", "Friday"], reason: "Thirupugazh is chanted on Tuesdays and Fridays." },
  // Ganesh — Wednesday, before any important day
  "vakratunda-mahakaya": { days: ["Wednesday"], reason: "Ganesh worship is observed on Wednesdays." },
  "ganesha-pancharatnam": { days: ["Wednesday"], reason: "Ganesha puja on Wednesdays." },
  "vinayagar-agaval": { days: ["Wednesday"], reason: "Vinayagar Agaval chanted on Wednesdays." },
  "karya-sidhi-malai": { days: ["Wednesday"], reason: "Karya Sidhi Malai chanted for success on Wednesdays." },
  // Guru — Thursday
  "guru-brahma-guru-vishnu": { days: ["Thursday"], reason: "Thursday is Guru's day — Guruvara." },
  // Saraswati — Friday, before studies
  "saraswati-vandana": { days: ["Friday", "Thursday"], reason: "Saraswati Vandana chanted on Fridays and before study." },
  // Ayyappa — Saturday
  "harivarasanam": { days: ["Saturday"], reason: "Harivarasanam is the night hymn sung at Sabarimala on all days, especially Saturdays." },
  // Rama — Tuesday, Wednesday
  "rama-bhadram-bhajeham": { days: ["Tuesday", "Wednesday"], reason: "Rama chanting is auspicious on Tuesdays and Wednesdays." },
  // Krishna — Wednesday, Thursday
  "krishna-madhurashtakam": { days: ["Wednesday", "Thursday"], reason: "Krishna worship on Wednesdays and Thursdays." },
  "achyutam-keshavam": { days: ["Wednesday", "Thursday"], reason: "Achyutam Keshavam chanted on Wednesdays and Thursdays." },
};
const HANUMAN_ICON_SRC = "/brand/hanuman-icon-clean.png";
const DEITY_PHOTOS: Record<string, string> = {
  Shiva: "/deities/line/shiva-player-clean-v2.png",
  Hanuman: "/deities/line/hanuman.png",
  Durga: "/deities/line/durga.png",
  Vishnu: "/deities/line/vishnu.png",
  Guru: "/deities/line/ayyappa.png",
  Ganesh: "/deities/line/ganesh.png",
  Ganesha: "/deities/line/ganesh.png",
  Krishna: "/deities/line/krishna.png",
  Rama: "/deities/line/rama.png",
  Lakshmi: "/deities/line/lakshmi.png",
  Saraswati: "/deities/line/saraswati.png",
  Muruga: "/deities/line/muruga.png",
  Kali: "/deities/line/kali.png",
  Brahma: "/deities/line/brahma.png",
  Ayyappa: "/deities/line/ayyappa.png",
  Guruvayurappan: "/deities/line/guruvayurappan.png",
  "Sai Baba": "/deities/line/sai-baba.png",
  Surya: "/deities/line/surya.png",
  Narasimha: "/deities/line/narasimha.png",
  Venkateshwara: "/deities/line/venkateshwara.png",
  Amman: "/deities/line/amman.png",
};
const DEITY_PLAYER_HERO_PHOTOS: Partial<Record<string, string>> = {
  Hanuman: "/deities/line/hanuman.png",
  Shiva: "/deities/line/shiva-player-clean-v2.png",
  Ganesh: "/deities/line/ganesh.png",
  Ganesha: "/deities/line/ganesh.png",
  Krishna: "/deities/line/krishna.png",
  Lakshmi: "/deities/line/lakshmi.png",
  Durga: "/deities/line/durga.png",
  Vishnu: "/deities/line/vishnu-clean.png",
};
const BRAND_MARK_SRC = "/brand/my-shloka-ritual-mark.png";
const BRAND_LOGO_SRC = "/brand/my-shloka-ritual-logo-transparent.png";
const LANDING_ONBOARDING_STEPS = [
  { id: "brand" },
  {
    description: "Daily chants, mindful listening and meaningful progress to bring inner calm.",
    id: "nourish",
    title: "Nourish Your Soul",
  },
] as const;
const POPULAR_SLOKA_ORDER = [
  "hanuman-chalisa",
  "lingashtakam",
  "shiva-panchakshara-stotram",
  "shantakaram-bhujagashayanam",
  "ya-devi-sarva-bhuteshu",
  "guru-brahma-guru-vishnu",
] as const;

type ChantProgress = {
  dailyTarget: number;
  dailyCount: number;
  totalCount: number;
  streakDays: number;
  lastChantDate: string;
  perSlokaCount: Record<string, number>;
};

type ReminderSettings = {
  enabled: boolean;
  time: string;
  days: string[];
  lastNotifiedDate: string;
};
type ReaderPrefs = {
  fontScale: number;
  language: ReaderLanguage;
  showMeaning: boolean;
};

type SetupProfile = {
  name: string;
  completed: boolean;
  dailyGoal: number;
  dailyMinutes: number;
  language: SetupLanguageChoice;
  viewMode: SetupViewMode;
  ritualStyle: SetupRitualStyle;
  autoScroll: boolean;
  scrollSpeed: SetupScrollSpeed;
  reminderPreset: SetupReminderPreset;
  reminderTime: string;
  reminderEnabled: boolean;
  quoteEnabled: boolean;
};

type SlokaPracticeEntry = {
  scheduleTime: string;
  startedAt: string;
  endedAt: string;
  timeSpentSeconds: number;
  activeLineIndex: number;
  lineHighlights: Record<number, string>;
  completedDates: string[];
};

type SlokaPracticeState = Record<string, SlokaPracticeEntry>;

type ChantList = {
  id: string;
  name: string;
  slokaIds: string[];
  scheduleTime: string;
  enabled: boolean;
  lastNotifiedDate: string;
  createdAt: string;
};

const DEFAULT_CHANT_PROGRESS: ChantProgress = {
  dailyTarget: DAILY_TARGET_OPTIONS[0],
  dailyCount: 0,
  totalCount: 0,
  streakDays: 0,
  lastChantDate: "",
  perSlokaCount: {},
};

const DEFAULT_REMINDERS: ReminderSettings = {
  enabled: false,
  time: "06:30",
  days: ["Tuesday", "Saturday"],
  lastNotifiedDate: "",
};
const DEFAULT_READER_PREFS: ReaderPrefs = {
  fontScale: 0.62,
  language: "tamil",
  showMeaning: true,
};
const DEFAULT_SETUP_PROFILE: SetupProfile = {
  name: "Asha",
  completed: false,
  dailyGoal: 5,
  dailyMinutes: 15,
  language: "tamil",
  viewMode: "tamil_english",
  ritualStyle: "calm",
  autoScroll: true,
  scrollSpeed: "slow",
  reminderPreset: "morning",
  reminderTime: "07:00",
  reminderEnabled: true,
  quoteEnabled: true,
};

const DEFAULT_PRACTICE_ENTRY: SlokaPracticeEntry = {
  scheduleTime: "06:30",
  startedAt: "",
  endedAt: "",
  timeSpentSeconds: 0,
  activeLineIndex: 0,
  lineHighlights: {},
  completedDates: [],
};

const LINE_HIGHLIGHT_OPTIONS = [
  { label: "Gold", value: "gold" },
  { label: "Green", value: "green" },
  { label: "Rose", value: "rose" },
] as const;
const CELEBRATION_CONFETTI = [
  { left: "6%", delay: "0s", duration: "1300ms", color: "#c8a96b" },
  { left: "12%", delay: "120ms", duration: "1500ms", color: "#1f5d3a" },
  { left: "18%", delay: "320ms", duration: "1200ms", color: "#b87333" },
  { left: "25%", delay: "80ms", duration: "1400ms", color: "#d4af37" },
  { left: "33%", delay: "220ms", duration: "1350ms", color: "#17492d" },
  { left: "41%", delay: "420ms", duration: "1550ms", color: "#c8a96b" },
  { left: "50%", delay: "0ms", duration: "1450ms", color: "#2e7d32" },
  { left: "58%", delay: "210ms", duration: "1250ms", color: "#b87333" },
  { left: "66%", delay: "390ms", duration: "1600ms", color: "#d4af37" },
  { left: "74%", delay: "150ms", duration: "1350ms", color: "#17492d" },
  { left: "81%", delay: "340ms", duration: "1500ms", color: "#c8a96b" },
  { left: "88%", delay: "260ms", duration: "1400ms", color: "#2e7d32" },
  { left: "94%", delay: "420ms", duration: "1550ms", color: "#b87333" },
] as const;

function createId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function safeParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function getDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function dayDifference(fromDateKey: string, toDateKey: string): number {
  const from = new Date(`${fromDateKey}T00:00:00`);
  const to = new Date(`${toDateKey}T00:00:00`);
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  return Math.round((to.getTime() - from.getTime()) / millisecondsPerDay);
}

function parseDurationMinutes(durationLabel: string): number {
  const match = durationLabel.match(/\d+/);
  if (!match) return Number.POSITIVE_INFINITY;
  const parsedValue = Number(match[0]);
  return Number.isFinite(parsedValue) ? parsedValue : Number.POSITIVE_INFINITY;
}

function normalizeReminderSettings(value: ReminderSettings): ReminderSettings {
  const validDays = value.days.filter((day) => WEEK_DAYS.includes(day as (typeof WEEK_DAYS)[number]));
  return {
    ...DEFAULT_REMINDERS,
    ...value,
    days: validDays.length > 0 ? validDays : DEFAULT_REMINDERS.days,
  };
}

function normalizeProgressForToday(value: ChantProgress, todayDateKey: string): ChantProgress {
  if (!value.lastChantDate || value.lastChantDate === todayDateKey) return value;
  return {
    ...value,
    dailyCount: 0,
  };
}

function normalizePracticeEntry(value?: Partial<SlokaPracticeEntry>): SlokaPracticeEntry {
  return {
    ...DEFAULT_PRACTICE_ENTRY,
    ...value,
    completedDates: Array.isArray(value?.completedDates) ? value.completedDates.filter(Boolean) : [],
    lineHighlights:
      value?.lineHighlights && typeof value.lineHighlights === "object" && !Array.isArray(value.lineHighlights)
        ? value.lineHighlights
        : {},
    activeLineIndex: Number.isFinite(value?.activeLineIndex) ? Math.max(0, Number(value?.activeLineIndex)) : 0,
    timeSpentSeconds: Number.isFinite(value?.timeSpentSeconds) ? Math.max(0, Number(value?.timeSpentSeconds)) : 0,
  };
}

function normalizePracticeState(value: SlokaPracticeState): SlokaPracticeState {
  return Object.fromEntries(Object.entries(value).map(([slokaId, entry]) => [slokaId, normalizePracticeEntry(entry)]));
}

function normalizeChantLists(value: ChantList[]): ChantList[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((list) => list && typeof list.id === "string" && typeof list.name === "string")
    .map((list) => ({
      id: list.id,
      name: list.name.trim() || "My Chant List",
      slokaIds: Array.isArray(list.slokaIds) ? Array.from(new Set(list.slokaIds.filter(Boolean))) : [],
      scheduleTime: list.scheduleTime || "06:30",
      enabled: Boolean(list.enabled),
      lastNotifiedDate: list.lastNotifiedDate || "",
      createdAt: list.createdAt || new Date().toISOString(),
    }));
}

function normalizeSetupProfile(value: SetupProfile): SetupProfile {
  const name = value.name?.trim() || DEFAULT_SETUP_PROFILE.name;
  const dailyGoal = Number.isFinite(value.dailyGoal) ? Math.min(108, Math.max(1, Math.round(value.dailyGoal))) : DEFAULT_SETUP_PROFILE.dailyGoal;
  const dailyMinutes = Number.isFinite(value.dailyMinutes)
    ? Math.min(180, Math.max(5, Math.round(value.dailyMinutes)))
    : DEFAULT_SETUP_PROFILE.dailyMinutes;
  const language = (["tamil", "english"] as const).includes(value.language)
    ? value.language
    : DEFAULT_SETUP_PROFILE.language;
  const viewMode = (["tamil_only", "tamil_english"] as const).includes(value.viewMode)
    ? value.viewMode
    : DEFAULT_SETUP_PROFILE.viewMode;
  const ritualStyle = (["calm", "count", "timed"] as const).includes(value.ritualStyle) ? value.ritualStyle : DEFAULT_SETUP_PROFILE.ritualStyle;
  const scrollSpeed = (["slow", "medium", "fast"] as const).includes(value.scrollSpeed) ? value.scrollSpeed : DEFAULT_SETUP_PROFILE.scrollSpeed;
  const reminderPreset = (["morning", "evening", "custom", "none"] as const).includes(value.reminderPreset)
    ? value.reminderPreset
    : DEFAULT_SETUP_PROFILE.reminderPreset;
  const reminderTime = /^\d{2}:\d{2}$/.test(value.reminderTime) ? value.reminderTime : DEFAULT_SETUP_PROFILE.reminderTime;

  return {
    ...DEFAULT_SETUP_PROFILE,
    ...value,
    name,
    dailyGoal,
    dailyMinutes,
    language,
    viewMode,
    ritualStyle,
    scrollSpeed,
    reminderPreset,
    reminderTime,
    autoScroll: Boolean(value.autoScroll),
    reminderEnabled: Boolean(value.reminderEnabled),
    quoteEnabled: Boolean(value.quoteEnabled),
    completed: Boolean(value.completed),
  };
}

function getReaderPrefsFromSetup(setup: SetupProfile): Pick<ReaderPrefs, "language" | "showMeaning"> {
  if (setup.language === "english") {
    return { language: "english", showMeaning: false };
  }
  if (setup.viewMode === "tamil_only") {
    return { language: "tamil", showMeaning: false };
  }
  return { language: "tamil", showMeaning: true };
}

function getAutoScrollTiming(speed: SetupScrollSpeed, ritualStyle: SetupRitualStyle): { pxPerSecond: number } {
  const basePxPerSecond = speed === "slow" ? 22 : speed === "medium" ? 42 : 70;
  if (ritualStyle === "calm") {
    return { pxPerSecond: Math.max(14, basePxPerSecond - 8) };
  }
  if (ritualStyle === "timed") {
    return { pxPerSecond: basePxPerSecond + 14 };
  }
  return { pxPerSecond: basePxPerSecond };
}

function findVerticalScrollContainer(): Window | HTMLElement {
  if (typeof window === "undefined" || typeof document === "undefined") return window;

  const candidates: (Element | null)[] = [
    document.querySelector(".screen.active.detail-screen.ref-player-screen"),
    document.querySelector(".screen.active.detail-screen"),
    document.querySelector("main"),
    document.querySelector(".app-shell"),
  ];

  for (const candidate of candidates) {
    if (!(candidate instanceof HTMLElement)) continue;
    const style = window.getComputedStyle(candidate);
    const allowsVerticalScroll = /(auto|scroll)/.test(style.overflowY);
    const hasOverflowContent = candidate.scrollHeight > candidate.clientHeight + 6;
    if (allowsVerticalScroll && hasOverflowContent) return candidate;
  }

  return window;
}

function hasTamilScript(text: string): boolean {
  return /[\u0b80-\u0bff]/.test(text);
}

function toTamilScript(text: string): string {
  const normalized = text.trim();
  if (!normalized) return normalized;
  if (hasTamilScript(normalized)) return normalized;
  try {
    return Sanscript.t(normalized.toLowerCase(), "itrans", "tamil");
  } catch {
    return normalized;
  }
}

function FavoriteGlyph({ active }: { active: boolean }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path
        d="M12 20.6 4.9 14.2A5.7 5.7 0 0 1 3 9.9C3 6.9 5.2 4.6 8.1 4.6c1.5 0 2.9.7 3.9 1.9 1-1.2 2.4-1.9 3.9-1.9 2.9 0 5.1 2.3 5.1 5.3 0 1.6-.7 3.1-1.9 4.3L12 20.6Z"
        fill={active ? "currentColor" : "none"}
      />
    </svg>
  );
}

function BackGlyph() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2.25"
      viewBox="0 0 24 24"
    >
      <path d="M15 5 8 12l7 7" />
      <path d="M9 12h10" />
    </svg>
  );
}

function SearchGlyph() {
  return (
    <svg aria-hidden="true" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.9" viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" />
    </svg>
  );
}

function FilterGlyph() {
  return (
    <svg aria-hidden="true" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.9" viewBox="0 0 24 24">
      <path d="M4 6h16" />
      <path d="M7 12h10" />
      <path d="M10 18h4" />
    </svg>
  );
}

function PlayerHeroCard({ imageSrc, deityName }: { imageSrc: string; deityName: string }) {
  const deityClassName = `deity-${deityName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  return (
    <article className="ref-player-hero-card">
      <div className="ref-player-ring">
        <Image
          alt={`${deityName} deity`}
          className={`ref-player-hero-image ${deityClassName} ${deityName === "Hanuman" ? "hanuman-deity-image" : ""}`}
          height={180}
          sizes="180px"
          src={imageSrc}
          unoptimized
          width={180}
        />
      </div>
    </article>
  );
}

function ShlokaTextBlock({
  title,
  lines,
  language,
  showMeaning,
  activeLineIndex,
  lineHighlights,
  onSelectLine,
  onSetLineHighlight,
  onRemoveLineHighlight,
}: {
  title: string;
  lines: SlokaLineItem[];
  language: ReaderLanguage;
  showMeaning: boolean;
  activeLineIndex: number;
  lineHighlights: Record<number, string>;
  onSelectLine: (lineIndex: number) => void;
  onSetLineHighlight: (color: string) => void;
  onRemoveLineHighlight: () => void;
}) {
  return (
    <article className="ref-player-text-card">
      <h2>{title}</h2>
      <div className="ref-player-full-sloka">
        {lines.map((line, index) => {
          const highlightColor = lineHighlights[index];
          return (
            <div
              className={`ref-player-line-pair ${activeLineIndex === index ? "active" : ""} ${
                highlightColor ? `highlight-${highlightColor}` : ""
              }`}
              key={`player-line-${index + 1}`}
            >
              <button className="ref-player-line-select" onClick={() => onSelectLine(index)} type="button">
                {language !== "english" && (
                  <p className="ref-player-sanskrit">{toTamilScript((line.tamil || line.english || "").trim())}</p>
                )}
                {language !== "tamil" && (
                  <p className="ref-player-transliteration">{(line.english || line.pronunciation || line.tamil || "").trim()}</p>
                )}
                {showMeaning && line.meaning?.trim() && <p className="ref-player-meaning">{line.meaning.trim()}</p>}
              </button>
              {activeLineIndex === index && (
                <div className="line-inline-highlight-panel" aria-label={`Line ${index + 1} highlight options`}>
                  {LINE_HIGHLIGHT_OPTIONS.map((option) => (
                    <button
                      className={`line-highlight-dot ${option.value} ${highlightColor === option.value ? "active" : ""}`}
                      key={`inline-line-highlight-${index}-${option.value}`}
                      onClick={() => onSetLineHighlight(option.value)}
                      title={`${option.label} highlight`}
                      type="button"
                    >
                      {option.label}
                    </button>
                  ))}
                  <button className="line-highlight-dot remove" onClick={onRemoveLineHighlight} type="button">
                    Remove
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </article>
  );
}

function ReaderControls({
  language,
  showMeaning,
  autoScroll,
  scrollSpeed,
  activeLineIndex,
  totalLines,
  onDecreaseFont,
  onIncreaseFont,
  onSetLanguage,
  onToggleMeaning,
  onToggleAutoScroll,
  onSetScrollSpeed,
  onPrevLine,
  onNextLine,
}: {
  language: ReaderLanguage;
  showMeaning: boolean;
  autoScroll: boolean;
  scrollSpeed: SetupScrollSpeed;
  activeLineIndex: number;
  totalLines: number;
  onDecreaseFont: () => void;
  onIncreaseFont: () => void;
  onSetLanguage: (language: ReaderLanguage) => void;
  onToggleMeaning: () => void;
  onToggleAutoScroll: () => void;
  onSetScrollSpeed: (speed: SetupScrollSpeed) => void;
  onPrevLine: () => void;
  onNextLine: () => void;
}) {
  return (
    <article className="ref-reader-controls-card" aria-label="Reader controls">
      {/* Row 1: language + meaning + font */}
      <div className="rcc-row">
        <div className="rcc-seg">
          <button className={`rcc-seg-btn ${language === "tamil" ? "active" : ""}`} onClick={() => onSetLanguage("tamil")} type="button">{"\u0ba4\u0bae\u0bbf\u0bb4\u0bcd"}</button>
          <button className={`rcc-seg-btn ${language === "english" ? "active" : ""}`} onClick={() => onSetLanguage("english")} type="button">English</button>
        </div>
        <button className={`rcc-pill ${showMeaning ? "active" : ""}`} onClick={onToggleMeaning} type="button">Meaning</button>
        <div className="rcc-seg rcc-font-seg">
          <button className="rcc-seg-btn" onClick={onDecreaseFont} aria-label="Smaller text" type="button"><span className="rcc-a-sm">A</span></button>
          <button className="rcc-seg-btn" onClick={onIncreaseFont} aria-label="Larger text" type="button"><span className="rcc-a-lg">A</span></button>
        </div>
      </div>

      {/* Row 2: line nav + auto-scroll + speed */}
      <div className="rcc-row">
        <div className="rcc-seg">
          <button className="rcc-seg-btn rcc-nav-btn" onClick={onPrevLine} disabled={activeLineIndex === 0} aria-label="Previous line" type="button">
            <svg aria-hidden="true" fill="none" height="12" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24" width="12"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <span className="rcc-count">{activeLineIndex + 1}<em>/</em>{totalLines}</span>
          <button className="rcc-seg-btn rcc-nav-btn" onClick={onNextLine} disabled={activeLineIndex >= totalLines - 1} aria-label="Next line" type="button">
            <svg aria-hidden="true" fill="none" height="12" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24" width="12"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>

        <button className={`rcc-pill ${autoScroll ? "active" : ""}`} onClick={onToggleAutoScroll} type="button">
          Scroll {autoScroll ? "On" : "Off"}
        </button>

        <div className="rcc-seg">
          <button className={`rcc-seg-btn ${scrollSpeed === "slow" ? "active" : ""}`} onClick={() => onSetScrollSpeed("slow")} type="button">Slow</button>
          <button className={`rcc-seg-btn ${scrollSpeed === "medium" ? "active" : ""}`} onClick={() => onSetScrollSpeed("medium")} type="button">Med</button>
          <button className={`rcc-seg-btn ${scrollSpeed === "fast" ? "active" : ""}`} onClick={() => onSetScrollSpeed("fast")} type="button">Fast</button>
        </div>
      </div>
    </article>
  );
}

function SlokaTile({ sloka }: { sloka: SlokaSummary }) {
  const photoSrc = DEITY_PHOTOS[sloka.category];
  if (photoSrc) {
    return (
      <span className="tile image">
        <Image
          alt={`${sloka.category} icon`}
          className={`tile-image ${sloka.category === "Hanuman" ? "hanuman-deity-image" : ""}`}
          height={46}
          sizes="46px"
          src={photoSrc}
          unoptimized
          width={46}
        />
      </span>
    );
  }

  return <span className="tile">{sloka.category.slice(0, 2).toUpperCase()}</span>;
}

function RitualNavIcon({ name }: { name: "chants" | "counter" | "home" | "menu" | "profile" }) {
  if (name === "home") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M4 11.5 12 5l8 6.5" />
        <path d="M6.5 10.5V20h11v-9.5" />
        <path d="M9.5 20v-5h5v5" />
      </svg>
    );
  }

  if (name === "chants") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M12 14c-3 0-5.5-1.6-5.5-4 0-1.7 1.4-3 3-3 1 0 1.9.4 2.5 1 .6-.6 1.5-1 2.5-1 1.6 0 3 1.3 3 3 0 2.4-2.5 4-5.5 4Z" />
        <path d="M8 13.5c0 1.1 1.8 2 4 2s4-.9 4-2" />
        <path d="M12 5.5v-2" />
        <path d="M8.5 6 7.5 4.2" />
        <path d="M15.5 6l1-1.8" />
        <path d="M5.5 8.5 4 7.5" />
        <path d="M18.5 8.5 20 7.5" />
      </svg>
    );
  }

  if (name === "counter") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M12 4.5a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15Z" />
        <circle cx="12"   cy="4.5"  r="1.4" />
        <circle cx="17.3" cy="6.7"  r="1.1" />
        <circle cx="19.5" cy="12"   r="1.1" />
        <circle cx="17.3" cy="17.3" r="1.1" />
        <circle cx="12"   cy="19.5" r="1.1" />
        <circle cx="6.7"  cy="17.3" r="1.1" />
        <circle cx="4.5"  cy="12"   r="1.1" />
        <circle cx="6.7"  cy="6.7"  r="1.1" />
      </svg>
    );
  }

  if (name === "profile") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M12 12.5a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
        <path d="M4.5 20c1.2-3.3 3.7-5 7.5-5s6.3 1.7 7.5 5" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M5 7h14" />
      <path d="M5 12h14" />
      <path d="M5 17h14" />
    </svg>
  );
}

function getDayGreeting(date: Date) {
  const hour = date.getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  if (hour < 21) return "Good Evening";
  return "Good Night";
}

export function AppClient({ initialSlokaList, initialSloka }: AppClientProps) {
  const [route, setRouteState] = useState<Route>("landing");
  const [isSideMenuOpen, setIsSideMenuOpen] = useState<boolean>(false);
  const [detailBackRoute, setDetailBackRoute] = useState<Route>("home");
  const [slokaList] = useState<SlokaSummary[]>(initialSlokaList);
  const [selectedSloka, setSelectedSloka] = useState<Sloka>(initialSloka);
  const [homeSearch, setHomeSearch] = useState<string>("");
  const [globalSearchOpen, setGlobalSearchOpen] = useState<boolean>(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState<string>("");
  const [homeDurationMax, setHomeDurationMax] = useState<number | null>(10);
  const [sessionDuration, setSessionDuration] = useState<number>(5);
  const [guidedStart, setGuidedStart] = useState<boolean>(false);
  const [showStartPrompt, setShowStartPrompt] = useState<boolean>(false);
  const [setupStep, setSetupStep] = useState<number>(0);
  const [setupProfile, setSetupProfile] = useState<SetupProfile>(DEFAULT_SETUP_PROFILE);
  const [librarySearch, setLibrarySearch] = useState<string>("");
  const [favoritesSearch, setFavoritesSearch] = useState<string>("");
  const [libraryCategory, setLibraryCategory] = useState<string>("all");
  const [godsCategory, setGodsCategory] = useState<string>("all");
  const [liveMessage, setLiveMessage] = useState<string>("");
  const [isHydrated, setIsHydrated] = useState<boolean>(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [chantProgress, setChantProgress] = useState<ChantProgress>(DEFAULT_CHANT_PROGRESS);
  const [slokaPractice, setSlokaPractice] = useState<SlokaPracticeState>({});
  const [chantLists, setChantLists] = useState<ChantList[]>([]);
  const [chantListName, setChantListName] = useState<string>("Morning Chant");
  const [chantListSelectedSlokaId, setChantListSelectedSlokaId] = useState<string>(initialSloka.id);
  const [detailChantListId, setDetailChantListId] = useState<string>("");
  const [activeChantListId, setActiveChantListId] = useState<string>("");
  const [chantCelebrationVisible, setChantCelebrationVisible] = useState<boolean>(false);
  const [chantCelebrationMessage, setChantCelebrationMessage] = useState<string>("");
  const [reminders, setReminders] = useState<ReminderSettings>(DEFAULT_REMINDERS);
  const [todayDay, setTodayDay] = useState<string>("");
  const [todayCalendar, setTodayCalendar] = useState<TamilCalendarToday | null>(null);
  const [dayGreeting] = useState<string>(() => getDayGreeting(new Date()));
  const [readerFontScale, setReaderFontScale] = useState<number>(DEFAULT_READER_PREFS.fontScale);
  const [readerLanguage, setReaderLanguage] = useState<ReaderLanguage>(DEFAULT_READER_PREFS.language);
  const [showMeaning, setShowMeaning] = useState<boolean>(DEFAULT_READER_PREFS.showMeaning);
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(false);
  const [landingSlideIndex, setLandingSlideIndex] = useState<number>(0);
  const [showCompletionPopup, setShowCompletionPopup] = useState<boolean>(false);
  const [completionPromptShown, setCompletionPromptShown] = useState<boolean>(false);
  const homeSearchInputRef = useRef<HTMLInputElement | null>(null);
  const landingTouchStartX = useRef<number | null>(null);
  const slokaOpenedAt = useRef<number>(0);

  const setRoute = useCallback((nextRoute: Route) => {
    setIsSideMenuOpen(false);
    setShowCompletionPopup(false);
    if (nextRoute !== "detail") setCompletionPromptShown(false);
    setRouteState(nextRoute);
  }, []);

  const goToLandingSlide = useCallback((nextIndex: number) => {
    const maxIndex = LANDING_ONBOARDING_STEPS.length - 1;
    setLandingSlideIndex(Math.max(0, Math.min(nextIndex, maxIndex)));
  }, []);

  useEffect(() => {
    if (route !== "landing") return;
    if (landingSlideIndex !== 0) return;
    if (setupProfile.completed) {
      const timer = window.setTimeout(() => {
        setRouteState("home");
      }, 1800);
      return () => window.clearTimeout(timer);
    }
    const timer = window.setTimeout(() => {
      setLandingSlideIndex(1);
    }, 2600);
    return () => window.clearTimeout(timer);
  }, [route, landingSlideIndex, setupProfile.completed]);

  const handleLandingTouchStart = useCallback((event: ReactTouchEvent<HTMLDivElement>) => {
    landingTouchStartX.current = event.touches[0]?.clientX ?? null;
  }, []);

  const handleLandingTouchEnd = useCallback((event: ReactTouchEvent<HTMLDivElement>) => {
    const startX = landingTouchStartX.current;
    const endX = event.changedTouches[0]?.clientX ?? null;
    landingTouchStartX.current = null;
    if (startX === null || endX === null) return;
    const deltaX = endX - startX;
    if (Math.abs(deltaX) < 40) return;
    goToLandingSlide(landingSlideIndex + (deltaX < 0 ? 1 : -1));
  }, [goToLandingSlide, landingSlideIndex]);

  const categories = useMemo(() => {
    const values = new Set(slokaList.map((sloka) => sloka.category));
    return ["all", ...Array.from(values).sort((a, b) => a.localeCompare(b))];
  }, [slokaList]);

  const deityHighlights = useMemo(() => {
    const byCategory = new Map<string, { icon: string; count: number }>();
    slokaList.forEach((sloka) => {
      const current = byCategory.get(sloka.category);
      if (current) {
        byCategory.set(sloka.category, { icon: current.icon, count: current.count + 1 });
      } else {
        byCategory.set(sloka.category, { icon: sloka.icon, count: 1 });
      }
    });

    return Array.from(byCategory.entries())
      .map(([category, value]) => ({
        category,
        icon: value.icon,
        count: value.count,
      }))
      .sort((left, right) => left.category.localeCompare(right.category));
  }, [slokaList]);

  const favoriteSlokas = useMemo(() => {
    return slokaList.filter((sloka) => favorites.has(sloka.id));
  }, [favorites, slokaList]);

  const selectedPractice = useMemo(() => {
    const entry = normalizePracticeEntry(slokaPractice[selectedSloka.id]);
    return {
      ...entry,
      activeLineIndex: Math.min(Math.max(0, entry.activeLineIndex), Math.max(0, selectedSloka.lines.length - 1)),
    };
  }, [selectedSloka.id, selectedSloka.lines.length, slokaPractice]);

  const todayDateKey = useMemo(() => getDateKey(new Date()), []);

  const selectedSlokaDoneToday = useMemo(() => {
    return selectedPractice.completedDates.includes(todayDateKey);
  }, [selectedPractice.completedDates, todayDateKey]);

  const recentCalendarDays = useMemo(() => {
    return Array.from({ length: 14 }, (_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (13 - index));
      const key = getDateKey(date);
      const completedCount = Object.values(slokaPractice).filter((entry) => entry.completedDates?.includes(key)).length;
      return {
        key,
        label: date.toLocaleDateString(undefined, { weekday: "short" }),
        day: date.getDate(),
        completedCount,
        isToday: key === todayDateKey,
      };
    });
  }, [slokaPractice, todayDateKey]);

  const activeChantList = useMemo(() => {
    return chantLists.find((list) => list.id === activeChantListId) ?? null;
  }, [activeChantListId, chantLists]);

  const detailChantListTargetId = useMemo(() => {
    if (chantLists.some((list) => list.id === detailChantListId)) return detailChantListId;
    return activeChantListId || chantLists[0]?.id || "";
  }, [activeChantListId, chantLists, detailChantListId]);

  const chantListStats = useMemo(() => {
    return chantLists.map((list) => {
      const completedToday = list.slokaIds.filter((slokaId) =>
        normalizePracticeEntry(slokaPractice[slokaId]).completedDates.includes(todayDateKey),
      ).length;
      return {
        ...list,
        completedToday,
        total: list.slokaIds.length,
      };
    });
  }, [chantLists, slokaPractice, todayDateKey]);

  const homeResults = useMemo(() => {
    const query = homeSearch.trim().toLowerCase();
    return slokaList.filter((sloka) => {
      const matchesQuery =
        query.length === 0 ||
        sloka.title.toLowerCase().includes(query) ||
        sloka.titleTamil.toLowerCase().includes(query) ||
        sloka.category.toLowerCase().includes(query);
      const matchesDuration = homeDurationMax === null || parseDurationMinutes(sloka.duration) <= homeDurationMax;
      return matchesQuery && matchesDuration;
    });
  }, [homeDurationMax, homeSearch, slokaList]);

  const suggestionPool = useMemo(() => {
    const unique = new Set<string>();
    slokaList.forEach((sloka) => {
      unique.add(sloka.title.trim());
      unique.add(sloka.titleTamil.trim());
      unique.add(sloka.category.trim());
    });
    return [...unique].filter((entry) => entry.length > 0);
  }, [slokaList]);

  const buildSearchSuggestions = useCallback(
    (queryValue: string): SearchSuggestion[] => {
      const query = queryValue.trim().toLowerCase();
      if (!query) return [];
      return suggestionPool
        .map((value) => {
          const normalized = value.toLowerCase();
          if (normalized === query) return null;
          if (normalized.startsWith(query)) return { value, rank: 0 };
          if (normalized.includes(query)) return { value, rank: 1 };
          return null;
        })
        .filter((entry): entry is SearchSuggestion => entry !== null)
        .sort((left, right) => left.rank - right.rank || left.value.localeCompare(right.value))
        .slice(0, 8);
    },
    [suggestionPool],
  );

  const homeSuggestions = useMemo(() => buildSearchSuggestions(homeSearch), [buildSearchSuggestions, homeSearch]);

  const filteredSlokas = useMemo(() => {
    const query = librarySearch.trim().toLowerCase();
    return slokaList.filter((sloka) => {
      const categoryMatch = libraryCategory === "all" || sloka.category === libraryCategory;
      const textMatch =
        query.length === 0 ||
        sloka.title.toLowerCase().includes(query) ||
        sloka.titleTamil.toLowerCase().includes(query) ||
        sloka.category.toLowerCase().includes(query);
      return categoryMatch && textMatch;
    });
  }, [libraryCategory, librarySearch, slokaList]);

  const filteredFavorites = useMemo(() => {
    const query = favoritesSearch.trim().toLowerCase();
    if (query.length === 0) return favoriteSlokas;
    return favoriteSlokas.filter((sloka) => {
      return (
        sloka.title.toLowerCase().includes(query) ||
        sloka.titleTamil.toLowerCase().includes(query) ||
        sloka.category.toLowerCase().includes(query)
      );
    });
  }, [favoriteSlokas, favoritesSearch]);

  const selectedRecommendation = useMemo(() => {
    return SLOKA_RECOMMENDATIONS[selectedSloka.id] ?? null;
  }, [selectedSloka.id]);

  const todayRecommendedSlokas = useMemo(() => {
    if (!todayDay) return [];
    return slokaList.filter((sloka) => (SLOKA_RECOMMENDATIONS[sloka.id]?.days ?? []).includes(todayDay));
  }, [slokaList, todayDay]);

  const popularSlokas = useMemo(() => {
    const withCounts = slokaList
      .map((sloka) => ({
        sloka,
        count: chantProgress.perSlokaCount[sloka.id] ?? 0,
      }))
      .sort((left, right) => right.count - left.count);

    if ((withCounts[0]?.count ?? 0) > 0) {
      return withCounts.slice(0, 6).map((item) => item.sloka);
    }

    const fallback = POPULAR_SLOKA_ORDER.map((id) => slokaList.find((sloka) => sloka.id === id)).filter(
      (value): value is SlokaSummary => Boolean(value),
    );

    return fallback.length > 0 ? fallback : slokaList.slice(0, 6);
  }, [chantProgress.perSlokaCount, slokaList]);

  const godsFilteredSlokas = useMemo(() => {
    if (godsCategory === "all") return slokaList;
    return slokaList.filter((sloka) => sloka.category === godsCategory);
  }, [godsCategory, slokaList]);

  const globalSearchResults = useMemo(() => {
    const q = globalSearchQuery.trim().toLowerCase();
    if (q.length < 2) return [];
    return slokaList.filter((s) =>
      s.title.toLowerCase().includes(q) ||
      s.titleTamil.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q)
    ).slice(0, 12);
  }, [globalSearchQuery, slokaList]);

  const unlockedBadges = useMemo(() => {
    const badges: string[] = [];
    if (chantProgress.totalCount >= 11) badges.push("11 chants");
    if (chantProgress.totalCount >= 108) badges.push("108 chants");
    if (chantProgress.totalCount >= 500) badges.push("500 chants");
    return badges;
  }, [chantProgress.totalCount]);

  const dailyProgressPercent = useMemo(() => {
    const safeTarget = Math.max(1, chantProgress.dailyTarget);
    return Math.min(100, Math.round((chantProgress.dailyCount / safeTarget) * 100));
  }, [chantProgress.dailyCount, chantProgress.dailyTarget]);
  const dailyTimeTargetMinutes = useMemo(() => Math.max(5, setupProfile.dailyMinutes), [setupProfile.dailyMinutes]);
  const dailyMinutesCompleted = useMemo(() => Math.max(0, chantProgress.dailyCount * sessionDuration), [chantProgress.dailyCount, sessionDuration]);
  const dailyMinutesDisplay = useMemo(
    () => Math.min(dailyTimeTargetMinutes, dailyMinutesCompleted),
    [dailyMinutesCompleted, dailyTimeTargetMinutes],
  );
  const dailyTimeProgressPercent = useMemo(() => {
    const safeTarget = Math.max(1, dailyTimeTargetMinutes);
    return Math.min(100, Math.round((dailyMinutesDisplay / safeTarget) * 100));
  }, [dailyMinutesDisplay, dailyTimeTargetMinutes]);
  const remainingDailyChants = useMemo(
    () => Math.max(0, chantProgress.dailyTarget - chantProgress.dailyCount),
    [chantProgress.dailyCount, chantProgress.dailyTarget],
  );
  const isDailyTargetCompleted = remainingDailyChants === 0;

  const topChantedSlokas = useMemo(() => {
    const entries = Object.entries(chantProgress.perSlokaCount).sort((left, right) => right[1] - left[1]).slice(0, 3);
    return entries
      .map(([slokaId, count]) => {
        const sloka = slokaList.find((item) => item.id === slokaId);
        if (!sloka) return null;
        return { id: slokaId, title: sloka.title, count };
      })
      .filter((value): value is { id: string; title: string; count: number } => value !== null);
  }, [chantProgress.perSlokaCount, slokaList]);
  const recentActivityItems = useMemo(() => {
    const todayItems = Object.entries(slokaPractice)
      .map(([slokaId, rawEntry]) => {
        const entry = normalizePracticeEntry(rawEntry);
        if (!entry.completedDates.includes(todayDateKey)) return null;
        const sloka = slokaList.find((item) => item.id === slokaId);
        if (!sloka) return null;
        const ended = entry.endedAt ? new Date(entry.endedAt) : null;
        const endedLabel = ended ? ended.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) : "Today";
        return {
          id: sloka.id,
          title: sloka.title,
          meta: `${endedLabel} • ${sloka.duration} • ${chantProgress.perSlokaCount[sloka.id] ?? 0} chants`,
          endedAt: ended?.getTime() ?? 0,
        };
      })
      .filter((value): value is { id: string; title: string; meta: string; endedAt: number } => value !== null)
      .sort((left, right) => right.endedAt - left.endedAt);

    if (todayItems.length > 0) return todayItems.slice(0, 4);

    return topChantedSlokas.slice(0, 4).map((item) => ({
      id: item.id,
      title: item.title,
      meta: `${item.count} chants • Continue today`,
      endedAt: 0,
    }));
  }, [chantProgress.perSlokaCount, slokaList, slokaPractice, todayDateKey, topChantedSlokas]);

  const toggleFavorite = useCallback((slokaId: string) => {
    setFavorites((previous) => {
      const next = new Set(previous);
      if (next.has(slokaId)) next.delete(slokaId);
      else next.add(slokaId);
      return next;
    });
  }, []);

  const toggleReminderDay = useCallback((day: string) => {
    setReminders((previous) => {
      const alreadySelected = previous.days.includes(day);
      const nextDays = alreadySelected ? previous.days.filter((value) => value !== day) : [...previous.days, day];
      return {
        ...previous,
        days: nextDays.length > 0 ? nextDays : [day],
      };
    });
  }, []);

  const createChantList = useCallback(() => {
    const name = chantListName.trim() || "My Chant List";
    const now = new Date().toISOString();
    const newList: ChantList = {
      id: createId("chantlist"),
      name,
      slokaIds: chantListSelectedSlokaId ? [chantListSelectedSlokaId] : [],
      scheduleTime: "06:30",
      enabled: false,
      lastNotifiedDate: "",
      createdAt: now,
    };
    setChantLists((previous) => [newList, ...previous]);
    setActiveChantListId(newList.id);
    setChantListName("Morning Chant");
    setLiveMessage(`Created chant list ${name}.`);
  }, [chantListName, chantListSelectedSlokaId]);

  const addSlokaToChantList = useCallback((listId: string, slokaId: string) => {
    setChantLists((previous) =>
      previous.map((list) =>
        list.id === listId
          ? {
              ...list,
              slokaIds: list.slokaIds.includes(slokaId) ? list.slokaIds : [...list.slokaIds, slokaId],
            }
          : list,
      ),
    );
    setLiveMessage("Added sloka to chant list.");
  }, []);

  const removeSlokaFromChantList = useCallback((listId: string, slokaId: string) => {
    setChantLists((previous) =>
      previous.map((list) =>
        list.id === listId
          ? {
              ...list,
              slokaIds: list.slokaIds.filter((value) => value !== slokaId),
            }
          : list,
      ),
    );
  }, []);

  const updateChantList = useCallback((listId: string, updates: Partial<ChantList>) => {
    setChantLists((previous) => previous.map((list) => (list.id === listId ? { ...list, ...updates } : list)));
  }, []);

  const deleteChantList = useCallback((listId: string) => {
    setChantLists((previous) => previous.filter((list) => list.id !== listId));
    setActiveChantListId((current) => (current === listId ? "" : current));
  }, []);

  const logChantCount = useCallback((slokaId: string, amount: number) => {
    const value = Math.max(1, amount);
    const todayDateKey = getDateKey(new Date());
    setChantProgress((previous) => {
      let nextDailyCount = previous.dailyCount;
      let nextStreakDays = previous.streakDays;

      if (previous.lastChantDate !== todayDateKey) {
        nextDailyCount = 0;
        if (!previous.lastChantDate) nextStreakDays = 1;
        else nextStreakDays = dayDifference(previous.lastChantDate, todayDateKey) === 1 ? previous.streakDays + 1 : 1;
      }

      return {
        ...previous,
        dailyCount: nextDailyCount + value,
        totalCount: previous.totalCount + value,
        streakDays: nextStreakDays,
        lastChantDate: todayDateKey,
        perSlokaCount: {
          ...previous.perSlokaCount,
          [slokaId]: (previous.perSlokaCount[slokaId] ?? 0) + value,
        },
      };
    });
    setLiveMessage(`Updated chant count by ${value}.`);
  }, []);

  const updateSelectedPractice = useCallback(
    (updater: (entry: SlokaPracticeEntry) => SlokaPracticeEntry) => {
      setSlokaPractice((previous) => ({
        ...previous,
        [selectedSloka.id]: updater(normalizePracticeEntry(previous[selectedSloka.id])),
      }));
    },
    [selectedSloka.id],
  );

  const setActivePracticeLine = useCallback(
    (lineIndex: number) => {
      updateSelectedPractice((entry) => ({
        ...entry,
        activeLineIndex: Math.min(Math.max(0, lineIndex), Math.max(0, selectedSloka.lines.length - 1)),
      }));
    },
    [selectedSloka.lines.length, updateSelectedPractice],
  );

  const setSelectedLineHighlight = useCallback(
    (color: string) => {
      updateSelectedPractice((entry) => ({
        ...entry,
        lineHighlights: {
          ...entry.lineHighlights,
          [entry.activeLineIndex]: color,
        },
      }));
    },
    [updateSelectedPractice],
  );

  const removeSelectedLineHighlight = useCallback(() => {
    updateSelectedPractice((entry) => {
      const nextHighlights = { ...entry.lineHighlights };
      delete nextHighlights[entry.activeLineIndex];
      return {
        ...entry,
        lineHighlights: nextHighlights,
      };
    });
  }, [updateSelectedPractice]);

  const triggerTestNotification = useCallback(async () => {
    if (typeof window === "undefined" || typeof Notification === "undefined") {
      setLiveMessage("Notifications are not supported in this browser.");
      return;
    }
    if (Notification.permission === "denied") {
      setLiveMessage("Notifications are blocked. Please allow them in browser settings.");
      return;
    }
    const permission = Notification.permission === "granted" ? "granted" : await Notification.requestPermission();
    if (permission !== "granted") {
      setLiveMessage("Notification permission was not granted.");
      return;
    }
    new Notification("My Shloka Ritual Reminder", {
      body: `Time to chant ${selectedSloka.title}.`,
    });
    setLiveMessage("Test reminder sent.");
  }, [selectedSloka.title]);

  const fadeOutAmbientDrone = useCallback(async () => {}, []);

  const loadSlokaDetail = useCallback(async (slokaId: string, sourceRoute: Route = "library") => {
    try {
      const response = await fetch(`/api/slokas/${encodeURIComponent(slokaId)}`);
      if (!response.ok) throw new Error("Unable to load sloka.");
      const payload = (await response.json()) as { sloka?: Sloka };
      if (!payload.sloka) throw new Error("Sloka data missing.");
      await fadeOutAmbientDrone();
      const startedAt = new Date().toISOString();
      setShowCompletionPopup(false);
      setCompletionPromptShown(false);
      setSlokaPractice((previous) => ({
        ...previous,
        [payload.sloka!.id]: {
          ...normalizePracticeEntry(previous[payload.sloka!.id]),
          startedAt,
          endedAt: "",
        },
      }));
      setSelectedSloka(payload.sloka);
      slokaOpenedAt.current = Date.now();
      setDetailBackRoute(sourceRoute);
      setRoute("detail");
    } catch {
      setLiveMessage("Unable to open sloka. Please try again.");
    }
  }, [fadeOutAmbientDrone, setRoute]);

  const markSelectedSlokaComplete = useCallback(() => {
    const endedAt = new Date();
    updateSelectedPractice((entry) => {
      const startedAt = entry.startedAt ? new Date(entry.startedAt).getTime() : endedAt.getTime();
      const elapsedSeconds = Number.isFinite(startedAt) ? Math.max(0, Math.floor((endedAt.getTime() - startedAt) / 1000)) : 0;
      const completedDates = entry.completedDates.includes(todayDateKey)
        ? entry.completedDates
        : [...entry.completedDates, todayDateKey].slice(-90);
      return {
        ...entry,
        endedAt: endedAt.toISOString(),
        timeSpentSeconds: entry.timeSpentSeconds + elapsedSeconds,
        activeLineIndex: Math.max(0, selectedSloka.lines.length - 1),
        completedDates,
      };
    });
    logChantCount(selectedSloka.id, 1);
    if (activeChantList) {
      const currentIndex = activeChantList.slokaIds.indexOf(selectedSloka.id);
      const nextSlokaId = currentIndex >= 0 ? activeChantList.slokaIds[currentIndex + 1] : "";
      if (nextSlokaId) {
        setShowCompletionPopup(false);
        setCompletionPromptShown(false);
        setLiveMessage(`Finished ${selectedSloka.title}. Opening next sloka.`);
        void loadSlokaDetail(nextSlokaId, "sessions");
        return;
      }
      const isLastInList = currentIndex >= 0 && currentIndex === Math.max(0, activeChantList.slokaIds.length - 1);
      if (isLastInList) {
        setActiveChantListId("");
        setChantCelebrationMessage(`Great job! You finished "${activeChantList.name}".`);
        setChantCelebrationVisible(true);
        window.setTimeout(() => {
          setChantCelebrationVisible(false);
          setRoute("home");
        }, 2300);
        setLiveMessage(`Finished ${selectedSloka.title}. Chant list complete.`);
        return;
      }
    }
    setShowCompletionPopup(false);
    setCompletionPromptShown(true);
    setChantCelebrationMessage(`Well done! ${selectedSloka.title} counted.`);
    setChantCelebrationVisible(true);
    window.setTimeout(() => setChantCelebrationVisible(false), 2200);
    setLiveMessage(`Marked ${selectedSloka.title} complete.`);
  }, [activeChantList, loadSlokaDetail, logChantCount, selectedSloka.id, selectedSloka.lines.length, selectedSloka.title, todayDateKey, updateSelectedPractice]);

  const startChantList = useCallback(
    async (listId: string) => {
      const list = chantLists.find((item) => item.id === listId);
      const firstSlokaId = list?.slokaIds[0];
      if (!list || !firstSlokaId) {
        setLiveMessage("Add at least one sloka before starting this chant list.");
        return;
      }
      setActiveChantListId(list.id);
      await loadSlokaDetail(firstSlokaId, "sessions");
    },
    [chantLists, loadSlokaDetail],
  );

  const setupProgressStep = Math.max(1, Math.min(4, setupStep));
  const openSetupFlow = useCallback(() => {
    if (setupProfile.completed) {
      setSetupStep(0);
      setShowStartPrompt(false);
      setGuidedStart(true);
      setRoute("home");
      return;
    }
    setSetupStep(0);
    setShowStartPrompt(true);
  }, [setRoute, setupProfile.completed]);
  const openAllDeities = useCallback(() => {
    setGuidedStart(false);
    setSetupStep(0);
    setShowStartPrompt(false);
    setLibraryCategory("all");
    setGodsCategory("all");
    setRoute("gods");
  }, [setRoute]);
  const startSetupWizard = useCallback(() => {
    setSetupStep(1);
  }, []);
  const openSetupFromProfile = useCallback(() => {
    setGuidedStart(false);
    setSetupStep(1);
    setShowStartPrompt(true);
    setRoute("landing");
    setLiveMessage("Setup wizard reopened. Update your ritual preferences.");
  }, [setRoute]);
  const closeSetupFlow = useCallback(() => {
    setSetupStep(0);
    setShowStartPrompt(false);
  }, []);
  const goToNextSetupStep = useCallback(() => {
    setSetupStep((previous) => Math.min(4, previous + 1));
  }, []);
  const goToPreviousSetupStep = useCallback(() => {
    setSetupStep((previous) => Math.max(0, previous - 1));
  }, []);
  const updateSetupProfile = useCallback((partial: Partial<SetupProfile>) => {
    setSetupProfile((previous) => ({ ...previous, ...partial }));
  }, []);
  const applyLanguagePreferences = useCallback(
    (partial: Partial<Pick<SetupProfile, "language" | "viewMode">>) => {
      const normalized = normalizeSetupProfile({ ...setupProfile, ...partial });
      const nextReaderPrefs = getReaderPrefsFromSetup(normalized);
      setSetupProfile(normalized);
      setReaderLanguage(nextReaderPrefs.language);
      setShowMeaning(nextReaderPrefs.showMeaning);
    },
    [setupProfile],
  );
  const applyRitualStyle = useCallback(
    (style: SetupRitualStyle) => {
      if (style === "calm") {
        updateSetupProfile({ ritualStyle: style, autoScroll: true, scrollSpeed: "slow" });
        return;
      }
      if (style === "count") {
        updateSetupProfile({ ritualStyle: style, autoScroll: false, scrollSpeed: "medium" });
        return;
      }
      updateSetupProfile({ ritualStyle: style, autoScroll: true, scrollSpeed: "fast" });
    },
    [updateSetupProfile],
  );
  const completeSetupFlow = useCallback(() => {
    const normalized = normalizeSetupProfile({ ...setupProfile, completed: true });
    const nextReaderPrefs = getReaderPrefsFromSetup(normalized);
    const reminderTime =
      normalized.reminderPreset === "morning"
        ? "07:00"
        : normalized.reminderPreset === "evening"
          ? "20:00"
          : normalized.reminderTime;
    const reminderEnabled = normalized.reminderEnabled && normalized.reminderPreset !== "none";
    const roundedDuration = normalized.dailyMinutes <= 7 ? 5 : normalized.dailyMinutes <= 12 ? 10 : 15;

    setSetupProfile(normalized);
    setChantProgress((previous) => ({
      ...previous,
      dailyTarget: normalized.dailyGoal,
    }));
    setSessionDuration(roundedDuration);
    setHomeDurationMax(normalized.ritualStyle === "timed" ? roundedDuration : null);
    setReaderLanguage(nextReaderPrefs.language);
    setShowMeaning(nextReaderPrefs.showMeaning);
    setReminders((previous) => ({
      ...previous,
      enabled: reminderEnabled,
      time: reminderTime,
      days: reminderEnabled ? Array.from(WEEK_DAYS) : previous.days,
    }));
    setGuidedStart(true);
    setShowStartPrompt(false);
    setSetupStep(0);
    setRoute("home");
    setLiveMessage(`Setup complete. Welcome, ${normalized.name}.`);
  }, [setRoute, setupProfile]);

  const decreaseReaderFontScale = useCallback(() => {
    setReaderFontScale((value) => Math.max(0.5, Number((value - 0.05).toFixed(2))));
  }, []);

  const increaseReaderFontScale = useCallback(() => {
    setReaderFontScale((value) => Math.min(1.2, Number((value + 0.05).toFixed(2))));
  }, []);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (typeof window === "undefined") return;
    const todayDateKey = getDateKey(new Date());
    const persistedFavorites = safeParse<string[]>(window.localStorage.getItem(STORAGE_KEYS.favorites), []);
    const persistedProgress = safeParse<ChantProgress>(
      window.localStorage.getItem(STORAGE_KEYS.chantProgress),
      DEFAULT_CHANT_PROGRESS,
    );
    const persistedPractice = safeParse<SlokaPracticeState>(
      window.localStorage.getItem(STORAGE_KEYS.slokaPractice),
      {},
    );
    const persistedChantLists = safeParse<ChantList[]>(window.localStorage.getItem(STORAGE_KEYS.chantLists), []);
    const persistedReminders = safeParse<ReminderSettings>(
      window.localStorage.getItem(STORAGE_KEYS.reminders),
      DEFAULT_REMINDERS,
    );
    const persistedReaderPrefs = safeParse<ReaderPrefs>(
      window.localStorage.getItem(STORAGE_KEYS.readerPrefs),
      DEFAULT_READER_PREFS,
    );
    const persistedSetup = safeParse<SetupProfile>(
      window.localStorage.getItem(STORAGE_KEYS.setupProfile),
      DEFAULT_SETUP_PROFILE,
    );
    const normalizedSetup = normalizeSetupProfile(persistedSetup);
    const hydratedProgress = normalizeProgressForToday(persistedProgress, todayDateKey);
    const setupReaderPrefs = getReaderPrefsFromSetup(normalizedSetup);
    const initialReaderLanguage: ReaderLanguage = normalizedSetup.completed
      ? setupReaderPrefs.language
      : persistedReaderPrefs.language === "tamil" || persistedReaderPrefs.language === "english"
        ? persistedReaderPrefs.language
        : "tamil";
    const initialShowMeaning = normalizedSetup.completed
      ? setupReaderPrefs.showMeaning
      : typeof persistedReaderPrefs.showMeaning === "boolean"
        ? persistedReaderPrefs.showMeaning
        : true;
    const initialDuration =
      normalizedSetup.completed
        ? normalizedSetup.dailyMinutes <= 7
          ? 5
          : normalizedSetup.dailyMinutes <= 12
            ? 10
            : 15
        : 5;

    setFavorites(new Set(persistedFavorites));
    setChantProgress({
      ...hydratedProgress,
      dailyTarget: normalizedSetup.completed ? normalizedSetup.dailyGoal : hydratedProgress.dailyTarget,
    });
    setSlokaPractice(normalizePracticeState(persistedPractice));
    setChantLists(normalizeChantLists(persistedChantLists));
    setReminders(normalizeReminderSettings(persistedReminders));
    setSetupProfile(normalizedSetup);
    setSessionDuration(initialDuration);
    setHomeDurationMax(normalizedSetup.completed ? (normalizedSetup.ritualStyle === "timed" ? initialDuration : null) : 10);
    setReaderFontScale(
      Math.min(0.9, Math.max(0.5, Number.isFinite(persistedReaderPrefs.fontScale) ? persistedReaderPrefs.fontScale : 0.68)),
    );
    setReaderLanguage(initialReaderLanguage);
    setShowMeaning(initialShowMeaning);
    setTodayDay(WEEK_DAYS[new Date().getDay()]);
    const storedTheme = window.localStorage.getItem(STORAGE_KEYS.theme);
    const dark = storedTheme === "dark";
    setIsDarkTheme(dark);
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
    setIsHydrated(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    let isCancelled = false;
    const getUserCoordinates = async (): Promise<{ lat: number; lon: number } | null> => {
      if (typeof navigator === "undefined" || !navigator.geolocation) return null;
      return await new Promise((resolve) => {
        const timeout = window.setTimeout(() => resolve(null), 1800);
        navigator.geolocation.getCurrentPosition(
          (position) => {
            window.clearTimeout(timeout);
            resolve({
              lat: position.coords.latitude,
              lon: position.coords.longitude,
            });
          },
          () => {
            window.clearTimeout(timeout);
            resolve(null);
          },
          { enableHighAccuracy: false, timeout: 1500, maximumAge: 5 * 60 * 1000 },
        );
      });
    };

    const loadTodayCalendar = async () => {
      try {
        const timezone =
          (typeof Intl !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : undefined) || "Asia/Kolkata";
        const coords = await getUserCoordinates();
        const params = new URLSearchParams();
        params.set("tz", timezone);
        params.set("label", `Your Location (${timezone})`);
        if (coords) {
          params.set("lat", `${coords.lat}`);
          params.set("lon", `${coords.lon}`);
        }

        const response = await fetch(`/api/calendar/today?${params.toString()}`);
        if (!response.ok) return;
        const payload = (await response.json()) as { today?: TamilCalendarToday };
        if (!isCancelled && payload.today) {
          setTodayCalendar(payload.today);
          setTodayDay(payload.today.weekday);
        }
      } catch {
        // Keep fallback weekday-based behavior when API fails.
      }
    };
    void loadTodayCalendar();
    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isHydrated || typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(Array.from(favorites)));
  }, [favorites, isHydrated]);

  useEffect(() => {
    if (!isHydrated || typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEYS.chantProgress, JSON.stringify(chantProgress));
  }, [chantProgress, isHydrated]);

  useEffect(() => {
    if (!isHydrated || typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEYS.slokaPractice, JSON.stringify(slokaPractice));
  }, [isHydrated, slokaPractice]);

  useEffect(() => {
    if (!isHydrated || typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEYS.chantLists, JSON.stringify(chantLists));
  }, [chantLists, isHydrated]);

  useEffect(() => {
    if (!isHydrated || typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEYS.reminders, JSON.stringify(reminders));
  }, [isHydrated, reminders]);

  useEffect(() => {
    if (!isHydrated || typeof window === "undefined") return;
    const prefs: ReaderPrefs = {
      fontScale: readerFontScale,
      language: readerLanguage,
      showMeaning,
    };
    window.localStorage.setItem(STORAGE_KEYS.readerPrefs, JSON.stringify(prefs));
  }, [isHydrated, readerFontScale, readerLanguage, showMeaning]);

  useEffect(() => {
    if (!isHydrated || typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEYS.setupProfile, JSON.stringify(setupProfile));
  }, [isHydrated, setupProfile]);

  useEffect(() => {
    if (!isHydrated || !reminders.enabled) return;
    if (typeof window === "undefined" || typeof Notification === "undefined") return;

    const timer = window.setInterval(() => {
      const now = new Date();
      const nowDay = WEEK_DAYS[now.getDay()];
      const nowTime = `${`${now.getHours()}`.padStart(2, "0")}:${`${now.getMinutes()}`.padStart(2, "0")}`;
      const todayDateKey = getDateKey(now);
      const shouldNotify =
        reminders.days.includes(nowDay) && reminders.time === nowTime && reminders.lastNotifiedDate !== todayDateKey;
      if (!shouldNotify) return;

      if (Notification.permission === "granted") {
        new Notification("My Shloka Ritual Reminder", {
          body: `Time to chant ${selectedSloka.title}.`,
        });
      }

      setReminders((previous) => ({
        ...previous,
        lastNotifiedDate: todayDateKey,
      }));
      setLiveMessage(`Reminder: it is time for ${selectedSloka.title}.`);
    }, 30000);

    return () => window.clearInterval(timer);
  }, [isHydrated, reminders, selectedSloka.title]);

  useEffect(() => {
    if (!isHydrated || chantLists.length === 0) return;
    if (typeof window === "undefined" || typeof Notification === "undefined") return;

    const timer = window.setInterval(() => {
      const now = new Date();
      const nowTime = `${`${now.getHours()}`.padStart(2, "0")}:${`${now.getMinutes()}`.padStart(2, "0")}`;
      const todayDateKey = getDateKey(now);
      const dueList = chantLists.find(
        (list) => list.enabled && list.scheduleTime === nowTime && list.lastNotifiedDate !== todayDateKey && list.slokaIds.length > 0,
      );
      if (!dueList) return;

      if (Notification.permission === "granted") {
        const notification = new Notification("My Shloka Ritual Chant List", {
          body: `Time to read ${dueList.name}.`,
        });
        notification.onclick = () => {
          window.focus();
          void startChantList(dueList.id);
        };
      }

      setChantLists((previous) =>
        previous.map((list) => (list.id === dueList.id ? { ...list, lastNotifiedDate: todayDateKey } : list)),
      );
      setLiveMessage(`Time to read ${dueList.name}.`);
    }, 30000);

    return () => window.clearInterval(timer);
  }, [chantLists, isHydrated, startChantList]);

  useEffect(() => {
    if (route !== "home") return;
    const timer = window.setTimeout(() => {
      homeSearchInputRef.current?.focus();
    }, 120);
    return () => window.clearTimeout(timer);
  }, [route]);

  const toggleTheme = useCallback(() => {
    setIsDarkTheme((prev) => {
      const next = !prev;
      document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
      window.localStorage.setItem(STORAGE_KEYS.theme, next ? "dark" : "light");
      return next;
    });
  }, []);

  const autoScrollTiming = useMemo(
    () => getAutoScrollTiming(setupProfile.scrollSpeed, setupProfile.ritualStyle),
    [setupProfile.ritualStyle, setupProfile.scrollSpeed],
  );

  useEffect(() => {
    if (route !== "detail" || !setupProfile.autoScroll || showCompletionPopup) return;
    if (typeof window === "undefined" || typeof document === "undefined") return;

    const { pxPerSecond } = autoScrollTiming;
    const scrollTarget = findVerticalScrollContainer();
    let rafId = 0;
    let lastTimestamp = 0;
    let scrollAccumulator = 0;
    let pausedUntil = 0;

    const onUserInteract = () => {
      pausedUntil = performance.now() + 1400;
    };

    const tick = (now: number) => {
      if (!lastTimestamp) lastTimestamp = now;
      const dt = Math.min(64, now - lastTimestamp);
      lastTimestamp = now;

      if (now < pausedUntil) {
        rafId = window.requestAnimationFrame(tick);
        return;
      }

      scrollAccumulator += (pxPerSecond * dt) / 1000;
      const stepNow = Math.floor(scrollAccumulator);
      if (stepNow >= 1) {
        scrollAccumulator -= stepNow;
        if (!(scrollTarget instanceof HTMLElement)) {
          const root = document.scrollingElement || document.documentElement;
          const maxScrollTop = Math.max(0, root.scrollHeight - window.innerHeight);
          if (root.scrollTop < maxScrollTop - 2) {
            root.scrollTop = Math.min(maxScrollTop, root.scrollTop + stepNow);
          }
        } else {
          const maxScrollTop = Math.max(0, scrollTarget.scrollHeight - scrollTarget.clientHeight);
          if (scrollTarget.scrollTop < maxScrollTop - 2) {
            const previousTop = scrollTarget.scrollTop;
            scrollTarget.scrollTop = Math.min(maxScrollTop, scrollTarget.scrollTop + stepNow);
            if (scrollTarget.scrollTop === previousTop) {
              const root = document.scrollingElement || document.documentElement;
              const rootMax = Math.max(0, root.scrollHeight - window.innerHeight);
              if (root.scrollTop < rootMax - 2) {
                root.scrollTop = Math.min(rootMax, root.scrollTop + stepNow);
              }
            }
          }
        }
      }

      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);
    const interactTarget = scrollTarget instanceof HTMLElement ? scrollTarget : window;
    interactTarget.addEventListener("wheel", onUserInteract, { passive: true });
    interactTarget.addEventListener("touchstart", onUserInteract, { passive: true });

    return () => {
      window.cancelAnimationFrame(rafId);
      interactTarget.removeEventListener("wheel", onUserInteract);
      interactTarget.removeEventListener("touchstart", onUserInteract);
    };
  }, [autoScrollTiming, route, setupProfile.autoScroll, showCompletionPopup]);

  const maybeOpenCompletionPopup = useCallback(() => {
    if (route !== "detail" || selectedSlokaDoneToday || showCompletionPopup || completionPromptShown) return;
    if (typeof window === "undefined" || typeof document === "undefined") return;

    // Require minimum time on page: ~6s per line, floor of 25s, ceiling of 120s.
    // This prevents the popup firing instantly for short slokas.
    const minMs = Math.min(120_000, Math.max(25_000, selectedSloka.lines.length * 6_000));
    if (Date.now() - slokaOpenedAt.current < minMs) return;

    const scrollTarget = findVerticalScrollContainer();
    const hasReachedEnd = !(scrollTarget instanceof HTMLElement)
      ? (() => {
          const root = document.scrollingElement || document.documentElement;
          return root.scrollTop + window.innerHeight >= root.scrollHeight - 24;
        })()
      : scrollTarget.scrollTop + scrollTarget.clientHeight >= scrollTarget.scrollHeight - 24;
    if (!hasReachedEnd) return;
    setCompletionPromptShown(true);
    setShowCompletionPopup(true);
  }, [completionPromptShown, route, selectedSloka.lines.length, selectedSlokaDoneToday, showCompletionPopup]);

  useEffect(() => {
    if (route !== "detail" || selectedSlokaDoneToday || showCompletionPopup || completionPromptShown) return;
    const scrollTarget = findVerticalScrollContainer();
    const onScroll = () => maybeOpenCompletionPopup();
    if (scrollTarget instanceof HTMLElement) {
      scrollTarget.addEventListener("scroll", onScroll, { passive: true });
    } else {
      window.addEventListener("scroll", onScroll, { passive: true });
    }
    window.addEventListener("resize", onScroll);
    // Poll every 5 seconds so the popup fires after minMs even without scrolling.
    const poll = window.setInterval(onScroll, 5_000);
    return () => {
      window.clearInterval(poll);
      if (scrollTarget instanceof HTMLElement) {
        scrollTarget.removeEventListener("scroll", onScroll);
      } else {
        window.removeEventListener("scroll", onScroll);
      }
      window.removeEventListener("resize", onScroll);
    };
  }, [completionPromptShown, maybeOpenCompletionPopup, route, selectedSlokaDoneToday, showCompletionPopup]);

  const readerScaleStyle = useMemo(
    () =>
      ({
        "--reader-font-scale": readerFontScale,
      }) as CSSProperties,
    [readerFontScale],
  );

  return (
    <div className={`app-shell route-${route} ${route === "landing" ? "landing-mode" : ""}`}>
      {route !== "landing" && route !== "detail" && route !== "home" && (
        <header className="app-header">
          <div className="brand">
            <div>
              <strong>My Shloka Ritual</strong>
              <span>Daily chants for inner calm</span>
            </div>
          </div>
        </header>
      )}

      <main className={route === "landing" ? "landing-main" : undefined}>
        {liveMessage && <div className="toast visible">{liveMessage}</div>}
        {chantCelebrationVisible && (
          <div className="chant-celebration" role="status" aria-live="polite">
            <div className="chant-celebration-confetti" aria-hidden="true">
              {CELEBRATION_CONFETTI.map((piece, index) => (
                <span
                  className="confetti-piece"
                  key={`confetti-piece-${index}`}
                  style={
                    {
                      "--left": piece.left,
                      "--delay": piece.delay,
                      "--duration": piece.duration,
                      "--color": piece.color,
                    } as CSSProperties
                  }
                />
              ))}
            </div>
            <article>
              <div className="celebration-burst" aria-hidden="true">
                🎉
              </div>
              <h3>Great Job</h3>
              <p>{chantCelebrationMessage || "Chant counted."}</p>
              <small>Keep chanting or go back whenever you&apos;re ready.</small>
            </article>
          </div>
        )}

        {route === "landing" && (
          <section className="landing-screen active">
            <Image
              alt=""
              aria-hidden="true"
              className="landing-splash-image"
              fill
              priority
              sizes="100vw"
              src="/media/entry-splash-bg.png"
              unoptimized
            />
            <div className="landing-overlay" />
            <div className="landing-colorwash" />
            <div className="landing-stars" />
            <div className="landing-content">
              {!showStartPrompt && (
                <article className="landing-greeting-preview landing-onboarding-card">
                  <div className="landing-carousel-shell">
                    <div
                      className="landing-carousel-track"
                      onTouchEnd={handleLandingTouchEnd}
                      onTouchStart={handleLandingTouchStart}
                      style={{ transform: `translateX(-${landingSlideIndex * 100}%)` }}
                    >
                      {LANDING_ONBOARDING_STEPS.map((step, index) => (
                        <div
                          aria-hidden={landingSlideIndex !== index}
                          className={`landing-carousel-slide ${landingSlideIndex === index ? "active" : ""}`}
                          key={step.id}
                        >
                          <section className={`landing-onboarding-step landing-onboarding-step-${step.id}`}>
                            <div className="landing-onboarding-body">
                              {step.id === "brand" ? (
                                <>
                                  <div className="landing-brand-art">
                                    <Image
                                      alt="My Shloka Ritual"
                                      className="landing-brand-logo"
                                      height={1280}
                                      priority
                                      sizes="(max-width: 900px) 72vw, 320px"
                                      src={BRAND_LOGO_SRC}
                                      unoptimized
                                      width={1280}
                                    />
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="landing-step-mark">
                                    <Image
                                    alt=""
                                    aria-hidden="true"
                                    className="landing-step-mark-image"
                                    height={760}
                                    sizes="96px"
                                    src={BRAND_MARK_SRC}
                                    unoptimized
                                    width={760}
                                  />
                                </div>
                                <div className="landing-step-copy">
                                    <h2>{step.title}</h2>
                                    <p>{step.description}</p>
                                  </div>
                                </>
                              )}
                            </div>
                            <div className="landing-onboarding-footer">
                              <div className="landing-carousel-dots" aria-label="Onboarding pages">
                                {LANDING_ONBOARDING_STEPS.map((dotStep, index) => (
                                  <button
                                    aria-label={`Go to screen ${index + 1}`}
                                    className={`landing-carousel-dot ${landingSlideIndex === index ? "active" : ""}`}
                                    key={`landing-dot-${step.id}-${dotStep.id}`}
                                    onClick={() => goToLandingSlide(index)}
                                    type="button"
                                  />
                                ))}
                              </div>
                              {step.id === "nourish" ? (
                                <button
                                  className="landing-ghost-button"
                                  onClick={openSetupFlow}
                                  type="button"
                                >
                                  Enter Slokas
                                </button>
                              ) : (
                                <span className="landing-step-spacer" aria-hidden="true" />
                              )}
                            </div>
                          </section>
                        </div>
                      ))}
                    </div>
                  </div>
                </article>
              )}
            </div>
            {showStartPrompt && (
              <div
                className="start-modal-backdrop"
                onClick={closeSetupFlow}
                onKeyDown={(event) => {
                  if (event.key === "Escape") closeSetupFlow();
                }}
                role="button"
                tabIndex={0}
              >
                <section
                  className="start-modal"
                  onClick={(event) => event.stopPropagation()}
                >
                  {setupStep === 0 ? (
                    <div className="setup-first-screen">
                      <header className="setup-first-header">
                        <span className="setup-first-om">ॐ</span>
                        <h3>{`${dayGreeting}, ${setupProfile.name || "Asha"}`}</h3>
                        <p>Begin your spiritual journey today</p>
                        <Image
                          alt=""
                          aria-hidden="true"
                          className="setup-divider"
                          height={22}
                          src="/decor/section-divider-lotus.svg"
                          unoptimized
                          width={128}
                        />
                      </header>
                      <div className="setup-first-cards">
                        <article className="setup-first-card setup-first-card-ritual">
                          <div className="setup-first-card-visual">
                            <Image
                              alt=""
                              aria-hidden="true"
                              className="setup-first-card-mark setup-first-card-icon-image setup-first-card-icon-ritual"
                              height={420}
                              src="/brand/setup-ritual-icon.png"
                              unoptimized
                              width={420}
                            />
                          </div>
                          <div className="setup-first-card-content">
                            <div className="setup-first-card-copy">
                              <h4>Set Up Ritual</h4>
                              <span className="setup-first-card-mini-divider" aria-hidden="true" />
                              <p>Personalize your chanting journey. Set goals, choose duration, and create your daily ritual.</p>
                            </div>
                            <button className="landing-start-button" onClick={startSetupWizard} type="button">
                              Set Up My Ritual
                            </button>
                          </div>
                          <span className="setup-first-card-arrow" aria-hidden="true">{"\u203a"}</span>
                        </article>
                        <article className="setup-first-card setup-first-card-explore">
                          <div className="setup-first-card-visual">
                            <Image
                              alt=""
                              aria-hidden="true"
                              className="setup-first-card-mark setup-first-card-icon-image setup-first-card-icon-library"
                              height={420}
                              src="/brand/setup-library-icon.png"
                              unoptimized
                              width={420}
                            />
                          </div>
                          <div className="setup-first-card-content">
                            <div className="setup-first-card-copy">
                              <h4>Explore Library</h4>
                              <span className="setup-first-card-mini-divider" aria-hidden="true" />
                              <p>Browse a rich collection of slokas by deity, purpose, category, or mood.</p>
                            </div>
                            <button
                              className="secondary-button setup-explore-button"
                              onClick={openAllDeities}
                              type="button"
                            >
                              Explore Library
                            </button>
                          </div>
                          <span className="setup-first-card-arrow" aria-hidden="true">{"\u203a"}</span>
                        </article>
                      </div>
                      <p className="setup-first-note"><span aria-hidden="true" className="setup-first-note-check">✓</span> You can set up a ritual anytime from the Profile section.</p>
                    </div>
                  ) : (
                    <div className="setup-wizard">
                      <header className="setup-wizard-header">
                        {setupStep === 1 ? (
                          <div className="setup-wizard-brand-identity">
                            <Image alt="" aria-hidden="true" className="setup-wizard-brand-mark" height={760} sizes="52px" src={BRAND_MARK_SRC} unoptimized width={760} />
                            <div>
                              <strong>My Shloka Ritual</strong>
                              <span className="setup-wizard-tagline">Daily chants for inner calm</span>
                            </div>
                          </div>
                        ) : (
                          <button className="icon-button setup-back-button" onClick={goToPreviousSetupStep} type="button">
                            <BackGlyph />
                          </button>
                        )}
                        {setupStep === 1 ? (
                          <div className="setup-wizard-dots" aria-label="Onboarding step 1 of 3">
                            <span className="active" /><span /><span />
                          </div>
                        ) : (
                          <>
                            <p className="setup-wizard-step">{`Step ${setupProgressStep} of 4`}</p>
                            <div className="setup-wizard-progress" aria-label={`Step ${setupProgressStep} of 4`}>
                              {Array.from({ length: 4 }, (_, index) => (
                                <span className={index < setupProgressStep ? "active" : ""} key={`setup-step-${index + 1}`} />
                              ))}
                            </div>
                          </>
                        )}
                        <h3>
                          {setupStep === 1
                            ? "Welcome! Let's get started."
                            : setupStep === 2
                              ? "Choose your language"
                              : setupStep === 3
                                ? "Set your ritual style"
                                : "Set your reminders"}
                        </h3>
                        <p>
                          {setupStep === 1
                            ? "A small step today, a lifetime of calm."
                            : setupStep === 2
                              ? "We'll show slokas and meanings in your preferred language."
                              : setupStep === 3
                                ? "Choose how you want to chant and build your daily practice."
                                : "We'll gently remind you so you never miss your daily ritual."}
                        </p>
                      </header>

                      {setupStep === 1 && (
                        <div className="setup-wizard-body">
                          <article className="setup-panel">
                            <div className="setup-panel-label-row">
                              <svg aria-hidden="true" className="setup-panel-icon" fill="none" height="18" stroke="#1f5d3a" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" viewBox="0 0 24 24" width="18">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                              </svg>
                              <div>
                                <label className="field-label light" htmlFor="setup-name">What should we call you?</label>
                                <span className="setup-panel-helper">This will be used to personalise your experience.</span>
                              </div>
                            </div>
                            <input
                              autoComplete="name"
                              className="start-modal-input"
                              id="setup-name"
                              onChange={(event) => updateSetupProfile({ name: event.target.value })}
                              placeholder="Enter your name"
                              value={setupProfile.name}
                            />
                          </article>
                          <article className="setup-panel">
                            <div className="setup-panel-title-wrap">
                              <h4>Set your daily goals</h4>
                              <span className="setup-panel-helper">These goals will help you build a consistent ritual.</span>
                            </div>
                            <div className="setup-counter-row">
                              <div className="setup-counter-label">
                                <svg aria-hidden="true" className="setup-panel-icon" fill="none" height="16" stroke="#1f5d3a" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" viewBox="0 0 24 24" width="16">
                                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                </svg>
                                <div>
                                  <span>Daily chant count target</span>
                                  <span className="setup-counter-helper">How many slokas do you want to chant each day?</span>
                                </div>
                              </div>
                              <div className="setup-counter-with-unit">
                                <div className="setup-counter">
                                  <button onClick={() => updateSetupProfile({ dailyGoal: Math.max(1, setupProfile.dailyGoal - 1) })} type="button">−</button>
                                  <strong>{setupProfile.dailyGoal}</strong>
                                  <button onClick={() => updateSetupProfile({ dailyGoal: Math.min(108, setupProfile.dailyGoal + 1) })} type="button">+</button>
                                </div>
                                <span className="setup-counter-unit">chants</span>
                              </div>
                            </div>
                            <div className="setup-counter-row">
                              <div className="setup-counter-label">
                                <svg aria-hidden="true" className="setup-panel-icon" fill="none" height="16" stroke="#1f5d3a" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" viewBox="0 0 24 24" width="16">
                                  <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                                </svg>
                                <div>
                                  <span>Daily time target</span>
                                  <span className="setup-counter-helper">How much time do you want to spend chanting each day?</span>
                                </div>
                              </div>
                              <div className="setup-counter-with-unit">
                                <div className="setup-counter">
                                  <button onClick={() => updateSetupProfile({ dailyMinutes: Math.max(5, setupProfile.dailyMinutes - 5) })} type="button">−</button>
                                  <strong>{setupProfile.dailyMinutes}</strong>
                                  <button onClick={() => updateSetupProfile({ dailyMinutes: Math.min(180, setupProfile.dailyMinutes + 5) })} type="button">+</button>
                                </div>
                                <span className="setup-counter-unit">minutes</span>
                              </div>
                            </div>
                          </article>
                        </div>
                      )}

                      {setupStep === 2 && (
                        <div className="setup-wizard-body">
                          <article className="setup-panel">
                            <h4>Select your preferred language</h4>
                            <div className="setup-choice-list">
                              {[
                                { id: "tamil", label: "\u0ba4\u0bae\u0bbf\u0bb4\u0bcd", sub: "Tamil" },
                                { id: "english", label: "English", sub: "English" },
                              ].map((option) => (
                                <button
                                  className={`setup-option ${setupProfile.language === option.id ? "active" : ""}`}
                                  key={`setup-language-${option.id}`}
                                  onClick={() => applyLanguagePreferences({ language: option.id as SetupLanguageChoice })}
                                  type="button"
                                >
                                  <strong>{option.label}</strong>
                                  <small>{option.sub}</small>
                                </button>
                              ))}
                            </div>
                          </article>
                          <article className="setup-panel">
                            <h4>How would you like to view slokas?</h4>
                            <div className="setup-view-options">
                              <button
                                className={`setup-view-chip ${setupProfile.viewMode === "tamil_only" ? "active" : ""}`}
                                onClick={() => applyLanguagePreferences({ viewMode: "tamil_only" })}
                                type="button"
                              >
                                <strong>Tamil only</strong>
                                <small>Only Tamil script</small>
                              </button>
                              <button
                                className={`setup-view-chip ${setupProfile.viewMode === "tamil_english" ? "active" : ""}`}
                                onClick={() => applyLanguagePreferences({ viewMode: "tamil_english" })}
                                type="button"
                              >
                                <strong>Tamil + Meaning</strong>
                                <small>Tamil with English meaning</small>
                              </button>
                            </div>
                          </article>
                        </div>
                      )}

                      {setupStep === 3 && (
                        <div className="setup-wizard-body">
                          <article className="setup-panel">
                            <h4>Choose your chanting style</h4>
                            <div className="setup-choice-list">
                              {[
                                { id: "calm", label: "Calm Mode", desc: "Slow, mindful and immersive." },
                                { id: "count", label: "Count Mode", desc: "Focus on repetitions." },
                                { id: "timed", label: "Timed Mode", desc: "Focus on minutes." },
                              ].map((option) => (
                                <button
                                  className={`setup-option ${setupProfile.ritualStyle === option.id ? "active" : ""}`}
                                  key={`setup-style-${option.id}`}
                                  onClick={() => applyRitualStyle(option.id as SetupRitualStyle)}
                                  type="button"
                                >
                                  <strong>{option.label}</strong>
                                  <small>{option.desc}</small>
                                </button>
                              ))}
                            </div>
                          </article>
                          <article className="setup-panel">
                            <div className="setup-toggle-row">
                              <span>Auto-scroll by default</span>
                              <button
                                className={`switch-button ${setupProfile.autoScroll ? "active" : ""}`}
                                onClick={() => updateSetupProfile({ autoScroll: !setupProfile.autoScroll })}
                                type="button"
                              >
                                {setupProfile.autoScroll ? "On" : "Off"}
                              </button>
                            </div>
                            <div className="setup-chip-options">
                              <button
                                className={`start-chip ${setupProfile.scrollSpeed === "slow" ? "active" : ""}`}
                                onClick={() => updateSetupProfile({ scrollSpeed: "slow" })}
                                type="button"
                              >
                                Slow
                              </button>
                              <button
                                className={`start-chip ${setupProfile.scrollSpeed === "medium" ? "active" : ""}`}
                                onClick={() => updateSetupProfile({ scrollSpeed: "medium" })}
                                type="button"
                              >
                                Medium
                              </button>
                              <button
                                className={`start-chip ${setupProfile.scrollSpeed === "fast" ? "active" : ""}`}
                                onClick={() => updateSetupProfile({ scrollSpeed: "fast" })}
                                type="button"
                              >
                                Fast
                              </button>
                            </div>
                          </article>
                        </div>
                      )}

                      {setupStep === 4 && (
                        <div className="setup-wizard-body">
                          <article className="setup-panel">
                            <h4>When should we remind you?</h4>
                            <div className="setup-choice-list">
                              {[
                                { id: "morning", label: "Morning", time: "07:00 AM" },
                                { id: "evening", label: "Evening", time: "08:00 PM" },
                                { id: "custom", label: "Custom time", time: "Set custom time" },
                                { id: "none", label: "I'll do it without reminders", time: "I prefer to practice on my own" },
                              ].map((option) => (
                                <button
                                  className={`setup-option ${setupProfile.reminderPreset === option.id ? "active" : ""}`}
                                  key={`setup-reminder-${option.id}`}
                                  onClick={() => updateSetupProfile({ reminderPreset: option.id as SetupReminderPreset })}
                                  type="button"
                                >
                                  <strong>{option.label}</strong>
                                  <small>{option.time}</small>
                                </button>
                              ))}
                            </div>
                            {setupProfile.reminderPreset === "custom" && (
                              <input
                                className="start-modal-input"
                                onChange={(event) => updateSetupProfile({ reminderTime: event.target.value })}
                                type="time"
                                value={setupProfile.reminderTime}
                              />
                            )}
                          </article>
                          <article className="setup-panel">
                            <div className="setup-toggle-row">
                              <span>Daily reminder notification</span>
                              <button
                                className={`switch-button ${setupProfile.reminderEnabled ? "active" : ""}`}
                                onClick={() => updateSetupProfile({ reminderEnabled: !setupProfile.reminderEnabled })}
                                type="button"
                              >
                                {setupProfile.reminderEnabled ? "On" : "Off"}
                              </button>
                            </div>
                            <div className="setup-toggle-row">
                              <span>Motivational quote</span>
                              <button
                                className={`switch-button ${setupProfile.quoteEnabled ? "active" : ""}`}
                                onClick={() => updateSetupProfile({ quoteEnabled: !setupProfile.quoteEnabled })}
                                type="button"
                              >
                                {setupProfile.quoteEnabled ? "On" : "Off"}
                              </button>
                            </div>
                          </article>
                        </div>
                      )}

                      <div className="start-modal-actions">
                        {setupStep < 4 ? (
                          <button className="landing-start-button setup-continue-pill" onClick={goToNextSetupStep} type="button">
                            Continue
                            <svg aria-hidden="true" fill="none" height="18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24" width="18">
                              <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                          </button>
                        ) : (
                          <button className="landing-start-button setup-continue-pill" onClick={completeSetupFlow} type="button">
                            Complete Setup
                            <svg aria-hidden="true" fill="none" height="18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24" width="18">
                              <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                          </button>
                        )}
                        {setupStep === 1 && (
                          <p className="setup-settings-note">You can change this anytime in Settings</p>
                        )}
                      </div>
                    </div>
                  )}
                </section>
              </div>
            )}
          </section>
        )}

        {route === "home" && (
          <section className="screen active home-screen">
            {/* ── Hero ── */}
            <header className="home-hero">
              <span className="home-hero-om" aria-hidden="true">ॐ</span>
              <div className="home-hero-copy">
                <h1 className="home-greeting">{`${dayGreeting}, ${setupProfile.name || "Asha"}`}</h1>
                <p className="home-subtitle">
                  {isDailyTargetCompleted
                    ? "You've completed today's ritual 🙏"
                    : "Begin your spiritual journey today"}
                </p>
              </div>
              <button
                className="home-hero-bell"
                onClick={() => setRoute("profile")}
                title="Profile & Settings"
                type="button"
                aria-label="Profile"
              >
                <svg aria-hidden="true" fill="none" height="22" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24" width="22">
                  <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                </svg>
              </button>
            </header>

            {/* ── Today's Ritual card (setup complete only) ── */}
            {setupProfile.completed && (
              <article className="home-ritual-card" onClick={() => setRoute("sessions")} role="button" tabIndex={0} aria-label="View session progress">
                <div className="hrc-header">
                  <span className="hrc-label">{"Today’s Ritual"}</span>
                  <span className="hrc-header-right">
                    <span className="hrc-day">{todayDay}</span>
                    <span className="hrc-nav-arrow">{"›"}</span>
                  </span>
                </div>
                <div className="hrc-stats">
                  <div className="hrc-stat">
                    <strong>{chantProgress.dailyCount}<em>{"/"}{chantProgress.dailyTarget}</em></strong>
                    <span>Chants</span>
                  </div>
                  <div className="hrc-sep" />
                  <div className="hrc-stat">
                    <strong>{dailyMinutesDisplay}<em>{"m"}</em></strong>
                    <span>{"of "}{dailyTimeTargetMinutes}{"m time"}</span>
                  </div>
                  <div className="hrc-sep" />
                  <div className="hrc-stat">
                    <strong>{chantProgress.streakDays}</strong>
                    <span>{"Day streak 🔥"}</span>
                  </div>
                </div>
                <div className="hrc-track-wrap">
                  <div className="hrc-track">
                    <div className="hrc-fill" style={{ width: `${dailyProgressPercent}%` }} />
                  </div>
                  <span className="hrc-pct">{dailyProgressPercent}{"%"}</span>
                </div>
              </article>
            )}

            {/* ── Featured sloka (today's recommendation or popular fallback) ── */}
            {(() => {
              const featured = todayRecommendedSlokas[0] ?? popularSlokas[0];
              const isToday = todayRecommendedSlokas.length > 0;
              if (!featured) return null;
              return (
                <article className="home-featured-card">
                  <div className="home-featured-label">
                    <span className="home-featured-badge">{isToday ? `Today — ${todayDay}` : "Featured"}</span>
                  </div>
                  <button
                    className="home-featured-sloka"
                    onClick={() => void loadSlokaDetail(featured.id, "home")}
                    type="button"
                  >
                    <div className="home-featured-img-wrap">
                      <Image
                        alt={featured.category}
                        className={`home-featured-img ${featured.category === "Hanuman" ? "hanuman-deity-image" : ""}`}
                        height={56}
                        sizes="56px"
                        src={featured.category === "Hanuman" ? HANUMAN_ICON_SRC : DEITY_PHOTOS[featured.category] ?? DEITY_PHOTOS.Shiva}
                        unoptimized
                        width={56}
                      />
                    </div>
                    <div className="home-featured-text">
                      <strong>{featured.title}</strong>
                      <span>{featured.category} · {featured.duration}</span>
                    </div>
                    <div className="home-featured-cta">Chant Now</div>
                  </button>
                </article>
              );
            })()}

            {/* ── Search ── */}
            <div className="home-search-wrap">
              <svg aria-hidden="true" className="home-search-icon" fill="none" height="16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="16"><circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/></svg>
              <input
                autoComplete="off"
                className="home-search-input"
                id="dashboard-search"
                ref={homeSearchInputRef}
                onChange={(event) => setHomeSearch(event.target.value)}
                placeholder="Search sloka, deity or Tamil…"
                value={homeSearch}
              />
              {homeSearch.trim().length > 0 && (
                <button className="home-search-clear" onClick={() => setHomeSearch("")} type="button" aria-label="Clear">✕</button>
              )}
              {homeSuggestions.length > 0 && (
                <div className="search-suggestions" role="listbox">
                  {homeSuggestions.map((suggestion) => (
                    <button
                      className="search-suggestion"
                      key={`suggestion-${suggestion.value}`}
                      onClick={() => { setHomeSearch(suggestion.value); }}
                      type="button"
                    >{suggestion.value}</button>
                  ))}
                </div>
              )}
            </div>

            {/* ── Deity quick-start ── */}
            <article className="home-section-card">
              <h2 className="home-section-title">Chant by Deity</h2>
              <div className="deity-quick-row" role="list" aria-label="Quick deity selection">
                {deityHighlights.slice(0, 10).map((deity) => (
                  <button
                    className="deity-quick-chip"
                    key={`quick-${deity.category}`}
                    onClick={() => { setGodsCategory(deity.category); setRoute("gods"); }}
                    type="button"
                  >
                    <Image
                      alt={deity.category}
                      className={`deity-quick-image ${deity.category === "Hanuman" ? "hanuman-deity-image" : ""}`}
                      height={42}
                      sizes="42px"
                      src={deity.category === "Hanuman" ? HANUMAN_ICON_SRC : DEITY_PHOTOS[deity.category] ?? DEITY_PHOTOS.Shiva}
                      unoptimized
                      width={42}
                    />
                    <span>{deity.category}</span>
                  </button>
                ))}
              </div>
            </article>

            <article className="event-card today-card">
              <div className="today-head">
                <div>
                  <h2>Today in Tamil Calendar</h2>
                  <p>{todayCalendar ? `${todayCalendar.weekday}, ${todayCalendar.date}` : "Loading today's details..."}</p>
                </div>
                <span className="badge">{todayCalendar?.highlight ?? "Daily Panchang"}</span>
              </div>
              <div className="today-grid">
                <div className="today-cell">
                  <small>Tithi</small>
                  <strong>{todayCalendar?.tithi ?? "..."}</strong>
                </div>
                <div className="today-cell">
                  <small>Paksha</small>
                  <strong>{todayCalendar?.paksha ?? "..."}</strong>
                </div>
                <div className="today-cell">
                  <small>Masa</small>
                  <strong>{todayCalendar?.masa ?? "..."}</strong>
                </div>
              </div>
              {todayCalendar && todayCalendar.festivals.length > 0 && (
                <div className="today-festival-row">
                  {todayCalendar.festivals.slice(0, 2).map((festival) => (
                    <span className="festival-pill" key={`today-festival-${festival.name}`}>
                      {festival.name}
                    </span>
                  ))}
                </div>
              )}
              <p className="mini-muted">{todayCalendar?.location ?? "Tamil Panchang context for daily chanting"}</p>
            </article>

            {homeSearch.trim().length > 0 || guidedStart ? (
              <>
                <div className="section-heading">
                  <h2>{homeSearch.trim().length > 0 ? "Search Results" : "Suggested Results"}</h2>
                </div>
                <div className="sloka-list">
                  {(homeSearch.trim().length > 0 ? homeResults : homeResults.slice(0, 5)).map((sloka) => (
                    <article className="sloka-card" key={`home-result-${sloka.id}`}>
                      <button className="sloka-card-btn" onClick={() => void loadSlokaDetail(sloka.id, "home")} type="button">
                        <SlokaTile sloka={sloka} />
                        <div className="sloka-card-text">
                          <strong>{sloka.title}</strong>
                          <small>{sloka.titleTamil} · {sloka.category} · {sloka.duration}</small>
                        </div>
                        <span className="sloka-card-arrow">{"›"}</span>
                      </button>
                      <button
                        aria-label={favorites.has(sloka.id) ? `Remove ${sloka.title} from favorites` : `Add ${sloka.title} to favorites`}
                        className={`sloka-card-fav favorite-icon-button ${favorites.has(sloka.id) ? "active" : ""}`}
                        onClick={() => toggleFavorite(sloka.id)}
                        title={favorites.has(sloka.id) ? "Remove favorite" : "Add favorite"}
                        type="button"
                      >
                        <FavoriteGlyph active={favorites.has(sloka.id)} />
                      </button>
                    </article>
                  ))}
                </div>
                {!homeSearch.trim() && homeResults.length > 5 && (
                  <button className="see-more-link" onClick={() => setRoute("library")} type="button">
                    See more <span aria-hidden="true">›</span>
                  </button>
                )}
                {homeResults.length === 0 && (
                  <article className="event-card">
                    <h3>No matches found</h3>
                    <p>
                      {homeSearch.trim().length > 0
                        ? "Try a different title, Tamil text, or category keyword."
                        : "Try a longer duration or type a sloka name."}
                    </p>
                  </article>
                )}
              </>
            ) : (
              <>
                <div className="section-heading">
                  <h2>Popular Slokas</h2>
                </div>
                {popularSlokas.length === 0 ? (
                  <article className="event-card">
                    <h3>No slokas available</h3>
                    <p>Please add slokas to the catalog.</p>
                  </article>
                ) : (
                  <div className="sloka-list">
                    {popularSlokas.map((sloka) => (
                      <article className="sloka-card" key={`popular-${sloka.id}`}>
                        <button className="sloka-card-btn" onClick={() => void loadSlokaDetail(sloka.id, "home")} type="button">
                          <SlokaTile sloka={sloka} />
                          <div className="sloka-card-text">
                            <strong>{sloka.title}</strong>
                            <small>{sloka.titleTamil} · {sloka.category} · {sloka.duration}</small>
                          </div>
                          <span className="sloka-card-arrow">{"›"}</span>
                        </button>
                        <button
                          aria-label={favorites.has(sloka.id) ? `Remove ${sloka.title} from favorites` : `Add ${sloka.title} to favorites`}
                          className={`sloka-card-fav favorite-icon-button ${favorites.has(sloka.id) ? "active" : ""}`}
                          onClick={() => toggleFavorite(sloka.id)}
                          title={favorites.has(sloka.id) ? "Remove favorite" : "Add favorite"}
                          type="button"
                        >
                          <FavoriteGlyph active={favorites.has(sloka.id)} />
                        </button>
                      </article>
                    ))}
                  </div>
                )}
              </>
            )}
          </section>
        )}

        {route === "gods" && (
          <section className="screen active gods-screen">
            <div className="screen-top gods-screen-top">
              <button className="icon-button" onClick={() => setRoute("home")} type="button" title="Back">
                <BackGlyph />
              </button>
              <div className="gods-screen-top-main">
                <Image alt="My Shloka Ritual mark" className="gods-screen-logo" height={32} src={BRAND_MARK_SRC} unoptimized width={32} />
                <div className="gods-screen-top-copy">
                  <h1>Shloka Library</h1>
                  <p>Daily chants for inner calm</p>
                </div>
              </div>
              <div className="gods-screen-top-actions">
                <button className="favorite-icon-button gods-top-action" onClick={() => setRoute("library")} title="Open library" type="button">
                  <SearchGlyph />
                </button>
                <button className="favorite-icon-button gods-top-action" onClick={() => setGodsCategory("all")} title="Reset filter" type="button">
                  <FilterGlyph />
                </button>
              </div>
            </div>

            <article className="event-card gods-deity-collection">
              <div className="chip-row gods-chip-row">
                <button
                  className={`chip ${godsCategory === "all" ? "active" : ""}`}
                  onClick={() => setGodsCategory("all")}
                  type="button"
                >
                  All
                </button>
                {categories
                  .filter((category) => category !== "all")
                  .map((category) => (
                    <button
                      className={`chip ${godsCategory === category ? "active" : ""}`}
                      key={`gods-chip-${category}`}
                      onClick={() => setGodsCategory(category)}
                      type="button"
                    >
                      {category}
                    </button>
                  ))}
              </div>
              <div className="deity-grid gods-deity-grid">
                {deityHighlights.map((deity, index) => (
                  <button
                    className={`deity-card ${godsCategory === deity.category ? "active" : ""}`}
                    key={`gods-deity-${deity.category}`}
                    onClick={() => setGodsCategory(deity.category)}
                    type="button"
                  >
                    <div className="deity-card-top">
                      <Image
                        alt={`${deity.category} deity`}
                        className={`deity-icon-photo ${deity.category === "Hanuman" ? "hanuman-deity-image" : ""}`}
                        height={72}
                        priority={index < 2}
                        sizes="72px"
                        src={deity.category === "Hanuman" ? HANUMAN_ICON_SRC : DEITY_PHOTOS[deity.category] ?? DEITY_PHOTOS.Shiva}
                        unoptimized
                        width={72}
                      />
                      <span className="deity-copy">
                        <strong>{deity.category}</strong>
                        <small>{deity.count} slokas</small>
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </article>

            <div className="section-heading compact">
              <h2>{godsCategory === "all" ? "All Deity Slokas" : `${godsCategory} Slokas`}</h2>
            </div>
            {godsFilteredSlokas.length === 0 ? (
              <article className="event-card">
                <h3>No slokas found</h3>
                <p>Try a different deity filter.</p>
              </article>
            ) : (
              <div className="ritual-library-grid gods-results-grid">
                {godsFilteredSlokas.map((sloka) => (
                  <article className="event-card ritual-library-card gods-result-card" key={`gods-${sloka.id}`}>
                    <button
                      aria-label={favorites.has(sloka.id) ? `Remove ${sloka.title} from favorites` : `Add ${sloka.title} to favorites`}
                      className={`favorite-icon-button ritual-library-favorite ${favorites.has(sloka.id) ? "active" : ""}`}
                      onClick={() => toggleFavorite(sloka.id)}
                      title={favorites.has(sloka.id) ? "Remove favorite" : "Add favorite"}
                      type="button"
                    >
                      <FavoriteGlyph active={favorites.has(sloka.id)} />
                    </button>
                    <button className="ritual-library-main gods-library-main" onClick={() => void loadSlokaDetail(sloka.id, "gods")} type="button">
                      <span className="ritual-library-tile">
                        <SlokaTile sloka={sloka} />
                      </span>
                      <strong>{sloka.title}</strong>
                      <small>{sloka.titleTamil}</small>
                    </button>
                    <div className="ritual-library-meta">
                      <span>{sloka.duration}</span>
                      <span>{`${sloka.lineCount} lines`}</span>
                    </div>
                    <button className="ritual-library-play" onClick={() => void loadSlokaDetail(sloka.id, "gods")} type="button">
                      {"\u25B6"}
                    </button>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        {route === "calendar" && (
          <section className="screen active">
            <div className="screen-top">
              <button className="icon-button" onClick={() => setRoute("home")} type="button" title="Back">
                {"<"}
              </button>
              <div>
                <h1>Panchangam</h1>
                <p>Tamil calendar and auspicious daily details.</p>
              </div>
            </div>

            <article className="event-card today-card">
              <div className="today-head">
                <div>
                  <h2>Today in Tamil Calendar</h2>
                  <p>{todayCalendar ? `${todayCalendar.weekday}, ${todayCalendar.date}` : "Loading today's details..."}</p>
                </div>
                <span className="badge">{todayCalendar?.highlight ?? "Daily Panchang"}</span>
              </div>
              <div className="today-grid">
                <div className="today-cell">
                  <small>Tithi</small>
                  <strong>{todayCalendar?.tithi ?? "..."}</strong>
                </div>
                <div className="today-cell">
                  <small>Paksha</small>
                  <strong>{todayCalendar?.paksha ?? "..."}</strong>
                </div>
                <div className="today-cell">
                  <small>Masa</small>
                  <strong>{todayCalendar?.masa ?? "..."}</strong>
                </div>
              </div>
              {todayCalendar && todayCalendar.festivals.length > 0 && (
                <div className="today-festival-row">
                  {todayCalendar.festivals.map((festival) => (
                    <span className="festival-pill" key={`calendar-festival-${festival.name}`}>
                      {festival.name}
                    </span>
                  ))}
                </div>
              )}
              <p className="mini-muted">{todayCalendar?.location ?? "Tamil Panchang context for daily chanting"}</p>
            </article>

            <article className="event-card section-stack">
              <h3>Daily Panchang Snapshot</h3>
              <ul className="calendar-detail-list">
                <li>
                  <span>Weekday</span>
                  <strong>{todayCalendar?.weekday ?? todayDay ?? "..."}</strong>
                </li>
                <li>
                  <span>Auspicious Focus</span>
                  <strong>{todayCalendar?.highlight ?? "General prayer day"}</strong>
                </li>
                <li>
                  <span>Best Place</span>
                  <strong>{todayCalendar?.location ?? "Your current location"}</strong>
                </li>
              </ul>
            </article>

            <article className="recommendation-card section-stack">
              <h3>Recommended Slokas for Today</h3>
              {todayRecommendedSlokas.length > 0 ? (
                <ul className="top-list">
                  {todayRecommendedSlokas.map((sloka) => (
                    <li key={`calendar-reco-${sloka.id}`}>
                      <strong>{sloka.title}</strong>
                      <span>{SLOKA_RECOMMENDATIONS[sloka.id]?.days.join(", ")}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No special day-specific recommendation today. You can chant any favorite sloka.</p>
              )}
            </article>

            <article className="event-card section-stack">
              <h3>Chant Completion Calendar</h3>
              <p className="mini-muted">Shows whether any sloka was completed on each day.</p>
              <div className="completion-calendar-grid">
                {recentCalendarDays.map((day) => (
                  <span
                    className={`completion-day ${day.completedCount > 0 ? "done" : ""} ${day.isToday ? "today" : ""}`}
                    key={`completion-day-${day.key}`}
                    title={`${day.key}: ${day.completedCount} completed`}
                  >
                    <small>{day.label}</small>
                    <strong>{day.day}</strong>
                    <em>{day.completedCount > 0 ? `${day.completedCount} done` : "Open"}</em>
                  </span>
                ))}
              </div>
            </article>
          </section>
        )}

        {route === "sessions" && (
          <section className="screen active">
            <div className="screen-top">
              <button className="icon-button" onClick={() => setRoute("home")} type="button" title="Back">
                {"<"}
              </button>
              <div>
                <h1>Sessions</h1>
                <p>Pick duration, track chanting, and keep reminders in one place.</p>
              </div>
            </div>

            <article className="event-card">
              <h3>Create Session</h3>
              <p>How much time do you have?</p>
              <div className="session-time-grid">
                {[5, 10, 15].map((duration) => (
                  <button
                    className={`session-time-chip ${sessionDuration === duration ? "active" : ""}`}
                    key={`session-time-${duration}`}
                    onClick={() => setSessionDuration(duration)}
                    type="button"
                  >
                    {duration} min
                  </button>
                ))}
                <button className="session-time-chip" type="button">
                  Custom
                </button>
              </div>
              <article className="smart-suggestion-box">
                <p>We will choose the best slokas for a peaceful {sessionDuration} minute session.</p>
              </article>
              <button className="primary-button full" onClick={() => setRoute("library")} type="button">
                Start Chanting
              </button>
            </article>

            <article className="event-card session-preview-card">
              <div className="session-preview-top">
                <span>Session Preview</span>
                <small>{sessionDuration} min</small>
              </div>
              <div className="session-preview-avatar">
                <Image
                  alt={`${selectedSloka.category} deity`}
                  className={`session-preview-image ${selectedSloka.category === "Hanuman" ? "hanuman-deity-image" : ""}`}
                  height={140}
                  sizes="140px"
                  src={DEITY_PHOTOS[selectedSloka.category] ?? DEITY_PHOTOS.Shiva}
                  unoptimized
                  width={140}
                />
              </div>
              <h3>{selectedSloka.title}</h3>
              <p>{selectedSloka.titleTamil}</p>
            </article>

            <article className="event-card">
              <h3>Your Chant Progress</h3>
              <div className="stats-grid">
                <div className="metric-box">
                  <h3>
                    {chantProgress.dailyCount}/{chantProgress.dailyTarget}
                  </h3>
                  <p>Today</p>
                </div>
                <div className="metric-box">
                  <h3>{chantProgress.streakDays}</h3>
                  <p>Streak</p>
                </div>
                <div className="metric-box">
                  <h3>{chantProgress.totalCount}</h3>
                  <p>Total</p>
                </div>
              </div>
              <label className="field-label">Daily frequency target</label>
              <div className="chip-row">
                {DAILY_TARGET_OPTIONS.map((target) => (
                  <button
                    className={`chip ${chantProgress.dailyTarget === target ? "active" : ""}`}
                    key={`daily-target-${target}`}
                    onClick={() => setChantProgress((previous) => ({ ...previous, dailyTarget: target }))}
                    type="button"
                  >
                    {target} chants
                  </button>
                ))}
              </div>
              <div className="action-row">
                <button className="secondary-button" onClick={() => logChantCount(selectedSloka.id, 1)} type="button">
                  +1 Chant
                </button>
                <button className="secondary-button" onClick={() => logChantCount(selectedSloka.id, 5)} type="button">
                  +5 Chants
                </button>
              </div>
              {unlockedBadges.length > 0 && (
                <div className="badge-grid">
                  {unlockedBadges.map((badge) => (
                    <span className="badge-card" key={`badge-${badge}`}>
                      {badge}
                    </span>
                  ))}
                </div>
              )}
              {topChantedSlokas.length > 0 && (
                <ul className="top-list">
                  {topChantedSlokas.map((item) => (
                    <li key={`top-sloka-${item.id}`}>
                      <strong>{item.title}</strong>
                      <span>{item.count} chants</span>
                    </li>
                  ))}
                </ul>
              )}
            </article>

            <article className="event-card section-stack">
              <h3>Chant Lists</h3>
              <p>Manage your playlist-style chant lists on a dedicated page.</p>
              {chantListStats.length === 0 ? (
                <p className="mini-muted">No chant lists yet. Open Chant Lists to create your first one.</p>
              ) : (
                <ul className="top-list">
                  {chantListStats.slice(0, 3).map((list) => (
                    <li key={`session-chant-summary-${list.id}`}>
                      <strong>{list.name}</strong>
                      <span>{list.completedToday}/{list.total || 1} done today</span>
                    </li>
                  ))}
                </ul>
              )}
              <button className="primary-button full" onClick={() => setRoute("chantlists")} type="button">
                Open Chant Lists
              </button>
            </article>

            <article className="recommendation-card section-stack">
              <h3>Recommended Days</h3>
              {selectedRecommendation ? (
                <p>
                  {selectedSloka.title}: {selectedRecommendation.days.join(", ")}. {selectedRecommendation.reason}
                </p>
              ) : (
                <p>Open a sloka to see its recommended weekly days.</p>
              )}
              <p className="mini-muted">{todayDay ? `Today is ${todayDay}.` : "Loading today's recommendation..."}</p>
              {todayRecommendedSlokas.length > 0 && (
                <ul className="top-list">
                  {todayRecommendedSlokas.map((sloka) => (
                    <li key={`today-reco-${sloka.id}`}>
                      <strong>{sloka.title}</strong>
                      <span>{SLOKA_RECOMMENDATIONS[sloka.id]?.days.join(", ")}</span>
                    </li>
                  ))}
                </ul>
              )}
            </article>

            <article className="event-card section-stack">
              <h3>Reminder Notifications</h3>
              <p>Set your preferred days and time. The app can alert you while browser notifications are allowed.</p>
              <div className="meta-row">
                <span className="mini-muted">{reminders.enabled ? "Reminders enabled" : "Reminders disabled"}</span>
                <button
                  className={`switch-button ${reminders.enabled ? "active" : ""}`}
                  onClick={() => setReminders((previous) => ({ ...previous, enabled: !previous.enabled }))}
                  type="button"
                >
                  {reminders.enabled ? "On" : "Off"}
                </button>
              </div>
              <label className="field-label" htmlFor="reminder-time">
                Reminder time
              </label>
              <input
                className="search-input"
                disabled={!reminders.enabled}
                id="reminder-time"
                onChange={(event) => setReminders((previous) => ({ ...previous, time: event.target.value }))}
                type="time"
                value={reminders.time}
              />
              <div className="day-picker">
                {WEEK_DAYS.map((day) => (
                  <button
                    className={`day-chip ${reminders.days.includes(day) ? "active" : ""}`}
                    disabled={!reminders.enabled}
                    key={`reminder-day-${day}`}
                    onClick={() => toggleReminderDay(day)}
                    type="button"
                  >
                    {day.slice(0, 3)}
                  </button>
                ))}
              </div>
              <div className="action-row">
                <button className="secondary-button" onClick={() => void triggerTestNotification()} type="button">
                  Test Notification
                </button>
                <button
                  className="secondary-button"
                  onClick={() => setReminders(DEFAULT_REMINDERS)}
                  type="button"
                >
                  Reset
                </button>
              </div>
              {!isHydrated && <p className="mini-muted">Loading saved reminder settings...</p>}
            </article>
          </section>
        )}

        {route === "chantlists" && (
          <section className="screen active">
            <div className="screen-top">
              <button className="icon-button" onClick={() => setRoute("sessions")} type="button" title="Back">
                {"<"}
              </button>
              <div>
                <h1>Chant Lists</h1>
                <p>Create lists, schedule notifications, and run slokas back to back.</p>
              </div>
            </div>

            <article className="event-card section-stack">
              <h3>Create Chant List</h3>
              <div className="chant-list-create">
                <label className="field-label" htmlFor="chant-list-name">
                  List name
                </label>
                <input
                  className="search-input"
                  id="chant-list-name"
                  onChange={(event) => setChantListName(event.target.value)}
                  placeholder="Morning Chant"
                  value={chantListName}
                />
                <label className="field-label" htmlFor="chant-list-first-sloka">
                  First sloka
                </label>
                <select
                  className="search-input"
                  id="chant-list-first-sloka"
                  onChange={(event) => setChantListSelectedSlokaId(event.target.value)}
                  value={chantListSelectedSlokaId}
                >
                  {slokaList.map((sloka) => (
                    <option key={`chant-list-first-${sloka.id}`} value={sloka.id}>
                      {sloka.title}
                    </option>
                  ))}
                </select>
                <button className="primary-button full" onClick={createChantList} type="button">
                  Create Chant List
                </button>
              </div>
            </article>

            <article className="event-card section-stack">
              <h3>Your Lists</h3>
              {chantListStats.length === 0 ? (
                <p className="mini-muted">No chant lists yet. Create one above.</p>
              ) : (
                <div className="chant-playlist-stack">
                  {chantListStats.map((list) => {
                    const isOpen = detailChantListTargetId === list.id;
                    return (
                      <article className={`chant-playlist-card ${activeChantListId === list.id ? "active" : ""}`} key={`playlist-${list.id}`}>
                        <div className="chant-playlist-head">
                          <div>
                            <h4>{list.name}</h4>
                            <p>{list.completedToday}/{list.total || 1} done today</p>
                          </div>
                          <div className="action-row">
                            <button className="secondary-button" onClick={() => setDetailChantListId(isOpen ? "" : list.id)} type="button">
                              {isOpen ? "Hide List" : "Open List"}
                            </button>
                            <button className="primary-button" onClick={() => void startChantList(list.id)} type="button">
                              Start List
                            </button>
                          </div>
                        </div>
                        <div className="chant-playlist-settings">
                          <label>
                            Time
                            <input
                              onChange={(event) => updateChantList(list.id, { scheduleTime: event.target.value })}
                              type="time"
                              value={list.scheduleTime}
                            />
                          </label>
                          <button
                            className={`switch-button ${list.enabled ? "active" : ""}`}
                            onClick={async () => {
                              if (!list.enabled && typeof Notification !== "undefined" && Notification.permission === "default") {
                                await Notification.requestPermission();
                              }
                              updateChantList(list.id, { enabled: !list.enabled });
                            }}
                            type="button"
                          >
                            {list.enabled ? "Notify On" : "Notify Off"}
                          </button>
                          <button className="secondary-button" onClick={() => addSlokaToChantList(list.id, chantListSelectedSlokaId)} type="button">
                            Add Selected
                          </button>
                        </div>
                        {isOpen && (
                          <div className="chant-list">
                            {list.slokaIds.map((slokaId, index) => {
                              const sloka = slokaList.find((item) => item.id === slokaId);
                              if (!sloka) return null;
                              const entry = normalizePracticeEntry(slokaPractice[sloka.id]);
                              const doneToday = entry.completedDates.includes(todayDateKey);
                              return (
                                <div className="chant-list-row" key={`playlist-${list.id}-${sloka.id}`}>
                                  <SlokaTile sloka={sloka} />
                                  <button onClick={() => void loadSlokaDetail(sloka.id, "chantlists")} type="button">
                                    <strong>{index + 1}. {sloka.title}</strong>
                                    <small>{doneToday ? "Done today" : "Not done today"}</small>
                                  </button>
                                  <button className="mini-remove-button" onClick={() => removeSlokaFromChantList(list.id, sloka.id)} type="button">
                                    Remove
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        )}
                        <button className="secondary-button full" onClick={() => deleteChantList(list.id)} type="button">
                          Delete List
                        </button>
                      </article>
                    );
                  })}
                </div>
              )}
            </article>
          </section>
        )}

        {route === "library" && (
          <section className="screen active">
            <div className="screen-top">
              <button className="icon-button" onClick={() => setRoute("home")} type="button" title="Back">
                {"<"}
              </button>
              <div>
                <h1>Library</h1>
                <p>Search and open any sloka.</p>
              </div>
            </div>

            <label className="field-label" htmlFor="library-search">
              Search
            </label>
            <input
              className="search-input"
              id="library-search"
              onChange={(event) => setLibrarySearch(event.target.value)}
              placeholder="Search by title, category, or Tamil text"
              value={librarySearch}
            />

            <div className="chip-row">
              {categories.map((category) => (
                <button
                  className={`chip ${libraryCategory === category ? "active" : ""}`}
                  key={category}
                  onClick={() => setLibraryCategory(category)}
                  type="button"
                >
                  {category === "all" ? "All" : category}
                </button>
              ))}
            </div>

            {setupProfile.completed ? (
              <div className="ritual-library-grid">
                {filteredSlokas.map((sloka) => (
                  <article className="event-card ritual-library-card" key={`library-${sloka.id}`}>
                    <button
                      aria-label={favorites.has(sloka.id) ? `Remove ${sloka.title} from favorites` : `Add ${sloka.title} to favorites`}
                      className={`favorite-icon-button ritual-library-favorite ${favorites.has(sloka.id) ? "active" : ""}`}
                      onClick={() => toggleFavorite(sloka.id)}
                      title={favorites.has(sloka.id) ? "Remove favorite" : "Add favorite"}
                      type="button"
                    >
                      <FavoriteGlyph active={favorites.has(sloka.id)} />
                    </button>
                    <button className="ritual-library-main" onClick={() => void loadSlokaDetail(sloka.id, "library")} type="button">
                      <span className="ritual-library-tile">
                        <SlokaTile sloka={sloka} />
                      </span>
                      <strong>{sloka.title}</strong>
                      <small>{sloka.titleTamil}</small>
                    </button>
                    <div className="ritual-library-meta">
                      <span>{sloka.duration}</span>
                      <span>{`${chantProgress.perSlokaCount[sloka.id] ?? 0} chants`}</span>
                    </div>
                    <button className="ritual-library-play" onClick={() => void loadSlokaDetail(sloka.id, "library")} type="button">
                      {"▶"}
                    </button>
                  </article>
                ))}
              </div>
            ) : (
              <div className="sloka-list">
                {filteredSlokas.map((sloka) => (
                  <article className="sloka-card" key={`library-${sloka.id}`}>
                    <button className="sloka-card-btn" onClick={() => void loadSlokaDetail(sloka.id, "library")} type="button">
                      <SlokaTile sloka={sloka} />
                      <div className="sloka-card-text">
                        <strong>{sloka.title}</strong>
                        <small>{sloka.titleTamil} · {sloka.category} · {sloka.duration}</small>
                      </div>
                      <span className="sloka-card-arrow">{"›"}</span>
                    </button>
                    <button
                      aria-label={favorites.has(sloka.id) ? `Remove ${sloka.title} from favorites` : `Add ${sloka.title} to favorites`}
                      className={`sloka-card-fav favorite-icon-button ${favorites.has(sloka.id) ? "active" : ""}`}
                      onClick={() => toggleFavorite(sloka.id)}
                      title={favorites.has(sloka.id) ? "Remove favorite" : "Add favorite"}
                      type="button"
                    >
                      <FavoriteGlyph active={favorites.has(sloka.id)} />
                    </button>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        {route === "favorites" && (
          <section className="screen active">
            <div className="screen-top">
              <button className="icon-button" onClick={() => setRoute("home")} type="button" title="Back">
                {"<"}
              </button>
              <div>
                <h1>Favorites</h1>
                <p>Your saved slokas in one place.</p>
              </div>
            </div>

            <label className="field-label" htmlFor="favorites-search">
              Search Favorites
            </label>
            <input
              className="search-input"
              id="favorites-search"
              onChange={(event) => setFavoritesSearch(event.target.value)}
              placeholder="Find inside favorites"
              value={favoritesSearch}
            />

            {filteredFavorites.length === 0 && (
              <article className="event-card">
                <h3>No matching favorites</h3>
                <p>Add favorites from Home or Library, then they stay here.</p>
              </article>
            )}

            <div className="sloka-list">
              {filteredFavorites.map((sloka) => (
                <article className="sloka-card" key={`favorite-${sloka.id}`}>
                  <button className="sloka-card-btn" onClick={() => void loadSlokaDetail(sloka.id, "favorites")} type="button">
                    <SlokaTile sloka={sloka} />
                    <div className="sloka-card-text">
                      <strong>{sloka.title}</strong>
                      <small>{sloka.titleTamil} · {sloka.category} · {sloka.duration}</small>
                    </div>
                    <span className="sloka-card-arrow">{"›"}</span>
                  </button>
                  <button
                    aria-label={`Remove ${sloka.title} from favorites`}
                    className="sloka-card-fav favorite-icon-button active"
                    onClick={() => toggleFavorite(sloka.id)}
                    title="Remove favorite"
                    type="button"
                  >
                    <FavoriteGlyph active />
                  </button>
                </article>
              ))}
            </div>
          </section>
        )}

        {route === "profile" && (
          <section className="screen active">
            <div className="screen-top">
              <button className="icon-button" onClick={() => setRoute("home")} type="button" title="Back">
                {"<"}
              </button>
              <div>
                <h1>Profile</h1>
                <p>Your chanting progress and settings.</p>
              </div>
            </div>

            <article className="event-card">
              <h3>Progress Summary</h3>
              <div className="stats-grid">
                <div className="metric-box">
                  <h3>{chantProgress.streakDays}</h3>
                  <p>Streak Days</p>
                </div>
                <div className="metric-box">
                  <h3>{chantProgress.totalCount}</h3>
                  <p>Total Chants</p>
                </div>
                <div className="metric-box">
                  <h3>{favorites.size}</h3>
                  <p>Favorites</p>
                </div>
              </div>
              <div className="action-row">
                <button className="secondary-button" onClick={() => setRoute("calendar")} type="button">
                  Open Panchangam
                </button>
                <button className="secondary-button" onClick={() => setRoute("sessions")} type="button">
                  Session Tools
                </button>
              </div>
            </article>

            <article className="event-card profile-language-card">
              <h3>Language Settings</h3>
              <p>Choose Tamil or English, and update how slokas are shown while chanting.</p>
              <div className="profile-language-grid">
                <button
                  className={`switch-button ${setupProfile.language === "tamil" ? "active" : ""}`}
                  onClick={() => applyLanguagePreferences({ language: "tamil" })}
                  type="button"
                >
                  {"\u0ba4\u0bae\u0bbf\u0bb4\u0bcd"}
                </button>
                <button
                  className={`switch-button ${setupProfile.language === "english" ? "active" : ""}`}
                  onClick={() => applyLanguagePreferences({ language: "english" })}
                  type="button"
                >
                  English
                </button>
              </div>
              <h4>Reader View</h4>
              <div className="profile-language-grid">
                <button
                  className={`switch-button ${setupProfile.viewMode === "tamil_only" ? "active" : ""}`}
                  onClick={() => applyLanguagePreferences({ viewMode: "tamil_only" })}
                  type="button"
                >
                  Tamil only
                </button>
                <button
                  className={`switch-button ${setupProfile.viewMode === "tamil_english" ? "active" : ""}`}
                  onClick={() => applyLanguagePreferences({ viewMode: "tamil_english" })}
                  type="button"
                >
                  Tamil + Meaning
                </button>
              </div>
              <p className="profile-language-note">
                You can change these anytime. English mode focuses on English lines only.
              </p>
              <div className="action-row">
                <button className="secondary-button" onClick={openSetupFromProfile} type="button">
                  Change Setup
                </button>
              </div>
            </article>

            <article className="event-card">
              <h3>Appearance</h3>
              <p className="mini-muted">Switch between the calm day theme and a restful dark mode.</p>
              <div className="profile-language-grid" style={{ marginTop: "12px" }}>
                <button
                  className={`switch-button ${!isDarkTheme ? "active" : ""}`}
                  onClick={() => { if (isDarkTheme) toggleTheme(); }}
                  type="button"
                >
                  ☀ Day
                </button>
                <button
                  className={`switch-button ${isDarkTheme ? "active" : ""}`}
                  onClick={() => { if (!isDarkTheme) toggleTheme(); }}
                  type="button"
                >
                  ☽ Night
                </button>
              </div>
            </article>
          </section>
        )}

        {route === "detail" && (
          <section className="screen active detail-screen ref-player-screen" style={readerScaleStyle}>
            <article className="ref-player-main-card">
              <div className="ref-player-top-half">
                <header className="ref-player-header">
                  <button className="ref-player-header-icon" onClick={() => setRoute(detailBackRoute)} title="Back" type="button">
                    <BackGlyph />
                  </button>
                  <span className="ref-player-header-spacer" aria-hidden="true" />
                  <button
                    className="ref-player-header-icon"
                    title="Search slokas"
                    type="button"
                    onClick={() => setGlobalSearchOpen(true)}
                  >
                    <svg aria-hidden="true" fill="none" height="20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24" width="20"><circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/></svg>
                  </button>
                  <button
                    className="ref-player-header-icon"
                    title="Share this sloka"
                    type="button"
                    onClick={() => {
                      const preview = selectedSloka.lines.slice(0, 3)
                        .map((l) => l.english)
                        .join("\n");
                      const appUrl = "https://myshlokasritual.app";
                      const text = [
                        `🪔 ${selectedSloka.title}`,
                        `\n${preview}\n...`,
                        `\nChanting daily brings inner calm.`,
                        `\nDownload My Shloka Ritual 👉 ${appUrl}`,
                        `\n#MyShlokasRitual #DailyChanting #${selectedSloka.category}`,
                      ].join("\n");
                      if (typeof navigator !== "undefined" && navigator.share) {
                        void navigator.share({ title: `${selectedSloka.title} — My Shloka Ritual`, text, url: appUrl });
                      } else {
                        void navigator.clipboard?.writeText(text).then(() =>
                          setLiveMessage("Sloka copied — paste to share!")
                        );
                      }
                    }}
                  >
                    <svg aria-hidden="true" fill="none" height="20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24" width="20">
                      <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                      <line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/>
                    </svg>
                  </button>
                </header>

                <PlayerHeroCard
                  imageSrc={DEITY_PLAYER_HERO_PHOTOS[selectedSloka.category] ?? DEITY_PHOTOS[selectedSloka.category] ?? DEITY_PHOTOS.Shiva}
                  deityName={selectedSloka.category}
                />
              </div>

              <ShlokaTextBlock
                activeLineIndex={selectedPractice.activeLineIndex}
                language={readerLanguage}
                lineHighlights={selectedPractice.lineHighlights}
                lines={selectedSloka.lines}
                onRemoveLineHighlight={removeSelectedLineHighlight}
                onSelectLine={setActivePracticeLine}
                onSetLineHighlight={setSelectedLineHighlight}
                showMeaning={showMeaning}
                title={selectedSloka.title}
              />
              <div className="ref-player-bottom-divider" aria-hidden="true" />

              {selectedSlokaDoneToday ? (
                <div className="detail-chant-status done">
                  <div className="dcs-icon" aria-hidden="true">✓</div>
                  <div className="dcs-text">
                    <strong>Chanted today</strong>
                    <span>{chantProgress.dailyCount} of {chantProgress.dailyTarget} chants done</span>
                  </div>
                </div>
              ) : (
                <div className="detail-chant-status pending">
                  <button
                    className="dcs-mark-btn"
                    onClick={markSelectedSlokaComplete}
                    type="button"
                  >
                    <span aria-hidden="true">🙏</span>
                    I&apos;ve chanted this
                  </button>
                  <span className="dcs-hint">{chantProgress.dailyCount} / {chantProgress.dailyTarget} chants today</span>
                </div>
              )}

              <ReaderControls
                activeLineIndex={selectedPractice.activeLineIndex}
                autoScroll={setupProfile.autoScroll}
                language={readerLanguage}
                onDecreaseFont={decreaseReaderFontScale}
                onIncreaseFont={increaseReaderFontScale}
                onNextLine={() => setActivePracticeLine(selectedPractice.activeLineIndex + 1)}
                onPrevLine={() => setActivePracticeLine(selectedPractice.activeLineIndex - 1)}
                onSetScrollSpeed={(speed) => updateSetupProfile({ scrollSpeed: speed })}
                onSetLanguage={setReaderLanguage}
                onToggleAutoScroll={() => updateSetupProfile({ autoScroll: !setupProfile.autoScroll })}
                onToggleMeaning={() => setShowMeaning((value) => !value)}
                scrollSpeed={setupProfile.scrollSpeed}
                showMeaning={showMeaning}
                totalLines={selectedSloka.lines.length}
              />
            </article>

            {showCompletionPopup && (
              <div
                className="sloka-completion-backdrop"
                onClick={() => setShowCompletionPopup(false)}
                onKeyDown={(event) => {
                  if (event.key === "Escape") setShowCompletionPopup(false);
                }}
                role="button"
                tabIndex={0}
              >
                <article className="sloka-completion-panel" onClick={(event) => event.stopPropagation()}>
                  <div className="sloka-completion-crest" aria-hidden="true">
                    <span>&#10003;</span>
                  </div>
                  <h3>Chant complete</h3>
                  <p>You&apos;ve reached the end of this sloka. Count it toward today&apos;s ritual?</p>
                  <div className="sloka-completion-actions">
                    <button
                      className="primary-button"
                      onClick={() => {
                        markSelectedSlokaComplete();
                      }}
                      type="button"
                    >
                      Mark as done
                    </button>
                    <button
                      className="secondary-button"
                      onClick={() => {
                        setShowCompletionPopup(false);
                      }}
                      type="button"
                    >
                      Keep chanting
                    </button>
                  </div>
                </article>
              </div>
            )}

          </section>
        )}

        {route === "phase2" && (
          <section className="screen active">
            <div className="screen-top">
              <button className="icon-button" onClick={() => setRoute("home")} type="button" title="Back">
                {"<"}
              </button>
              <div>
                <h1>Phase 2</h1>
                <p>Community and live session features.</p>
              </div>
            </div>

            <article className="event-card">
              <span className="badge">Coming Next</span>
              <h3>Join Sessions & Community</h3>
              <p>Live room joining, teacher-led chanting, and group schedules will be added in Phase 2.</p>
            </article>
          </section>
        )}
      </main>
      {route !== "landing" && route !== "detail" && (
        <nav className="app-bottom-nav" aria-label="Bottom Navigation">
          <button className={`abn-tab ${route === "home" ? "active" : ""}`} onClick={() => setRoute("home")} type="button">
            <span className="abn-icon"><RitualNavIcon name="home" /></span>
            <span className="abn-label">Home</span>
          </button>
          <button className={`abn-tab ${route === "gods" || route === "library" ? "active" : ""}`} onClick={() => setRoute("gods")} type="button">
            <span className="abn-icon"><RitualNavIcon name="chants" /></span>
            <span className="abn-label">Explore</span>
          </button>
          <button className={`abn-tab abn-tab-center ${route === "sessions" ? "active" : ""}`} onClick={() => setRoute("sessions")} type="button">
            <span className="abn-icon"><RitualNavIcon name="counter" /></span>
            <span className="abn-label">Sessions</span>
          </button>
          <button className="abn-tab" onClick={() => setGlobalSearchOpen(true)} type="button" aria-label="Search">
            <span className="abn-icon">
              <svg aria-hidden="true" fill="none" height="22" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24" width="22"><circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/></svg>
            </span>
            <span className="abn-label">Search</span>
          </button>
          <button className={`abn-tab ${route === "profile" ? "active" : ""}`} onClick={() => setRoute("profile")} type="button">
            <span className="abn-icon"><RitualNavIcon name="profile" /></span>
            <span className="abn-label">Profile</span>
          </button>
        </nav>
      )}

      {route !== "landing" && route !== "detail" && isSideMenuOpen && (
        <section className="menu-sheet">
          <button className="menu-sheet-backdrop" onClick={() => setIsSideMenuOpen(false)} type="button" />
          <article className="menu-sheet-panel">
            <h3>Menu</h3>
            <div className="menu-sheet-list">
              <button onClick={() => setRoute("library")} type="button"><strong>Shlokas</strong><small>Browse all slokas</small></button>
              <button onClick={() => setRoute("sessions")} type="button"><strong>Sessions</strong><small>Practice and tracker</small></button>
              <button onClick={() => setRoute("chantlists")} type="button"><strong>Chant Lists</strong><small>Playlist and schedule</small></button>
              <button onClick={() => setRoute("calendar")} type="button"><strong>Calendar</strong><small>Done / not done</small></button>
              <button onClick={() => setRoute("gods")} type="button"><strong>Gods</strong><small>Browse by deity</small></button>
              <button onClick={() => setRoute("profile")} type="button"><strong>Profile</strong><small>Settings</small></button>
            </div>
          </article>
        </section>
      )}

      {/* ── Global search overlay ── available on every screen ── */}
      {globalSearchOpen && (
        <div className="gsearch-backdrop" onClick={() => { setGlobalSearchOpen(false); setGlobalSearchQuery(""); }}>
          <div className="gsearch-panel" onClick={(e) => e.stopPropagation()}>
            <div className="gsearch-bar">
              <svg aria-hidden="true" fill="none" height="16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="16"><circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/></svg>
              <input
                autoFocus
                className="gsearch-input"
                onChange={(e) => setGlobalSearchQuery(e.target.value)}
                placeholder="Search slokas, deities…"
                type="search"
                value={globalSearchQuery}
              />
              <button className="gsearch-close" onClick={() => { setGlobalSearchOpen(false); setGlobalSearchQuery(""); }} type="button">✕</button>
            </div>
            <div className="gsearch-results">
              {globalSearchQuery.trim().length < 2 ? (
                <p className="gsearch-hint">Type at least 2 characters to search</p>
              ) : globalSearchResults.length === 0 ? (
                <p className="gsearch-hint">No slokas found for &ldquo;{globalSearchQuery}&rdquo;</p>
              ) : (
                globalSearchResults.map((sloka) => (
                  <button
                    className="gsearch-item"
                    key={`gs-${sloka.id}`}
                    onClick={() => {
                      setGlobalSearchOpen(false);
                      setGlobalSearchQuery("");
                      void loadSlokaDetail(sloka.id, route === "detail" ? detailBackRoute : route as Route);
                    }}
                    type="button"
                  >
                    <div className="gsearch-item-img">
                      <Image
                        alt={sloka.category}
                        className={sloka.category === "Hanuman" ? "hanuman-deity-image" : ""}
                        height={38}
                        sizes="38px"
                        src={sloka.category === "Hanuman" ? HANUMAN_ICON_SRC : DEITY_PHOTOS[sloka.category] ?? DEITY_PHOTOS.Shiva}
                        unoptimized
                        width={38}
                      />
                    </div>
                    <div className="gsearch-item-text">
                      <strong>{sloka.title}</strong>
                      <span>{sloka.category} · {sloka.duration}</span>
                    </div>
                    <svg aria-hidden="true" fill="none" height="14" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="14"><polyline points="9 18 15 12 9 6"/></svg>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}


