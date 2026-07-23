import { Platform } from "react-native";

// Content column width on web, scaling up on wider browsers so the app
// reads as a real responsive website instead of a fixed mobile column.
// Native (iOS/Android) always gets the full device width (undefined).
export function contentMaxWidth(windowWidth: number): number | undefined {
  if (Platform.OS !== "web") return undefined;
  if (windowWidth >= 1100) return 760;
  if (windowWidth >= 760) return 600;
  return 480;
}
