import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useAudioPlayer } from "expo-audio";
import { useEffect } from "react";
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Screen from "../components/Screen";
import { BRAND_MARK } from "../lib/deityImages";
import { colors, fonts, radius, shadow } from "../theme/theme";

const TAMBURA_LOOP = require("../assets/audio/tambura-loop.wav");

export default function Landing() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width - 48, width >= 900 ? 520 : 420);

  // Gentle tambura drone while the landing screen is open — stops the
  // moment you leave (Enter Shlokas or navigating away).
  const player = useAudioPlayer(TAMBURA_LOOP);
  useEffect(() => {
    player.loop = true;
    player.volume = 0.22;
    player.play();
    return () => {
      player.pause();
    };
  }, [player]);

  return (
    <Screen scene>
      <View style={[styles.center, { paddingTop: insets.top, paddingBottom: insets.bottom + 24 }]}>
        <View style={[styles.card, { width: cardWidth }]}>
          <View style={styles.slide}>
            <View style={styles.halo}>
              <Image source={BRAND_MARK} style={styles.mark} contentFit="contain" />
            </View>
            <Text style={styles.title}>My Shloka Ritual</Text>
            <Text style={styles.body}>
              Daily chants, mindful listening and meaningful progress to bring inner calm.
            </Text>
          </View>

          <Pressable style={styles.cta} onPress={() => router.push("/welcome")}>
            <Text style={styles.ctaText}>Enter Shlokas</Text>
          </Pressable>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: "transparent" },
  center: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 24 },
  card: {
    backgroundColor: "rgba(251, 247, 238, 0.82)",
    borderRadius: 28,
    paddingVertical: 28,
    paddingHorizontal: 8,
    ...shadow.card,
  },
  slide: { alignItems: "center", justifyContent: "center", paddingHorizontal: 28, paddingTop: 16, paddingBottom: 8 },
  halo: {
    width: 116,
    height: 116,
    borderRadius: 58,
    backgroundColor: "rgba(255,255,255,0.9)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 26,
    ...shadow.card,
  },
  mark: { width: 78, height: 78 },
  title: { fontFamily: fonts.bold, fontSize: 28, color: colors.ink, textAlign: "center" },
  body: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.muted,
    textAlign: "center",
    marginTop: 12,
    lineHeight: 23,
  },
  cta: {
    marginHorizontal: 20,
    marginTop: 24,
    backgroundColor: colors.lotusDeep,
    borderRadius: radius.pill,
    paddingVertical: 16,
    alignItems: "center",
    ...shadow.cta,
  },
  ctaText: { fontFamily: fonts.semibold, fontSize: 17, color: "#fff" },
});
