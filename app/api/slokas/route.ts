import { getSlokaSummaries } from "@/lib/domain/slokas";
import { ok } from "@/lib/server/http";

export async function GET() {
  return ok({ slokas: getSlokaSummaries() });
}

