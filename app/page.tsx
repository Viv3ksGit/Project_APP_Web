import { AppClient } from "@/components/AppClient";
import { getSlokaById, getSlokaSummaries } from "@/lib/domain/slokas";

export default function HomePage() {
  const slokaList = getSlokaSummaries();
  const initialSloka = getSlokaById(slokaList[0]?.id ?? "lingashtakam");

  if (!initialSloka) {
    throw new Error("No sloka data is available.");
  }

  return <AppClient initialSloka={initialSloka} initialSlokaList={slokaList} />;
}
