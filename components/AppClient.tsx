"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import type { Sloka, SlokaSummary } from "@/lib/domain/types";

type Route = "landing" | "home" | "gods" | "practice" | "library" | "detail" | "favorites" | "phase2";
type AppClientProps = {
  initialSlokaList: SlokaSummary[];
  initialSloka: Sloka;
};
type SlokaLineItem = Sloka["lines"][number];
type QuickActionIcon = "favorite" | "favorites" | "pronunciation" | "word" | "chant1" | "chant11";
type SearchSuggestion = {
  value: string;
  rank: number;
};

const WORD_PUNCTUATION_PATTERN = /[.,;:!?()[\]{}"']/g;
const INDIAN_LANG_PREFIXES = ["en-in", "hi-in", "ta-in", "te-in", "kn-in", "ml-in", "mr-in", "bn-in", "gu-in", "pa-in"];
const TAMIL_SCRIPT_PATTERN = /[\u0b80-\u0bff]/;
const CHANT_REPLACEMENTS: Array<[RegExp, string]> = [
  [/\bshri\b/gi, "shree"],
  [/\bsri\b/gi, "shree"],
  [/\bhanuman\b/gi, "hanu maan"],
  [/\bchalisa\b/gi, "cha lee saa"],
  [/\bram\b/gi, "raam"],
  [/\brama\b/gi, "raa maa"],
  [/\blakhan\b/gi, "luk hun"],
  [/\bsita\b/gi, "see taa"],
  [/\banjani\b/gi, "un ju nee"],
  [/\bpavan\b/gi, "puh vun"],
  [/\bjai\b/gi, "jeye"],
  [/\bsankat\b/gi, "sun kut"],
  [/\bguru\b/gi, "goo roo"],
  [/\bnamah\b/gi, "nu muh"],
];
const STORAGE_KEYS = {
  favorites: "sloka_sabha_favorites_v2",
  voiceUri: "sloka_sabha_voice_uri_v2",
  chantProgress: "sloka_sabha_chant_progress_v1",
  reminders: "sloka_sabha_reminders_v1",
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
  Shiva: "/deities/shiva.jpg",
  Hanuman: "/deities/hanuman.jpg",
  Durga: "/deities/durga.jpg",
  Vishnu: "/deities/vishnu.jpg",
  Guru: "/deities/guru.jpg",
};
const LANDING_OM_AUDIO_SRC = "/media/om-chant.mp3";
const LANDING_OM_AUDIO_VOLUME = 0.1;
const LANDING_OM_FADE_OUT_MS = 650;
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

function getPronunciationWords(pronunciation: string): string[] {
  return pronunciation
    .split(/\s+/)
    .map((word) => word.replace(/-/g, "").replace(WORD_PUNCTUATION_PATTERN, "").trim())
    .filter((word) => word.length > 0);
}

function normalizeSpeechText(text: string, locale: string): string {
  let normalized = text.replace(/-/g, "").replace(/\s*;\s*/g, ", ").replace(/\s+/g, " ").trim();
  if (locale.startsWith("en")) {
    for (const [pattern, replacement] of CHANT_REPLACEMENTS) {
      normalized = normalized.replace(pattern, replacement);
    }
  }
  return normalized;
}

function buildSpeechChunks(text: string): string[] {
  const chunks = text
    .replace(/\s*[,;:]\s*/g, ". ")
    .split(".")
    .map((chunk) => chunk.trim())
    .filter((chunk) => chunk.length > 0);
  return chunks.length > 0 ? chunks : [text];
}

function isLikelyIndianVoice(voice: SpeechSynthesisVoice): boolean {
  const lang = voice.lang.toLowerCase();
  const name = voice.name.toLowerCase();
  return INDIAN_LANG_PREFIXES.some((prefix) => lang.startsWith(prefix)) || name.includes("india");
}

function scoreVoice(voice: SpeechSynthesisVoice): number {
  const lang = voice.lang.toLowerCase();
  const name = voice.name.toLowerCase();
  let score = 0;

  if (lang.startsWith("en-in")) score += 120;
  else if (INDIAN_LANG_PREFIXES.some((prefix) => lang.startsWith(prefix))) score += 100;

  if (name.includes("india") || name.includes("hindi") || name.includes("tamil")) score += 24;
  if (voice.localService) score += 6;
  if (voice.default) score += 3;

  return score;
}

function QuickActionGlyph({ icon }: { icon: QuickActionIcon }) {
  if (icon === "favorite") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M12 20.6 4.9 14.2A5.7 5.7 0 0 1 3 9.9C3 6.9 5.2 4.6 8.1 4.6c1.5 0 2.9.7 3.9 1.9 1-1.2 2.4-1.9 3.9-1.9 2.9 0 5.1 2.3 5.1 5.3 0 1.6-.7 3.1-1.9 4.3L12 20.6Z" />
      </svg>
    );
  }

  if (icon === "favorites") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1Z" />
      </svg>
    );
  }

  if (icon === "pronunciation") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M3 14h4l5 4V6L7 10H3v4Z" />
        <path d="M16 9a4 4 0 0 1 0 6" />
        <path d="M18.5 6.5a7.5 7.5 0 0 1 0 11" />
      </svg>
    );
  }

  if (icon === "word") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <rect x="3" y="5" width="8" height="5" rx="1.2" />
        <rect x="13" y="5" width="8" height="5" rx="1.2" />
        <rect x="3" y="13" width="5" height="5" rx="1.2" />
        <rect x="10" y="13" width="11" height="5" rx="1.2" />
      </svg>
    );
  }

  if (icon === "chant1") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M4 7h10M4 12h10M4 17h10" />
        <path d="M17 11v6M14 14h6" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M4 7h8M4 12h8M4 17h8" />
      <path d="M16 8v8M19 8v8" />
      <path d="M14 12h7" />
    </svg>
  );
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
  const [detailBackRoute, setDetailBackRoute] = useState<Route>("home");
  const [slokaList] = useState<SlokaSummary[]>(initialSlokaList);
  const [selectedSloka, setSelectedSloka] = useState<Sloka>(initialSloka);
  const [homeSearch, setHomeSearch] = useState<string>("");
  const [homeDurationMax, setHomeDurationMax] = useState<number | null>(10);
  const [guidedStart, setGuidedStart] = useState<boolean>(false);
  const [showStartPrompt, setShowStartPrompt] = useState<boolean>(false);
  const [startPromptQuery, setStartPromptQuery] = useState<string>("");
  const [startPromptDuration, setStartPromptDuration] = useState<number | null>(10);
  const [librarySearch, setLibrarySearch] = useState<string>("");
  const [favoritesSearch, setFavoritesSearch] = useState<string>("");
  const [libraryCategory, setLibraryCategory] = useState<string>("all");
  const [godsCategory, setGodsCategory] = useState<string>("all");
  const [showPronunciation, setShowPronunciation] = useState<boolean>(true);
  const [wordByWordMode, setWordByWordMode] = useState<boolean>(true);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [liveMessage, setLiveMessage] = useState<string>("");
  const [isHydrated, setIsHydrated] = useState<boolean>(false);
  const [voiceOptions, setVoiceOptions] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceUri, setSelectedVoiceUri] = useState<string>("");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [chantProgress, setChantProgress] = useState<ChantProgress>(DEFAULT_CHANT_PROGRESS);
  const [reminders, setReminders] = useState<ReminderSettings>(DEFAULT_REMINDERS);
  const [todayDay, setTodayDay] = useState<string>("");
  const [ambientEnabled, setAmbientEnabled] = useState<boolean>(true);
  const homeSearchInputRef = useRef<HTMLInputElement | null>(null);
  const startSearchInputRef = useRef<HTMLInputElement | null>(null);
  const speechRunRef = useRef<number>(0);
  const landingAudioRef = useRef<HTMLAudioElement | null>(null);

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
  const startPromptSuggestions = useMemo(
    () => buildSearchSuggestions(startPromptQuery),
    [buildSearchSuggestions, startPromptQuery],
  );

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

  const selectedVoice = useMemo(() => {
    return voiceOptions.find((voice) => voice.voiceURI === selectedVoiceUri) ?? voiceOptions[0] ?? null;
  }, [selectedVoiceUri, voiceOptions]);

  const selectedRecommendation = useMemo(() => {
    return SLOKA_RECOMMENDATIONS[selectedSloka.id] ?? null;
  }, [selectedSloka.id]);

  const getLinePronunciationText = useCallback((line: SlokaLineItem): string => {
    const explicitPronunciation = line.pronunciation?.trim() ?? "";
    if (explicitPronunciation.length > 0) return explicitPronunciation;
    const transliteration = line.english?.trim() ?? "";
    if (transliteration.length > 0) return transliteration;
    return line.tamil.trim();
  }, []);

  const hasPronunciationData = useMemo(() => {
    return selectedSloka.lines.some((line) => getLinePronunciationText(line).length > 0);
  }, [getLinePronunciationText, selectedSloka]);

  const todayRecommendedSlokas = useMemo(() => {
    if (!todayDay) return [];
    return slokaList.filter((sloka) => (SLOKA_RECOMMENDATIONS[sloka.id]?.days ?? []).includes(todayDay));
  }, [slokaList, todayDay]);

  const todaySuggestions = useMemo(() => {
    if (homeDurationMax === null) return todayRecommendedSlokas;
    return todayRecommendedSlokas.filter((sloka) => parseDurationMinutes(sloka.duration) <= homeDurationMax);
  }, [homeDurationMax, todayRecommendedSlokas]);

  const durationSuggestedSlokas = useMemo(() => {
    const sorted = [...slokaList].sort(
      (left, right) => parseDurationMinutes(left.duration) - parseDurationMinutes(right.duration),
    );
    if (homeDurationMax === null) return sorted.slice(0, 6);
    return sorted.filter((sloka) => parseDurationMinutes(sloka.duration) <= homeDurationMax).slice(0, 6);
  }, [homeDurationMax, slokaList]);

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

  const fadeOutAmbientDrone = useCallback(async (durationMs: number = LANDING_OM_FADE_OUT_MS) => {
    if (typeof window === "undefined") return;
    const audio = landingAudioRef.current;
    if (!audio || audio.paused) return;

    const startVolume = audio.volume;
    const steps = Math.max(1, Math.floor(durationMs / 40));
    const stepVolume = startVolume / steps;

    await new Promise<void>((resolve) => {
      let currentStep = 0;
      const timer = window.setInterval(() => {
        currentStep += 1;
        audio.volume = Math.max(0, startVolume - stepVolume * currentStep);
        if (currentStep >= steps) {
          window.clearInterval(timer);
          audio.pause();
          try {
            audio.currentTime = 0;
          } catch {
            // no-op
          }
          audio.volume = LANDING_OM_AUDIO_VOLUME;
          resolve();
        }
      }, 40);
    });
  }, []);

  const loadSlokaDetail = useCallback(
    async (slokaId: string, sourceRoute: Route = "library") => {
      try {
        const response = await fetch(`/api/slokas/${encodeURIComponent(slokaId)}`);
        if (!response.ok) throw new Error("Unable to load sloka.");
        const payload = (await response.json()) as { sloka?: Sloka };
        if (!payload.sloka) throw new Error("Sloka data missing.");
        await fadeOutAmbientDrone();
        setAmbientEnabled(false);
        setSelectedSloka(payload.sloka);
        setDetailBackRoute(sourceRoute);
        setRoute("detail");
      } catch {
        setLiveMessage("Unable to open sloka. Please try again.");
      }
    },
    [fadeOutAmbientDrone, setDetailBackRoute, setSelectedSloka, setRoute],
  );

  const stopSpeech = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    speechRunRef.current += 1;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  const speakText = useCallback(
    (text: string, options?: { rate?: number; pitch?: number }) => {
      const speechText = text.trim();
      if (!speechText) return false;
      if (
        typeof window === "undefined" ||
        !("speechSynthesis" in window) ||
        typeof window.SpeechSynthesisUtterance === "undefined"
      ) {
        setLiveMessage("Audio is not supported in this browser.");
        return false;
      }

      const speechApi = window.speechSynthesis;
      const runId = speechRunRef.current + 1;
      speechRunRef.current = runId;
      speechApi.cancel();
      const chunks = buildSpeechChunks(speechText);
      const voices = speechApi.getVoices();
      const sortedVoices = [...voices].sort((left, right) => scoreVoice(right) - scoreVoice(left));
      const preferredVoice =
        (selectedVoiceUri ? voices.find((voice) => voice.voiceURI === selectedVoiceUri) : null) ?? sortedVoices[0] ?? null;

      chunks.forEach((chunk, index) => {
        const utterance = new SpeechSynthesisUtterance(chunk);
        utterance.rate = options?.rate ?? 0.86;
        utterance.pitch = options?.pitch ?? 1;
        if (preferredVoice) {
          utterance.voice = preferredVoice;
          utterance.lang = preferredVoice.lang;
        } else {
          utterance.lang = "en-IN";
        }
        if (index === 0) {
          utterance.onstart = () => {
            if (runId === speechRunRef.current) setIsSpeaking(true);
          };
        }
        utterance.onend = () => {
          if (index === chunks.length - 1 && runId === speechRunRef.current) setIsSpeaking(false);
        };
        utterance.onerror = () => {
          if (runId === speechRunRef.current) {
            setIsSpeaking(false);
            setLiveMessage("Audio playback failed. Please try again.");
          }
        };
        speechApi.speak(utterance);
      });

      return true;
    },
    [selectedVoiceUri],
  );

  const getLineSpeechText = useCallback(
    (line: SlokaLineItem): string => {
      const selectedLocale = selectedVoice?.lang.toLowerCase() ?? "en-in";
      if (selectedLocale.startsWith("ta") && TAMIL_SCRIPT_PATTERN.test(line.tamil)) {
        return normalizeSpeechText(line.tamil, selectedLocale);
      }
      return normalizeSpeechText(getLinePronunciationText(line), selectedLocale);
    },
    [getLinePronunciationText, selectedVoice],
  );

  const playLineAudio = useCallback(
    (line: SlokaLineItem) => {
      const speechText = getLineSpeechText(line);
      if (speakText(speechText, { rate: 0.88 })) {
        setLiveMessage("Playing line audio.");
      }
    },
    [getLineSpeechText, speakText],
  );

  const playWordAudio = useCallback(
    (word: string) => {
      const selectedLocale = selectedVoice?.lang.toLowerCase() ?? "en-in";
      const text = normalizeSpeechText(word, selectedLocale);
      if (speakText(text, { rate: 0.78, pitch: 1.02 })) {
        setLiveMessage(`Word: ${word}`);
      }
    },
    [selectedVoice, speakText],
  );

  const continueFromStartPrompt = useCallback(() => {
    setHomeSearch(startPromptQuery.trim());
    setHomeDurationMax(startPromptDuration);
    setGuidedStart(true);
    setShowStartPrompt(false);
    setRoute("home");
  }, [startPromptDuration, startPromptQuery]);

  const stopAmbientDrone = useCallback(() => {
    if (typeof window === "undefined") return;
    const audio = landingAudioRef.current;
    if (!audio) return;
    audio.pause();
    try {
      audio.currentTime = 0;
    } catch {
      // no-op
    }
  }, []);

  const startAmbientDrone = useCallback(async (): Promise<boolean> => {
    if (typeof window === "undefined") return false;
    if (!landingAudioRef.current) {
      const audio = new Audio(LANDING_OM_AUDIO_SRC);
      audio.loop = true;
      audio.preload = "auto";
      audio.volume = LANDING_OM_AUDIO_VOLUME;
      (audio as HTMLAudioElement & { playsInline?: boolean }).playsInline = true;
      landingAudioRef.current = audio;
    }

    if (!landingAudioRef.current.paused) return true;

    try {
      await landingAudioRef.current.play();
      return true;
    } catch {
      return false;
    }
  }, []);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (typeof window === "undefined") return;
    const todayDateKey = getDateKey(new Date());
    const persistedFavorites = safeParse<string[]>(window.localStorage.getItem(STORAGE_KEYS.favorites), []);
    const persistedVoiceUri = window.localStorage.getItem(STORAGE_KEYS.voiceUri) ?? "";
    const persistedProgress = safeParse<ChantProgress>(
      window.localStorage.getItem(STORAGE_KEYS.chantProgress),
      DEFAULT_CHANT_PROGRESS,
    );
    const persistedReminders = safeParse<ReminderSettings>(
      window.localStorage.getItem(STORAGE_KEYS.reminders),
      DEFAULT_REMINDERS,
    );

    setFavorites(new Set(persistedFavorites));
    setSelectedVoiceUri(persistedVoiceUri);
    setChantProgress(normalizeProgressForToday(persistedProgress, todayDateKey));
    setReminders(normalizeReminderSettings(persistedReminders));
    setTodayDay(WEEK_DAYS[new Date().getDay()]);
    setIsHydrated(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (!isHydrated || typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(Array.from(favorites)));
  }, [favorites, isHydrated]);

  useEffect(() => {
    if (!isHydrated || typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEYS.voiceUri, selectedVoiceUri);
  }, [isHydrated, selectedVoiceUri]);

  useEffect(() => {
    if (!isHydrated || typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEYS.chantProgress, JSON.stringify(chantProgress));
  }, [chantProgress, isHydrated]);

  useEffect(() => {
    if (!isHydrated || typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEYS.reminders, JSON.stringify(reminders));
  }, [isHydrated, reminders]);

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
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const speechApi = window.speechSynthesis;
    const loadVoices = () => {
      const voices = speechApi.getVoices();
      if (voices.length === 0) return;
      const sortedVoices = [...voices].sort((left, right) => scoreVoice(right) - scoreVoice(left));
      setVoiceOptions(sortedVoices);
      setSelectedVoiceUri((previous) => previous || sortedVoices[0]?.voiceURI || "");
    };

    loadVoices();
    speechApi.addEventListener?.("voiceschanged", loadVoices);
    speechApi.onvoiceschanged = loadVoices;

    return () => {
      speechApi.removeEventListener?.("voiceschanged", loadVoices);
      if (speechApi.onvoiceschanged === loadVoices) speechApi.onvoiceschanged = null;
    };
  }, []);

  useEffect(() => {
    return () => stopSpeech();
  }, [stopSpeech]);

  useEffect(() => {
    if (route !== "home") return;
    const timer = window.setTimeout(() => {
      homeSearchInputRef.current?.focus();
    }, 120);
    return () => window.clearTimeout(timer);
  }, [route]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const audio =
      landingAudioRef.current ??
      (() => {
        const nextAudio = new Audio(LANDING_OM_AUDIO_SRC);
        nextAudio.loop = true;
        nextAudio.preload = "auto";
        nextAudio.volume = LANDING_OM_AUDIO_VOLUME;
        landingAudioRef.current = nextAudio;
        return nextAudio;
      })();

    if (audio.readyState === 0) {
      audio.load();
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (route === "detail" || !ambientEnabled) {
      stopAmbientDrone();
      return;
    }

    void startAmbientDrone();
    const unlockAudio = () => {
      void startAmbientDrone();
    };

    window.addEventListener("pointerdown", unlockAudio);
    window.addEventListener("click", unlockAudio);
    window.addEventListener("touchstart", unlockAudio);
    window.addEventListener("keydown", unlockAudio);
    return () => {
      window.removeEventListener("pointerdown", unlockAudio);
      window.removeEventListener("click", unlockAudio);
      window.removeEventListener("touchstart", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
    };
  }, [ambientEnabled, route, startAmbientDrone, stopAmbientDrone]);

  useEffect(() => {
    return () => {
      stopAmbientDrone();
    };
  }, [stopAmbientDrone]);

  return (
    <div className={`app-shell ${route === "landing" ? "landing-mode" : ""}`}>
      {route !== "landing" && (
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

        {route === "landing" && (
          <section
            className="landing-screen active"
            onClick={() => {
              if (ambientEnabled) void startAmbientDrone();
            }}
            onPointerDown={() => {
              if (ambientEnabled) void startAmbientDrone();
            }}
            onTouchStart={() => {
              if (ambientEnabled) void startAmbientDrone();
            }}
          >
            <video autoPlay className="landing-video" loop muted playsInline poster="/deities/shiva.jpg" preload="metadata">
              <source src="/media/sloka-hero.mp4" type="video/mp4" />
            </video>
            <div className="landing-overlay" />
            <div className="landing-colorwash" />
            <div className="landing-stars" />
            <button
              className={`landing-sound-toggle ${ambientEnabled ? "active" : ""}`}
              onClick={(event) => {
                event.stopPropagation();
                const audio = landingAudioRef.current;
                const isPlaying = Boolean(audio && !audio.paused);
                if (!ambientEnabled) {
                  setAmbientEnabled(true);
                  void startAmbientDrone();
                  return;
                }
                if (!isPlaying) {
                  void startAmbientDrone();
                  return;
                }
                setAmbientEnabled(false);
                stopAmbientDrone();
              }}
              onPointerDown={(event) => event.stopPropagation()}
              type="button"
            >
              {ambientEnabled ? "Om On" : "Om Off"}
            </button>
            <div className="landing-content">
              {!showStartPrompt && (
                <button
                  className="landing-ghost-button"
                  onClick={() => {
                    if (ambientEnabled) void startAmbientDrone();
                    setShowStartPrompt(true);
                  }}
                  type="button"
                >
                  Enter Slokas
                </button>
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
                    continueFromStartPrompt();
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
                        setStartPromptQuery(startPromptSuggestions[0].value);
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
                          key={`start-suggestion-${suggestion.value}`}
                          onClick={() => {
                            setStartPromptQuery(suggestion.value);
                            startSearchInputRef.current?.focus();
                          }}
                          type="button"
                        >
                          {suggestion.value}
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
                      {"<= 5m"}
                    </button>
                    <button
                      className={`start-chip ${startPromptDuration === 10 ? "active" : ""}`}
                      onClick={() => setStartPromptDuration(10)}
                      type="button"
                    >
                      {"<= 10m"}
                    </button>
                    <button
                      className={`start-chip ${startPromptDuration === 15 ? "active" : ""}`}
                      onClick={() => setStartPromptDuration(15)}
                      type="button"
                    >
                      {"<= 15m"}
                    </button>
                    <button
                      className={`start-chip ${startPromptDuration === null ? "active" : ""}`}
                      onClick={() => setStartPromptDuration(null)}
                      type="button"
                    >
                      Any
                    </button>
                  </div>
                  <div className="start-modal-actions">
                    <button className="secondary-button" onClick={() => setShowStartPrompt(false)} type="button">
                      Cancel
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
            <article className="event-card">
              <h2>What sloka are you looking for?</h2>
              <p>Search by sloka name, deity, or language. Then refine with duration.</p>
              <label className="field-label" htmlFor="home-search">
                Search Sloka
              </label>
              <input
                autoComplete="off"
                className="search-input"
                id="home-search"
                ref={homeSearchInputRef}
                onChange={(event) => setHomeSearch(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Tab" && homeSuggestions[0]) {
                    event.preventDefault();
                    setHomeSearch(homeSuggestions[0].value);
                  }
                }}
                placeholder="Type sloka name, category, or Tamil text"
                value={homeSearch}
              />
              {homeSuggestions.length > 0 && (
                <div className="search-suggestions" role="listbox">
                  {homeSuggestions.map((suggestion) => (
                    <button
                      className="search-suggestion"
                      key={`home-suggestion-${suggestion.value}`}
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
              <label className="field-label">Duration</label>
              <div className="chip-row compact">
                <button
                  className={`chip ${homeDurationMax === 5 ? "active" : ""}`}
                  onClick={() => setHomeDurationMax(5)}
                  type="button"
                >
                  Up to 5 min
                </button>
                <button
                  className={`chip ${homeDurationMax === 10 ? "active" : ""}`}
                  onClick={() => setHomeDurationMax(10)}
                  type="button"
                >
                  Up to 10 min
                </button>
                <button
                  className={`chip ${homeDurationMax === 15 ? "active" : ""}`}
                  onClick={() => setHomeDurationMax(15)}
                  type="button"
                >
                  Up to 15 min
                </button>
                <button
                  className={`chip ${homeDurationMax === null ? "active" : ""}`}
                  onClick={() => setHomeDurationMax(null)}
                  type="button"
                >
                  Any length
                </button>
              </div>
              {!guidedStart && (
                <>
                  <div className="action-row">
                    <button className="primary-button" onClick={() => setRoute("library")} type="button">
                      Open Library
                    </button>
                    <button className="secondary-button" onClick={() => setRoute("gods")} type="button">
                      Browse by Gods
                    </button>
                  </div>
                  <button className="secondary-button full" onClick={() => setRoute("favorites")} type="button">
                    View Favorites
                  </button>
                </>
              )}
              {guidedStart && (
                <button className="secondary-button full" onClick={() => setGuidedStart(false)} type="button">
                  Show Full Home
                </button>
              )}
            </article>

            {!guidedStart && (
              <>
                <article className="event-card section-stack">
                  <h3>Browse by Gods</h3>
                  <p>Open the dedicated Gods page and filter slokas deity-wise.</p>
                  <button className="primary-button full" onClick={() => setRoute("gods")} type="button">
                    Open Gods Page
                  </button>
                </article>
                <article className="event-card section-stack">
                  <h3>Daily Practice</h3>
                  <p>Progress, recommendations, and reminders are available in Practice.</p>
                  <button className="secondary-button full" onClick={() => setRoute("practice")} type="button">
                    Open Practice
                  </button>
                </article>
              </>
            )}

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
                  <h2>{todayDay ? `Today (${todayDay})` : "Today"}</h2>
                </div>
                {todaySuggestions.length === 0 ? (
                  <article className="event-card">
                    <h3>No day-specific sloka today</h3>
                    <p>Try changing duration filter or browse all slokas.</p>
                  </article>
                ) : (
                  <div className="sloka-list">
                    {todaySuggestions.map((sloka) => (
                      <article className="event-card" key={`today-${sloka.id}`}>
                        <button className="sloka-row" onClick={() => void loadSlokaDetail(sloka.id, "home")} type="button">
                          <SlokaTile sloka={sloka} />
                          <span>
                            <strong>{sloka.title}</strong>
                            <small>{sloka.titleTamil} | {sloka.category} | {sloka.duration}</small>
                          </span>
                          <span>{">"}</span>
                        </button>
                        <div className="meta-row">
                          <span className="mini-muted">{SLOKA_RECOMMENDATIONS[sloka.id]?.reason}</span>
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

                {!guidedStart && (
                  <>
                    <div className="section-heading">
                      <h2>Popular Slokas</h2>
                    </div>
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
                  </>
                )}

                <div className="section-heading">
                  <h2>{homeDurationMax === null ? "Quick Start by Duration" : `Quick Start (<= ${homeDurationMax} min)`}</h2>
                </div>
                {durationSuggestedSlokas.length === 0 ? (
                  <article className="event-card">
                    <h3>No slokas in this duration</h3>
                    <p>Select a longer duration to get suggestions.</p>
                  </article>
                ) : (
                  <div className="sloka-list">
                    {durationSuggestedSlokas.map((sloka) => (
                      <article className="event-card" key={`duration-${sloka.id}`}>
                        <button className="sloka-row" onClick={() => void loadSlokaDetail(sloka.id, "home")} type="button">
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
                )}
              </>
            )}

            {!guidedStart && (
              <>
                <div className="section-heading">
                  <h2>Your Favorites</h2>
                </div>
                {favoriteSlokas.length === 0 && (
                  <article className="event-card">
                    <h3>No favorites yet</h3>
                    <p>Tap Favorite on any sloka and it will appear here.</p>
                  </article>
                )}
                <div className="sloka-list">
                  {favoriteSlokas.slice(0, 4).map((sloka) => (
                    <article className="event-card" key={`home-fav-${sloka.id}`}>
                      <button className="sloka-row" onClick={() => void loadSlokaDetail(sloka.id, "home")} type="button">
                        <SlokaTile sloka={sloka} />
                        <span>
                          <strong>{sloka.title}</strong>
                          <small>{sloka.titleTamil} | {sloka.category}</small>
                        </span>
                        <span>{">"}</span>
                      </button>
                    </article>
                  ))}
                </div>
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

        {route === "practice" && (
          <section className="screen active">
            <div className="screen-top">
              <button className="icon-button" onClick={() => setRoute("home")} type="button" title="Back">
                {"<"}
              </button>
              <div>
                <h1>Practice</h1>
                <p>Track counts, reminders, and weekly recommendations.</p>
              </div>
            </div>

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

        {route === "detail" && (
          <section className="screen active">
            <div className="screen-top">
              <button className="icon-button" onClick={() => setRoute(detailBackRoute)} type="button" title="Back">
                {"<"}
              </button>
              <div>
                <h1>{selectedSloka.title}</h1>
                <p>{selectedSloka.titleTamil} | {selectedSloka.category} | {selectedSloka.duration}</p>
              </div>
            </div>

            <article className="event-card section-stack">
              <h3>Quick Actions</h3>
              <div className="simple-action-list">
                <button
                  className={`simple-action-button ${favorites.has(selectedSloka.id) ? "active" : ""}`}
                  onClick={() => toggleFavorite(selectedSloka.id)}
                  type="button"
                >
                  <span className="simple-action-main">
                    <span className="simple-action-icon">
                      <QuickActionGlyph icon="favorite" />
                    </span>
                    <span className="simple-action-label">Favorite</span>
                  </span>
                  <span className="simple-action-state">{favorites.has(selectedSloka.id) ? "Saved" : "Off"}</span>
                </button>
                <button className="simple-action-button" onClick={() => setRoute("favorites")} type="button">
                  <span className="simple-action-main">
                    <span className="simple-action-icon">
                      <QuickActionGlyph icon="favorites" />
                    </span>
                    <span className="simple-action-label">Open Favorites</span>
                  </span>
                  <span className="simple-action-state">{">"}</span>
                </button>
                <button
                  className={`simple-action-button ${showPronunciation ? "active" : ""}`}
                  onClick={() => setShowPronunciation((value) => !value)}
                  disabled={!hasPronunciationData}
                  type="button"
                >
                  <span className="simple-action-main">
                    <span className="simple-action-icon">
                      <QuickActionGlyph icon="pronunciation" />
                    </span>
                    <span className="simple-action-label">Pronunciation</span>
                  </span>
                  <span className="simple-action-state">{showPronunciation ? "On" : "Off"}</span>
                </button>
                <button
                  className={`simple-action-button ${wordByWordMode ? "active" : ""}`}
                  onClick={() => setWordByWordMode((value) => !value)}
                  disabled={!hasPronunciationData}
                  type="button"
                >
                  <span className="simple-action-main">
                    <span className="simple-action-icon">
                      <QuickActionGlyph icon="word" />
                    </span>
                    <span className="simple-action-label">Word Mode</span>
                  </span>
                  <span className="simple-action-state">{wordByWordMode ? "On" : "Off"}</span>
                </button>
                <button className="simple-action-button" onClick={() => logChantCount(selectedSloka.id, 1)} type="button">
                  <span className="simple-action-main">
                    <span className="simple-action-icon">
                      <QuickActionGlyph icon="chant1" />
                    </span>
                    <span className="simple-action-label">Mark Chant</span>
                  </span>
                  <span className="simple-action-state">+1</span>
                </button>
                <button className="simple-action-button" onClick={() => logChantCount(selectedSloka.id, 11)} type="button">
                  <span className="simple-action-main">
                    <span className="simple-action-icon">
                      <QuickActionGlyph icon="chant11" />
                    </span>
                    <span className="simple-action-label">Mark Chant</span>
                  </span>
                  <span className="simple-action-state">+11</span>
                </button>
              </div>
              {!hasPronunciationData && (
                <p className="mini-muted">Pronunciation controls are available for slokas that include pronunciation lines.</p>
              )}
            </article>

            {selectedRecommendation && (
              <article className="recommendation-card section-stack">
                <h3>Best Weekly Days</h3>
                <p>{selectedRecommendation.days.join(", ")}</p>
                <p>{selectedRecommendation.reason}</p>
              </article>
            )}

            <div className="voice-control">
              <label className="field-label" htmlFor="voice-select-detail">
                Accent voice
              </label>
              <select
                className="voice-select"
                id="voice-select-detail"
                onChange={(event) => setSelectedVoiceUri(event.target.value)}
                value={selectedVoiceUri}
              >
                {voiceOptions.length === 0 && <option value="">Loading system voices...</option>}
                {voiceOptions.map((voice) => (
                  <option key={voice.voiceURI} value={voice.voiceURI}>
                    {voice.name} ({voice.lang}){isLikelyIndianVoice(voice) ? " - Indian" : ""}
                  </option>
                ))}
              </select>
              <p className="voice-help">Pick the clearest voice for your pronunciation style.</p>
              <p className="mini-muted">{isSpeaking ? "Audio is playing..." : "Tap Play on any line below."}</p>
            </div>

            <div className="reader-card">
              {selectedSloka.lines.map((line, index) => {
                const pronunciationText = getLinePronunciationText(line);
                return (
                  <article className="line-block" key={`${selectedSloka.id}-${index + 1}`}>
                    <strong>
                      {index + 1}. {line.tamil}
                    </strong>
                    <span>{line.english}</span>
                    {showPronunciation && pronunciationText && (
                      <>
                        <p className="pronunciation-line">Pronunciation: {pronunciationText}</p>
                        <button className="word-audio-button" onClick={() => playLineAudio(line)} type="button">
                          Play Line Audio
                        </button>
                        {wordByWordMode && (
                          <div className="word-chip-row">
                            {getPronunciationWords(pronunciationText).map((word, wordIndex) => (
                              <button
                                className="word-chip"
                                key={`${selectedSloka.id}-${index + 1}-word-${wordIndex}`}
                                onClick={() => playWordAudio(word)}
                                type="button"
                              >
                                {word}
                              </button>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                    <small>{line.meaning}</small>
                  </article>
                );
              })}
            </div>
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

      {route !== "landing" && (
        <nav className="bottom-nav" aria-label="Primary">
          <button className={route === "home" ? "active" : ""} onClick={() => setRoute("home")} type="button">
            Home
          </button>
          <button className={route === "practice" ? "active" : ""} onClick={() => setRoute("practice")} type="button">
            Practice
          </button>
          <button className={route === "gods" ? "active" : ""} onClick={() => setRoute("gods")} type="button">
            Gods
          </button>
          <button className={route === "library" ? "active" : ""} onClick={() => setRoute("library")} type="button">
            Library
          </button>
          <button className={route === "favorites" ? "active" : ""} onClick={() => setRoute("favorites")} type="button">
            Favorites
          </button>
        </nav>
      )}
    </div>
  );
}
