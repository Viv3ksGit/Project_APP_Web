import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Platform, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { hydrateStore } from "../lib/store";
import { colors } from "../theme/theme";

const SESSION_FLAG = "msr_session_opened_v1";

export default function RootLayout() {
  const router = useRouter();
  const [loaded, error] = useFonts({
    Lora_400: require("../assets/fonts/lora-400.ttf"),
    Lora_500: require("../assets/fonts/lora-500.ttf"),
    Lora_600: require("../assets/fonts/lora-600.ttf"),
    Lora_700: require("../assets/fonts/lora-700.ttf"),
    NotoSerifTamil_400: require("../assets/fonts/noto-serif-tamil-400.ttf"),
    NotoSerifTamil_500: require("../assets/fonts/noto-serif-tamil-500.ttf"),
    NotoSerifTamil_600: require("../assets/fonts/noto-serif-tamil-600.ttf"),
    NotoSerifTamil_700: require("../assets/fonts/noto-serif-tamil-700.ttf"),
  });

  useEffect(() => {
    if (error) console.warn("Font load error", error);
  }, [error]);

  useEffect(() => {
    hydrateStore();
  }, []);

  // Every fresh app open should start at the landing screen. On native this
  // is already true (no persisted nav state across process kills). On web,
  // a session-scoped flag (cleared when the tab/browser closes) forces a
  // hard-loaded page back to "/" once per session, without disrupting
  // normal in-app navigation or same-tab refreshes later in that session.
  useEffect(() => {
    if (Platform.OS !== "web") return;
    try {
      const alreadyOpened = window.sessionStorage.getItem(SESSION_FLAG);
      if (!alreadyOpened) {
        window.sessionStorage.setItem(SESSION_FLAG, "1");
        if (window.location.pathname !== "/") {
          router.replace("/");
        }
      }
    } catch {
      // sessionStorage unavailable (privacy mode, etc.) — skip silently
    }
  }, [router]);

  if (!loaded && !error) {
    return <View style={{ flex: 1, backgroundColor: colors.night }} />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "#EFE7D6" } }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="welcome" />
          <Stack.Screen name="setup" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="reader/[id]" />
          <Stack.Screen name="panchangam" />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
