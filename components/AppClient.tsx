"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
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
type ReaderLanguage = "both" | "tamil" | "english";
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
};
const WEEK_DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;
const DAILY_TARGET_OPTIONS = [11, 21, 51] as const;
const SLOKA_RECOMMENDATIONS: Record<string, { days: string[]; reason: string }> = {
  "lingashtakam": { days: ["Monday"], reason: "Traditionally chanted for Shiva on Mondays." },
  "shiva-panchakshara-stotram": { days: ["Monday"], reason: "A common Shiva stotram for Monday prayers." },
  "ya-devi-sarva-bhuteshu": { days: ["Friday"], reason: "Friday is commonly observed for Devi worship." },
  "hanuman-chalisa": { days: ["Tuesday", "Saturday"], reason: "Tuesday and Saturday are widely observed for Hanuman worship." },
  "hanuman-dhyanam": { days: ["Tuesday", "Saturday"], reason: "Popular Hanuman chanting days in many communities." },
  "guru-brahma-guru-vishnu": { days: ["Thursday"], reason: "Thursday is associated with Guru worship." },
  "shantakaram-bhujagashayanam": { days: ["Thursday", "Saturday"], reason: "Often chanted for Vishnu prayers on these days." },
};
const DEITY_PHOTOS: Record<string, string> = {
  Shiva: "/deities/line/shiva.png",
  Hanuman: "/deities/line/hanuman.png",
  Durga: "/deities/line/durga.png",
  Vishnu: "/deities/line/vishnu-clean.png",
  Guru: "/deities/line/ayyappa.png",
};
const DEITY_PLAYER_HERO_PHOTOS: Partial<Record<string, string>> = {
  Shiva: "/deities/line/shiva-player-clean-v2.png",
};
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
  fontScale: 0.68,
  language: "both",
  showMeaning: true,
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

function formatElapsedTime(totalSeconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = `${safeSeconds % 60}`.padStart(2, "0");
  return `${minutes}:${seconds}`;
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
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M15 5 8 12l7 7" />
      <path d="M9 12h10" />
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
          className={`ref-player-hero-image ${deityClassName}`}
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
  onDecreaseFont,
  onIncreaseFont,
  onSetLanguage,
  onToggleMeaning,
}: {
  language: ReaderLanguage;
  showMeaning: boolean;
  onDecreaseFont: () => void;
  onIncreaseFont: () => void;
  onSetLanguage: (language: ReaderLanguage) => void;
  onToggleMeaning: () => void;
}) {
  return (
    <article className="ref-reader-controls-card" aria-label="Reader controls">
      <div className="ref-reader-controls-row">
        <button className="ref-reader-button" onClick={onDecreaseFont} title="Decrease font size" type="button">
          A-
        </button>
        <button className="ref-reader-button" onClick={onIncreaseFont} title="Increase font size" type="button">
          A+
        </button>
        <button className={`ref-reader-chip ${language === "tamil" ? "active" : ""}`} onClick={() => onSetLanguage("tamil")} type="button">{"\u0ba4\u0bae\u0bbf\u0bb4\u0bcd"}</button>
        <button className={`ref-reader-chip ${language === "english" ? "active" : ""}`} onClick={() => onSetLanguage("english")} type="button">
          English
        </button>
        <button className={`ref-reader-chip ${language === "both" ? "active" : ""}`} onClick={() => onSetLanguage("both")} type="button">
          Both
        </button>
        <button className={`ref-reader-chip meaning ${showMeaning ? "active" : ""}`} onClick={onToggleMeaning} type="button">Meaning</button>
      </div>
    </article>
  );
}

function SlokaTile({ sloka }: { sloka: SlokaSummary }) {
  const photoSrc = DEITY_PHOTOS[sloka.category];
  if (photoSrc) {
    return (
      <span className="tile image">
        <Image alt={`${sloka.category} icon`} className="tile-image" height={46} sizes="46px" src={photoSrc} unoptimized width={46} />
      </span>
    );
  }

  return <span className="tile">{sloka.category.slice(0, 2).toUpperCase()}</span>;
}

