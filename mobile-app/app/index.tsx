import { Image } from "expo-image";
import { useFocusEffect, useRouter } from "expo-router";
import { useAudioPlayer } from "expo-audio";
import { useCallback, useEffect, useRef } from "react";
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Screen from "../components/Screen";
import { BRAND_MARK } from "../lib/deityImages";
import { useStore } from "../lib/store";
import { colors, fonts, radius, shadow } from "../theme/theme";

const TAMBURA_LOOP = require("../assets/audio/tambura-loop.wav");

export default function Landing() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { settings } = useStore();
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width - 48, width >= 900 ? 520 : 420);

  // A light tambura drone loops ONLY while this splash screen is the
  // focused screen, and stops the instant you leave it (Enter, back
  // button, or any other navigation) — including when expo-router keeps
  // this screen mounted in the background stack, which a plain
  // mount/unmount effect would miss.
  //
  // Browsers block audio until the visitor has interacted with the page,
  // so the focus-time play() below is expected to fail silently the very
  // first time the screen ever loads. To make the loop actually audible,
  // we also (re)start it on the FIRST tap/click/key anywhere on this
  // screen while it's focused — a real user gesture, which the browser
  // allows.
  const player = useAudioPlayer(TAMBURA_LOOP);
  const startedRef = useRef(false);
  const focusedRef = useRef(false);

  const startAudio = () => {
    if (startedRef.current || !focusedRef.current) return;
    startedRef.current = true;
    player.play();
  };

  useEffect(() => {
    player.loop = true;
    player.volume = 0.38;
  }, [player]);

  useFocusEffect(
    useCallback(() => {
      focusedRef.current = true;
      startedRef.current = false;
      player.seekTo(0);
      player.play(); // succeeds once media-engagement/autoplay allows it; otherwise the interaction listener below covers it
      return () => {
        focusedRef.current = false;
        player.pause();
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [player])
  );

  useEffect(() => {
    const onFirstInteract = () => startAudio();
    // Cover mouse, touch and keyboard — pointerdown alone can miss on some
    // mobile browsers (notably older iOS Safari), so touchstart is added
    // as a belt-and-braces fallback.
    window.addEventListener?.("pointerdown", onFirstInteract);
    window.addEventListener?.("touchstart", onFirstInteract);
    window.addEventListener?.("keydown", onFirstInteract);
    return () => {
      window.removeEventListener?.("pointerdown", onFirstInteract);
      window.removeEventListener?.("touchstart", onFirstInteract);
      window.removeEventListener?.("keydown", onFirstInteract);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player]);

  const enter = () => {
    player.pause();
    const dest = settings.welcomeSeen ? "/(tabs)/home" : "/welcome";
    router.push(dest);
  };

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

          <Pressable style={styles.cta} onPress={enter}>
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
