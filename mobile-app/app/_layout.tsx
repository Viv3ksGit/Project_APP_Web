import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import DesktopShell from "../components/DesktopShell";
import { hydrateStore } from "../lib/store";
import { colors } from "../theme/theme";

export default function RootLayout() {
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

  if (!loaded && !error) {
    return <View style={{ flex: 1, backgroundColor: colors.night }} />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <DesktopShell>
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "#EFE7D6" } }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="welcome" />
            <Stack.Screen name="setup" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="reader/[id]" />
            <Stack.Screen name="panchangam" />
          </Stack>
        </DesktopShell>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
