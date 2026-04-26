import { getTamilCalendarToday } from "@/lib/domain/tamil-calendar";
import { ok } from "@/lib/server/http";
import type { NextRequest } from "next/server";

function parseNumberOrUndefined(value: string | null): number | undefined {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const latitude = parseNumberOrUndefined(searchParams.get("lat"));
  const longitude = parseNumberOrUndefined(searchParams.get("lon"));
  const timezone = searchParams.get("tz") ?? undefined;
  const locationLabel = searchParams.get("label") ?? undefined;

  return ok({
    today: getTamilCalendarToday(new Date(), {
      latitude,
      longitude,
      timezone,
      locationLabel,
    }),
  });
}
