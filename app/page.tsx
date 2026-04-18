import { AppClient } from "@/components/AppClient";
import { getSlokaById, getSlokaSummaries } from "@/lib/domain/slokas";
import { listSessions } from "@/lib/server/session-store";

export default function HomePage() {
  const slokaList = getSlokaSummaries();
  const initialSloka = getSlokaById(slokaList[0]?.id ?? "lingashtakam");
  const initialSessions = listSessions();

  if (!initialSloka) {
    throw new Error("No sloka data is available.");
  }

  return <AppClient initialSloka={initialSloka} initialSlokaList={slokaList} initialSessions={initialSessions} />;
}
