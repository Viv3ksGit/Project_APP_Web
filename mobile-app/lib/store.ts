import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSyncExternalStore } from "react";

export type StoreState = {
  favorites: string[];
  totalCount: number;
  dailyCount: number;
  dailyTarget: number;
  lastChantDate: string;
  streak: number;
  perSlokaCount: Record<string, number>;
  // slokaId -> lineIndex -> highlight color ("gold" | "green" | "rose")
  highlights: Record<string, Record<number, string>>;
  readerPrefs: {
    language: "tamil" | "english";
    showMeaning: boolean;
    fontIdx: number;
  };
  settings: {
    dailyMinutes: number; // daily time target in minutes
    ritualStyle: "calm" | "count" | "timed";
    autoScroll: boolean;
    scrollSpeed: "slow" | "medium" | "fast";
    reminder: "morning" | "evening" | "custom" | "none";
    setupDone: boolean;
  };
  // rolling chant activity log (newest first, capped)
  chantLog: { t: number; id: string; min: number }[];
};

const KEY = "msr_store_v2";

let state: StoreState = {
  favorites: [],
  totalCount: 0,
  dailyCount: 0,
  dailyTarget: 11,
  lastChantDate: "",
  streak: 0,
  perSlokaCount: {},
  highlights: {},
  readerPrefs: { language: "tamil", showMeaning: true, fontIdx: 1 },
  settings: {
    dailyMinutes: 15,
    ritualStyle: "calm",
    autoScroll: false,
    scrollSpeed: "slow",
    reminder: "none",
    setupDone: false,
  },
  chantLog: [],
};

let hydrated = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function persist() {
  AsyncStorage.setItem(KEY, JSON.stringify(state)).catch(() => {});
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function hydrateStore() {
  if (hydrated) return;
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      state = {
        ...state,
        ...parsed,
        readerPrefs: { ...state.readerPrefs, ...parsed.readerPrefs },
        settings: { ...state.settings, ...parsed.settings },
      };
    }
  } catch {
    // ignore
  }
  if (state.lastChantDate && state.lastChantDate !== today()) {
    state = { ...state, dailyCount: 0 };
  }
  hydrated = true;
  emit();
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function getSnapshot() {
  return state;
}

export function useStore(): StoreState {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export function setReaderPrefs(patch: Partial<StoreState["readerPrefs"]>) {
  state = { ...state, readerPrefs: { ...state.readerPrefs, ...patch } };
  emit();
  persist();
}

export function setHighlight(slokaId: string, lineIndex: number, color: string) {
  state = {
    ...state,
    highlights: {
      ...state.highlights,
      [slokaId]: { ...state.highlights[slokaId], [lineIndex]: color },
    },
  };
  emit();
  persist();
}

export function clearHighlight(slokaId: string, lineIndex: number) {
  const forSloka = { ...state.highlights[slokaId] };
  delete forSloka[lineIndex];
  state = {
    ...state,
    highlights: { ...state.highlights, [slokaId]: forSloka },
  };
  emit();
  persist();
}

export function setDailyTarget(target: number) {
  state = { ...state, dailyTarget: target };
  emit();
  persist();
}

export function setSettings(patch: Partial<StoreState["settings"]>) {
  state = { ...state, settings: { ...state.settings, ...patch } };
  emit();
  persist();
}

export function toggleFavorite(id: string) {
  const has = state.favorites.includes(id);
  state = {
    ...state,
    favorites: has ? state.favorites.filter((f) => f !== id) : [...state.favorites, id],
  };
  emit();
  persist();
}

export function recordChant(slokaId: string, minutes = 5) {
  const d = today();
  let { streak, dailyCount } = state;
  if (state.lastChantDate !== d) {
    const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
    streak = state.lastChantDate === yesterday ? state.streak + 1 : 1;
    dailyCount = 0;
  } else if (streak === 0) {
    streak = 1;
  }
  state = {
    ...state,
    totalCount: state.totalCount + 1,
    dailyCount: dailyCount + 1,
    dailyTarget: state.dailyTarget,
    lastChantDate: d,
    streak,
    perSlokaCount: {
      ...state.perSlokaCount,
      [slokaId]: (state.perSlokaCount[slokaId] ?? 0) + 1,
    },
    chantLog: [{ t: Date.now(), id: slokaId, min: minutes }, ...state.chantLog].slice(0, 300),
  };
  emit();
  persist();
}
