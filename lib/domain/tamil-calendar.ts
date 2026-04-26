import { Observer, getPanchangam, tithiNames } from "@ishubhamx/panchangam-js";

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

export type TamilCalendarInput = {
  latitude?: number;
  longitude?: number;
  timezone?: string;
  locationLabel?: string;
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

function sanitizeInput(input?: TamilCalendarInput) {
  const latitude =
    typeof input?.latitude === "number" && Number.isFinite(input.latitude) && input.latitude >= -90 && input.latitude <= 90
      ? input.latitude
      : DEFAULT_LOCATION.latitude;
  const longitude =
    typeof input?.longitude === "number" &&
    Number.isFinite(input.longitude) &&
    input.longitude >= -180 &&
    input.longitude <= 180
      ? input.longitude
      : DEFAULT_LOCATION.longitude;

  let timezone = input?.timezone?.trim() || DEFAULT_LOCATION.timezone;
  try {
    // Validate timezone input early so formatting calls do not throw.
    Intl.DateTimeFormat("en-US", { timeZone: timezone }).format(new Date());
  } catch {
    timezone = DEFAULT_LOCATION.timezone;
  }

  const locationLabel = input?.locationLabel?.trim() || `Your Location (${timezone})`;
  return { latitude, longitude, timezone, locationLabel };
}

export function getTamilCalendarToday(now: Date = new Date(), input?: TamilCalendarInput): TamilCalendarToday {
  const sanitized = sanitizeInput(input);
  const observer = new Observer(
    sanitized.latitude,
    sanitized.longitude,
    DEFAULT_LOCATION.elevationMeters,
  );
  const timezoneOffset = getTimezoneOffsetMinutes(sanitized.timezone, now);
  const panchangam = getPanchangam(now, observer, { timezoneOffset, calendarType: "amanta" });

  const tithiName = tithiNames[panchangam.tithi] ?? `Tithi ${panchangam.tithi}`;
  const festivals: FestivalSummary[] = (panchangam.festivals ?? []).map((festival) => ({
    name: festival.name,
    category: festival.category,
  }));

  const weekday = now.toLocaleDateString("en-US", {
    weekday: "long",
    timeZone: sanitized.timezone,
  });
  const date = now.toLocaleDateString("en-CA", { timeZone: sanitized.timezone });

  return {
    date,
    weekday,
    tithi: tithiName,
    paksha: panchangam.paksha,
    masa: panchangam.masa.name,
    highlight: deriveHighlight(tithiName, festivals),
    festivals: festivals.slice(0, 4),
    location: sanitized.locationLabel,
  };
}