export function AppClient({ initialSlokaList, initialSloka }: AppClientProps) {
  const [route, setRoute] = useState<Route>("landing");
  const [isSideMenuOpen, setIsSideMenuOpen] = useState<boolean>(false);
  const [detailBackRoute, setDetailBackRoute] = useState<Route>("home");
  const [slokaList] = useState<SlokaSummary[]>(initialSlokaList);
  const [selectedSloka, setSelectedSloka] = useState<Sloka>(initialSloka);
  const [homeSearch, setHomeSearch] = useState<string>("");
  const [homeDurationMax, setHomeDurationMax] = useState<number | null>(10);
  const [sessionDuration, setSessionDuration] = useState<number>(5);
  const [guidedStart, setGuidedStart] = useState<boolean>(false);
  const [showStartPrompt, setShowStartPrompt] = useState<boolean>(false);
  const [startPromptQuery, setStartPromptQuery] = useState<string>("");
  const [startPromptDuration, setStartPromptDuration] = useState<number | null>(10);
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
  const [pendingListSlokaId, setPendingListSlokaId] = useState<string>("");
  const [chantCelebrationVisible, setChantCelebrationVisible] = useState<boolean>(false);
  const [chantCelebrationMessage, setChantCelebrationMessage] = useState<string>("");
  const [reminders, setReminders] = useState<ReminderSettings>(DEFAULT_REMINDERS);
  const [todayDay, setTodayDay] = useState<string>("");
  const [todayCalendar, setTodayCalendar] = useState<TamilCalendarToday | null>(null);
  const [readerFontScale, setReaderFontScale] = useState<number>(DEFAULT_READER_PREFS.fontScale);
  const [readerLanguage, setReaderLanguage] = useState<ReaderLanguage>(DEFAULT_READER_PREFS.language);
  const [showMeaning, setShowMeaning] = useState<boolean>(DEFAULT_READER_PREFS.showMeaning);
  const [timeSpentTick, setTimeSpentTick] = useState<number>(0);
  const homeSearchInputRef = useRef<HTMLInputElement | null>(null);
  const startSearchInputRef = useRef<HTMLInputElement | null>(null);

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

  const selectedLinePercent = useMemo(() => {
    if (selectedSloka.lines.length === 0) return 0;
    return Math.round(((selectedPractice.activeLineIndex + 1) / selectedSloka.lines.length) * 100);
  }, [selectedPractice.activeLineIndex, selectedSloka.lines.length]);

  const selectedSessionSeconds = useMemo(() => {
    void timeSpentTick;
    if (!selectedPractice.startedAt || selectedPractice.endedAt) return selectedPractice.timeSpentSeconds;
    const startedAt = new Date(selectedPractice.startedAt).getTime();
    if (!Number.isFinite(startedAt)) return selectedPractice.timeSpentSeconds;
    return selectedPractice.timeSpentSeconds + Math.max(0, Math.floor((Date.now() - startedAt) / 1000));
  }, [selectedPractice.endedAt, selectedPractice.startedAt, selectedPractice.timeSpentSeconds, timeSpentTick]);

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
  const findMatchingSlokas = useCallback(
    (queryValue: string): SlokaSummary[] => {
      const query = queryValue.trim().toLowerCase();
      if (!query) return [];
      return slokaList
        .map((sloka) => {
          const title = sloka.title.toLowerCase();
          const titleTamil = sloka.titleTamil.toLowerCase();
          const category = sloka.category.toLowerCase();
          if (title === query || titleTamil === query) return { sloka, rank: 0 };
          if (title.startsWith(query) || titleTamil.startsWith(query)) return { sloka, rank: 1 };
          if (title.includes(query) || titleTamil.includes(query)) return { sloka, rank: 2 };
          if (category.includes(query)) return { sloka, rank: 3 };
          return null;
        })
        .filter((entry): entry is { sloka: SlokaSummary; rank: number } => entry !== null)
        .sort((left, right) => left.rank - right.rank || left.sloka.title.localeCompare(right.sloka.title))
        .map((entry) => entry.sloka);
    },
    [slokaList],
  );

  const startPromptSuggestions = useMemo(() => findMatchingSlokas(startPromptQuery).slice(0, 8), [findMatchingSlokas, startPromptQuery]);

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

  const startSlokaPractice = useCallback(() => {
    const startedAt = new Date().toISOString();
    updateSelectedPractice((entry) => ({
      ...entry,
      startedAt,
      endedAt: "",
    }));
    setLiveMessage(`Started ${selectedSloka.title}.`);
  }, [selectedSloka.title, updateSelectedPractice]);

  const finishSlokaPractice = useCallback(() => {
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
        setPendingListSlokaId(nextSlokaId);
        setLiveMessage(`Finished ${selectedSloka.title}. Opening next sloka.`);
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
    setLiveMessage(`Marked ${selectedSloka.title} complete.`);
  }, [activeChantList, logChantCount, selectedSloka.id, selectedSloka.lines.length, selectedSloka.title, todayDateKey, updateSelectedPractice]);

  const resetSlokaPractice = useCallback(() => {
    updateSelectedPractice((entry) => ({
      ...entry,
      startedAt: "",
      endedAt: "",
      activeLineIndex: 0,
    }));
    setLiveMessage(`Reset ${selectedSloka.title} reading progress.`);
  }, [selectedSloka.title, updateSelectedPractice]);

  const setSelectedScheduleTime = useCallback(
    (scheduleTime: string) => {
      updateSelectedPractice((entry) => ({
        ...entry,
        scheduleTime,
      }));
    },
    [updateSelectedPractice],
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
    new Notification("Sloka Sabha Reminder", {
      body: `Time to chant ${selectedSloka.title}.`,
    });
    setLiveMessage("Test reminder sent.");
  }, [selectedSloka.title]);

  const fadeOutAmbientDrone = useCallback(async () => {}, []);

  const loadSlokaDetail = useCallback(
    async (slokaId: string, sourceRoute: Route = "library") => {
      try {
        const response = await fetch(`/api/slokas/${encodeURIComponent(slokaId)}`);
        if (!response.ok) throw new Error("Unable to load sloka.");
        const payload = (await response.json()) as { sloka?: Sloka };
        if (!payload.sloka) throw new Error("Sloka data missing.");
        await fadeOutAmbientDrone();
        setSelectedSloka(payload.sloka);
        setDetailBackRoute(sourceRoute);
        setRoute("detail");
      } catch {
        setLiveMessage("Unable to open sloka. Please try again.");
      }
    },
    [fadeOutAmbientDrone, setDetailBackRoute, setSelectedSloka, setRoute],
  );

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

  const continueFromStartPrompt = useCallback(async () => {
    const query = startPromptQuery.trim();
    setHomeDurationMax(startPromptDuration);

    if (query.length > 0) {
      const matches = findMatchingSlokas(query);
      if (matches.length > 0) {
        setHomeSearch(query);
        setGuidedStart(false);
        setShowStartPrompt(false);
        await loadSlokaDetail(matches[0].id, "home");
        return;
      }
    }

    setHomeSearch(query);
    setGuidedStart(true);
    setShowStartPrompt(false);
    setRoute("home");
  }, [findMatchingSlokas, loadSlokaDetail, startPromptDuration, startPromptQuery]);

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

    setFavorites(new Set(persistedFavorites));
    setChantProgress(normalizeProgressForToday(persistedProgress, todayDateKey));
    setSlokaPractice(normalizePracticeState(persistedPractice));
    setChantLists(normalizeChantLists(persistedChantLists));
    setReminders(normalizeReminderSettings(persistedReminders));
    setReaderFontScale(
      Math.min(0.9, Math.max(0.5, Number.isFinite(persistedReaderPrefs.fontScale) ? persistedReaderPrefs.fontScale : 0.68)),
    );
    setReaderLanguage(
      persistedReaderPrefs.language === "tamil" || persistedReaderPrefs.language === "english"
        ? persistedReaderPrefs.language
        : "both",
    );
    setShowMeaning(typeof persistedReaderPrefs.showMeaning === "boolean" ? persistedReaderPrefs.showMeaning : true);
    setTodayDay(WEEK_DAYS[new Date().getDay()]);
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
        new Notification("Sloka Sabha Reminder", {
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
    if (!pendingListSlokaId) return;
    const nextSlokaId = pendingListSlokaId;
    setPendingListSlokaId("");
    void loadSlokaDetail(nextSlokaId, "sessions");
  }, [loadSlokaDetail, pendingListSlokaId]);

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
        const notification = new Notification("Sloka Sabha Chant List", {
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

  useEffect(() => {
    setIsSideMenuOpen(false);
  }, [route]);

  useEffect(() => {
    if (route !== "detail" || !selectedPractice.startedAt || selectedPractice.endedAt) return;
    const timer = window.setInterval(() => {
      setTimeSpentTick((value) => value + 1);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [route, selectedPractice.endedAt, selectedPractice.startedAt]);

  const readerScaleStyle = useMemo(
    () =>
      ({
        "--reader-font-scale": readerFontScale,
      }) as CSSProperties,
    [readerFontScale],
  );

  return (
    <div className={`app-shell ${route === "landing" ? "landing-mode" : ""}`}>
      {route !== "landing" && route !== "detail" && (
        <header className="app-header">
          <div className="brand">
            <span className="brand-mark">S</span>
            <div>
              <strong>Sloka Sabha</strong>
              <span>Search, read, and save favorites</span>
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
              <p>{chantCelebrationMessage || "You completed your chant list."}</p>
              <small>Taking you back home...</small>
            </article>
          </div>
        )}

        {route === "landing" && (
          <section className="landing-screen active">
            <video autoPlay className="landing-video" loop muted playsInline preload="metadata">
              <source src="/media/sloka-hero.mp4" type="video/mp4" />
            </video>
            <div className="landing-overlay" />
            <div className="landing-colorwash" />
            <div className="landing-stars" />
            <div className="landing-content">
              {!showStartPrompt && (
                <article className="landing-greeting-preview">
                  <h2>Namaste ॐ</h2>
                  <p>Begin your day with divine chants.</p>
                  <button
                    className="landing-ghost-button"
                    onClick={() => {
                      setShowStartPrompt(true);
                    }}
                    type="button"
                  >
                    Enter Slokas
                  </button>
                </article>
              )}
            </div>
            {showStartPrompt && (
              <div
                className="start-modal-backdrop"
                onClick={() => setShowStartPrompt(false)}
                onKeyDown={(event) => {
                  if (event.key === "Escape") setShowStartPrompt(false);
                }}
                role="button"
                tabIndex={0}
              >
                <form
                  className="start-modal"
                  onClick={(event) => event.stopPropagation()}
                  onSubmit={(event) => {
                    event.preventDefault();
                    void continueFromStartPrompt();
                  }}
                >
                  <h3>What slokas are you looking for?</h3>
                  <p>Search by name, deity, or language and pick a duration.</p>
                  <label className="field-label light" htmlFor="start-prompt-query">
                    Sloka Search
                  </label>
                  <input
                    autoComplete="off"
                    className="start-modal-input"
                    id="start-prompt-query"
                    onChange={(event) => setStartPromptQuery(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Tab" && startPromptSuggestions[0]) {
                        event.preventDefault();
                        setStartPromptQuery(startPromptSuggestions[0].title);
                      }
                    }}
                    placeholder="Hanuman Chalisa, Shiva, Durga..."
                    ref={startSearchInputRef}
                    value={startPromptQuery}
                  />
                  {startPromptSuggestions.length > 0 && (
                    <div className="search-suggestions" role="listbox">
                      {startPromptSuggestions.map((suggestion) => (
                        <button
                          className="search-suggestion"
                          key={`start-suggestion-${suggestion.id}`}
                          onClick={() => {
                            setStartPromptQuery(suggestion.title);
                            startSearchInputRef.current?.focus();
                          }}
                          type="button"
                        >
                          {suggestion.title}
                        </button>
                      ))}
                    </div>
                  )}
                  <label className="field-label light">Duration</label>
                  <div className="start-chip-row">
                    <button
                      className={`start-chip ${startPromptDuration === 5 ? "active" : ""}`}
                      onClick={() => setStartPromptDuration(5)}
                      type="button"
                    >
                      5 min
                    </button>
                    <button
                      className={`start-chip ${startPromptDuration === 10 ? "active" : ""}`}
                      onClick={() => setStartPromptDuration(10)}
                      type="button"
                    >
                      10 min
                    </button>
                    <button
                      className={`start-chip ${startPromptDuration === 15 ? "active" : ""}`}
                      onClick={() => setStartPromptDuration(15)}
                      type="button"
                    >
                      15 min
                    </button>
                    <button
                      className={`start-chip ${startPromptDuration === null ? "active" : ""}`}
                      onClick={() => setStartPromptDuration(null)}
                      type="button"
                    >
                      Any
                    </button>
                  </div>
                  <div className="start-modal-actions start-modal-actions-three">
                    <button className="secondary-button" onClick={() => setShowStartPrompt(false)} type="button">
                      Cancel
                    </button>
                    <button
                      className="secondary-button"
                      onClick={() => {
                        setStartPromptQuery("");
                        setShowStartPrompt(false);
                        setGuidedStart(false);
                        setHomeSearch("");
                        setRoute("home");
                      }}
                      type="button"
                    >
                      Home
                    </button>
                    <button className="landing-start-button" type="submit">
                      Continue
                    </button>
                  </div>
                </form>
              </div>
            )}
          </section>
        )}

        {route === "home" && (
          <section className="screen active">
            <article className="event-card dashboard-top-search">
              <label className="field-label" htmlFor="dashboard-search">
                Search Sloka
              </label>
              <input
                autoComplete="off"
                className="search-input"
                id="dashboard-search"
                ref={homeSearchInputRef}
                onChange={(event) => setHomeSearch(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Tab" && homeSuggestions[0]) {
                    event.preventDefault();
                    setHomeSearch(homeSuggestions[0].value);
                  }
                }}
                placeholder="Search sloka name, deity, or Tamil text"
                value={homeSearch}
              />
              {homeSuggestions.length > 0 && (
                <div className="search-suggestions" role="listbox">
                  {homeSuggestions.map((suggestion) => (
                    <button
                      className="search-suggestion"
                      key={`dashboard-suggestion-${suggestion.value}`}
                      onClick={() => {
                        setHomeSearch(suggestion.value);
                        homeSearchInputRef.current?.focus();
                      }}
                      type="button"
                    >
                      {suggestion.value}
                    </button>
                  ))}
                </div>
              )}
            </article>

            <article className="event-card greeting-card">
              <h2>Namaste 🙏</h2>
              <p>Begin your day with divine chants.</p>
            </article>

            <article className="event-card journey-card">
              <div className="section-heading compact">
                <h2>Continue Your Journey</h2>
                <span className="badge">Today</span>
              </div>
              <p>{selectedSloka.titleTamil}</p>
              <div className="journey-progress-row">
                <div className="journey-linear">
                  <span style={{ width: `${dailyProgressPercent}%` }} />
                </div>
                <div
                  className="journey-ring"
                  aria-label={`Daily progress ${dailyProgressPercent}%`}
                  style={{ ["--progress" as string]: `${dailyProgressPercent}%` } as CSSProperties}
                >
                  <strong>{dailyProgressPercent}%</strong>
                </div>
              </div>
              <p className={`journey-status ${isDailyTargetCompleted ? "completed" : ""}`}>
                {isDailyTargetCompleted
                  ? `Completed today (${chantProgress.dailyCount}/${chantProgress.dailyTarget})`
                  : `${remainingDailyChants} chants remaining today (${chantProgress.dailyCount}/${chantProgress.dailyTarget})`}
              </p>
              <div className="journey-actions">
                <button className="secondary-button" onClick={() => logChantCount(selectedSloka.id, 1)} type="button">
                  +1 Chant Done
                </button>
                <button className="secondary-button" onClick={() => setRoute("sessions")} type="button">
                  Open Tracker
                </button>
              </div>
            </article>

            <article className="event-card">
              <div className="section-heading compact">
                <h2>Start Chanting</h2>
              </div>
              <div className="deity-quick-row" role="list" aria-label="Quick deity selection">
                {deityHighlights.slice(0, 8).map((deity) => (
                  <button
                    className="deity-quick-chip"
                    key={`quick-${deity.category}`}
                    onClick={() => {
                      setGodsCategory(deity.category);
                      setRoute("gods");
                    }}
                    type="button"
                  >
                    <Image
                      alt={`${deity.category} icon`}
                      className="deity-quick-image"
                      height={42}
                      sizes="42px"
                      src={DEITY_PHOTOS[deity.category] ?? DEITY_PHOTOS.Shiva}
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
                  {homeResults.map((sloka) => (
                    <article className="event-card" key={`home-result-${sloka.id}`}>
                      <button className="sloka-row" onClick={() => void loadSlokaDetail(sloka.id, "home")} type="button">
                        <SlokaTile sloka={sloka} />
                        <span>
                          <strong>{sloka.title}</strong>
                          <small>{sloka.titleTamil} | {sloka.category} | {sloka.lineCount} lines</small>
                        </span>
                        <span>{">"}</span>
                      </button>
                      <div className="meta-row">
                        <span className="mini-muted">{sloka.duration}</span>
                        <button
                          aria-label={favorites.has(sloka.id) ? `Remove ${sloka.title} from favorites` : `Add ${sloka.title} to favorites`}
                          className={`favorite-icon-button ${favorites.has(sloka.id) ? "active" : ""}`}
                          onClick={() => toggleFavorite(sloka.id)}
                          title={favorites.has(sloka.id) ? "Remove favorite" : "Add favorite"}
                          type="button"
                        >
                          <FavoriteGlyph active={favorites.has(sloka.id)} />
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
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
                      <article className="event-card" key={`popular-${sloka.id}`}>
                        <button className="sloka-row" onClick={() => void loadSlokaDetail(sloka.id, "home")} type="button">
                          <SlokaTile sloka={sloka} />
                          <span>
                            <strong>{sloka.title}</strong>
                            <small>{sloka.titleTamil} | {sloka.category} | {sloka.lineCount} lines</small>
                          </span>
                          <span>{">"}</span>
                        </button>
                        <div className="meta-row">
                          <span className="mini-muted">{sloka.duration}</span>
                          <button
                            aria-label={favorites.has(sloka.id) ? `Remove ${sloka.title} from favorites` : `Add ${sloka.title} to favorites`}
                            className={`favorite-icon-button ${favorites.has(sloka.id) ? "active" : ""}`}
                            onClick={() => toggleFavorite(sloka.id)}
                            title={favorites.has(sloka.id) ? "Remove favorite" : "Add favorite"}
                            type="button"
                          >
                            <FavoriteGlyph active={favorites.has(sloka.id)} />
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </>
            )}
          </section>
        )}

        {route === "gods" && (
          <section className="screen active">
            <div className="screen-top">
              <button className="icon-button" onClick={() => setRoute("home")} type="button" title="Back">
                {"<"}
              </button>
              <div>
                <h1>Browse by Gods</h1>
                <p>Pick a deity and open related slokas quickly.</p>
              </div>
            </div>

            <article className="event-card">
              <h3>Deity Collection</h3>
              <div className="deity-grid">
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
                        className="deity-icon-photo"
                        height={72}
                        priority={index < 2}
                        sizes="72px"
                        src={DEITY_PHOTOS[deity.category] ?? DEITY_PHOTOS.Shiva}
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
              <div className="chip-row">
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
            </article>

            <div className="section-heading">
              <h2>{godsCategory === "all" ? "All Deity Slokas" : `${godsCategory} Slokas`}</h2>
            </div>
            <div className="sloka-list">
              {godsFilteredSlokas.map((sloka) => (
                <article className="event-card" key={`gods-${sloka.id}`}>
                  <button className="sloka-row" onClick={() => void loadSlokaDetail(sloka.id, "gods")} type="button">
                    <SlokaTile sloka={sloka} />
                    <span>
                      <strong>{sloka.title}</strong>
                      <small>{sloka.titleTamil} | {sloka.category} | {sloka.duration}</small>
                    </span>
                    <span>{">"}</span>
                  </button>
                  <div className="meta-row">
                    <span className="mini-muted">{sloka.lineCount} lines</span>
                    <button
                      aria-label={favorites.has(sloka.id) ? `Remove ${sloka.title} from favorites` : `Add ${sloka.title} to favorites`}
                      className={`favorite-icon-button ${favorites.has(sloka.id) ? "active" : ""}`}
                      onClick={() => toggleFavorite(sloka.id)}
                      title={favorites.has(sloka.id) ? "Remove favorite" : "Add favorite"}
                      type="button"
                    >
                      <FavoriteGlyph active={favorites.has(sloka.id)} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
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
                  className="session-preview-image"
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

            <div className="sloka-list">
              {filteredSlokas.map((sloka) => (
                <article className="event-card" key={`library-${sloka.id}`}>
                  <button className="sloka-row" onClick={() => void loadSlokaDetail(sloka.id, "library")} type="button">
                    <SlokaTile sloka={sloka} />
                    <span>
                      <strong>{sloka.title}</strong>
                      <small>{sloka.titleTamil} | {sloka.category} | {sloka.duration}</small>
                    </span>
                    <span>{">"}</span>
                  </button>
                  <div className="meta-row">
                    <span className="mini-muted">{sloka.lineCount} lines</span>
                    <button
                      aria-label={favorites.has(sloka.id) ? `Remove ${sloka.title} from favorites` : `Add ${sloka.title} to favorites`}
                      className={`favorite-icon-button ${favorites.has(sloka.id) ? "active" : ""}`}
                      onClick={() => toggleFavorite(sloka.id)}
                      title={favorites.has(sloka.id) ? "Remove favorite" : "Add favorite"}
                      type="button"
                    >
                      <FavoriteGlyph active={favorites.has(sloka.id)} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
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
                <article className="event-card" key={`favorite-${sloka.id}`}>
                  <button className="sloka-row" onClick={() => void loadSlokaDetail(sloka.id, "favorites")} type="button">
                    <SlokaTile sloka={sloka} />
                    <span>
                      <strong>{sloka.title}</strong>
                      <small>{sloka.titleTamil} | {sloka.category}</small>
                    </span>
                    <span>{">"}</span>
                  </button>
                  <div className="meta-row">
                    <span className="mini-muted">{sloka.duration}</span>
                    <button
                      aria-label={`Remove ${sloka.title} from favorites`}
                      className="favorite-icon-button active"
                      onClick={() => toggleFavorite(sloka.id)}
                      title="Remove favorite"
                      type="button"
                    >
                      <FavoriteGlyph active />
                    </button>
                  </div>
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
                  <span className="ref-player-header-spacer" aria-hidden="true" />
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

              <article className="sloka-action-card">
                <div
                  className={`sloka-target-ring ${selectedSlokaDoneToday ? "done" : ""}`}
                  aria-label={`Sloka progress ${selectedLinePercent}%`}
                  style={{ ["--progress" as string]: `${selectedLinePercent}%` } as CSSProperties}
                >
                  <strong>{selectedSlokaDoneToday ? "Done" : `${selectedLinePercent}%`}</strong>
                  <span>{selectedPractice.activeLineIndex + 1}/{selectedSloka.lines.length}</span>
                </div>
                <div className="sloka-action-copy">
                  <h3>{selectedSlokaDoneToday ? "Finished today" : "Chant this sloka"}</h3>
                  <p>
                    {selectedPractice.startedAt && !selectedPractice.endedAt
                      ? `Started ${new Date(selectedPractice.startedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
                      : selectedPractice.endedAt
                        ? `Ended ${new Date(selectedPractice.endedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
                        : "Start when you begin reading, then finish when the sloka is complete."}
                  </p>
                  <span>Time spent: {formatElapsedTime(selectedSessionSeconds)}</span>
                </div>
                <label className="sloka-schedule-field" htmlFor="sloka-schedule-time">
                  Schedule
                  <input
                    id="sloka-schedule-time"
                    onChange={(event) => setSelectedScheduleTime(event.target.value)}
                    type="time"
                    value={selectedPractice.scheduleTime}
                  />
                </label>
                <div className="sloka-action-buttons">
                  <button className="secondary-button" onClick={startSlokaPractice} type="button">
                    Start
                  </button>
                  <button className="primary-button" onClick={finishSlokaPractice} type="button">
                    Finish
                  </button>
                  <button className="secondary-button" onClick={resetSlokaPractice} type="button">
                    Reset
                  </button>
                </div>
                {chantLists.length > 0 && (
                  <div className="sloka-add-to-list">
                    <select
                      aria-label="Choose chant list"
                      onChange={(event) => setDetailChantListId(event.target.value)}
                      value={detailChantListTargetId}
                    >
                      {chantLists.map((list) => (
                        <option key={`detail-list-option-${list.id}`} value={list.id}>
                          {list.name}
                        </option>
                      ))}
                    </select>
                    <button
                      className="secondary-button"
                      onClick={() => addSlokaToChantList(detailChantListTargetId, selectedSloka.id)}
                      type="button"
                    >
                      Add to List
                    </button>
                  </div>
                )}
              </article>

              <ReaderControls
                language={readerLanguage}
                onDecreaseFont={decreaseReaderFontScale}
                onIncreaseFont={increaseReaderFontScale}
                onSetLanguage={setReaderLanguage}
                onToggleMeaning={() => setShowMeaning((value) => !value)}
                showMeaning={showMeaning}
              />
            </article>

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
        <nav className="floating-dock" aria-label="Bottom Navigation">
          <button className={route === "home" ? "active" : ""} onClick={() => setRoute("home")} type="button" title="Home">
            ⌂
          </button>
          <button className={route === "favorites" ? "active" : ""} onClick={() => setRoute("favorites")} type="button" title="Favorites">
            ♡
          </button>
          <button className={isSideMenuOpen ? "active" : ""} onClick={() => setIsSideMenuOpen((value) => !value)} type="button" title="Menu">
            ☰
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

    </div>
  );
}
