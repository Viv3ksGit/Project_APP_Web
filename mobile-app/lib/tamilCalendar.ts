import {
  Observer,
  getPanchangam,
  karanaNames,
  nakshatraNames,
  rituNames,
  tithiNames,
  yogaNames,
} from "@ishubhamx/panchangam-js";

// Ported from the reference web app (lib/domain/tamil-calendar.ts).
const DEFAULT_LOCATION = {
  name: "Chennai",
  latitude: 13.0827,
  longitude: 80.2707,
  elevationMeters: 6,
  timezone: "Asia/Kolkata",
} as const;

type FestivalSummary = {
  name: string;
  category: string;
};

export type TamilCalendarToday = {
  date: string;
  weekday: string;
  tithi: string;
  paksha: string;
  masa: string;
  highlight: string;
  festivals: FestivalSummary[];
  location: string;
};

function getTimezoneOffsetMinutes(timezone: string, date: Date): number {
  const formatted = date.toLocaleString("en-US", {
    timeZone: timezone,
    timeZoneName: "longOffset",
  });
  const match = formatted.match(/GMT([+-]\d{1,2}):?(\d{2})?/);
  if (!match) return 0;
  const sign = match[1].startsWith("+") ? 1 : -1;
  const hours = Number.parseInt(match[1].replace(/[+-]/g, ""), 10);
  const minutes = match[2] ? Number.parseInt(match[2], 10) : 0;
  return sign * (hours * 60 + minutes);
}

function deriveHighlight(tithiName: string, festivals: FestivalSummary[]): string {
  const festivalNames = festivals.map((festival) => festival.name.toLowerCase());
  if (festivalNames.some((name) => name.includes("pradosh"))) return "Pradosham";
  if (festivalNames.some((name) => name.includes("ekadashi"))) return "Ekadashi";
  if (festivalNames.some((name) => name.includes("amavasya"))) return "Amavasya";
  if (festivalNames.some((name) => name.includes("purnima"))) return "Pournami";

  const tithi = tithiName.toLowerCase();
  if (tithi.includes("trayodashi")) return "Pradosham (Trayodashi)";
  if (tithi.includes("ekadashi")) return "Ekadashi";
  if (tithi.includes("amavasya")) return "Amavasya";
  if (tithi.includes("purnima")) return "Pournami";
  if (tithi.includes("chaturthi")) return "Chaturthi";

  return "Auspicious Day";
}

function deviceTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || DEFAULT_LOCATION.timezone;
  } catch {
    return DEFAULT_LOCATION.timezone;
  }
}

export type PanchangamDetail = TamilCalendarToday & {
  nakshatra: string;
  yoga: string;
  karana: string;
  ritu: string;
  sunrise: string;
  sunset: string;
  moonrise: string;
  moonset: string;
  rahuKalam: string;
  brahmaMuhurta: string;
  abhijitMuhurta: string;
};

function fmtTime(value: unknown, timezone: string): string {
  if (!(value instanceof Date) || Number.isNaN(value.getTime())) return "—";
  return value.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: timezone });
}

function fmtRange(start: unknown, end: unknown, timezone: string): string {
  const a = fmtTime(start, timezone);
  const b = fmtTime(end, timezone);
  return a === "—" || b === "—" ? "—" : `${a} – ${b}`;
}

export function getPanchangamDetail(now: Date = new Date()): PanchangamDetail | null {
  const base = getTamilCalendarToday(now);
  if (!base) return null;
  try {
    const timezone = deviceTimezone();
    const observer = new Observer(
      DEFAULT_LOCATION.latitude,
      DEFAULT_LOCATION.longitude,
      DEFAULT_LOCATION.elevationMeters,
    );
    const timezoneOffset = getTimezoneOffsetMinutes(timezone, now);
    const p = getPanchangam(now, observer, { timezoneOffset, calendarType: "amanta" });
    const abhijit = p.abhijitMuhurta as { start?: Date; end?: Date } | undefined;
    const brahma = p.brahmaMuhurta as { start?: Date; end?: Date } | undefined;

    return {
      ...base,
      nakshatra: nakshatraNames[p.nakshatra] ?? `Nakshatra ${p.nakshatra}`,
      yoga: yogaNames[p.yoga] ?? `Yoga ${p.yoga}`,
      karana: typeof p.karana === "string" ? p.karana : karanaNames[p.karana] ?? String(p.karana),
      ritu: typeof p.ritu === "string" ? p.ritu : rituNames[p.ritu] ?? "—",
      sunrise: fmtTime(p.sunrise, timezone),
      sunset: fmtTime(p.sunset, timezone),
      moonrise: fmtTime(p.moonrise, timezone),
      moonset: fmtTime(p.moonset, timezone),
      rahuKalam: fmtRange(p.rahuKalamStart, p.rahuKalamEnd, timezone),
      brahmaMuhurta: fmtRange(brahma?.start, brahma?.end, timezone),
      abhijitMuhurta: fmtRange(abhijit?.start, abhijit?.end, timezone),
    };
  } catch {
    return null;
  }
}

export function getTamilCalendarToday(now: Date = new Date()): TamilCalendarToday | null {
  try {
    const timezone = deviceTimezone();
    const observer = new Observer(
      DEFAULT_LOCATION.latitude,
      DEFAULT_LOCATION.longitude,
      DEFAULT_LOCATION.elevationMeters,
    );
    const timezoneOffset = getTimezoneOffsetMinutes(timezone, now);
    const panchangam = getPanchangam(now, observer, { timezoneOffset, calendarType: "amanta" });

    const tithiName = tithiNames[panchangam.tithi] ?? `Tithi ${panchangam.tithi}`;
    const festivals: FestivalSummary[] = (panchangam.festivals ?? []).map((festival: FestivalSummary) => ({
      name: festival.name,
      category: festival.category,
    }));

    const weekday = now.toLocaleDateString("en-US", { weekday: "long", timeZone: timezone });
    const date = now.toLocaleDateString("en-CA", { timeZone: timezone });

    return {
      date,
      weekday,
      tithi: tithiName,
      paksha: panchangam.paksha,
      masa: panchangam.masa.name,
      highlight: deriveHighlight(tithiName, festivals),
      festivals: festivals.slice(0, 4),
      location: `Your Location (${timezone})`,
    };
  } catch {
    return null;
  }
}
