import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Screen from "../components/Screen";
import { BRAND_MARK } from "../lib/deityImages";
import { colors, fonts, radius, shadow } from "../theme/theme";

const SLIDES = [
  { title: "My Shloka Ritual", body: "A calm daily practice for Tamil & English chanting." },
  { title: "Nourish Your Soul", body: "Daily chants, mindful listening and meaningful progress to bring inner calm." },
];

export default function Landing() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [index, setIndex] = useState(0);
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width - 48, width >= 900 ? 520 : 420);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / cardWidth);
    if (i !== index) setIndex(i);
  };

  return (
    <Screen scene>
      <View style={[styles.center, { paddingTop: insets.top, paddingBottom: insets.bottom + 24 }]}>
        <View style={[styles.card, { width: cardWidth }]}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={onScroll}
            scrollEventThrottle={16}
          >
            {SLIDES.map((s, i) => (
              <View key={i} style={[styles.slide, { width: cardWidth }]}>
                <View style={styles.halo}>
                  <Image source={BRAND_MARK} style={styles.mark} contentFit="contain" />
                </View>
                <Text style={styles.title}>{s.title}</Text>
                <Text style={styles.body}>{s.body}</Text>
              </View>
            ))}
          </ScrollView>

          <View style={styles.dots}>
            {SLIDES.map((_, i) => (
              <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
            ))}
          </View>

          <Pressable style={styles.cta} onPress={() => router.push("/welcome")}>
            <Text style={styles.ctaText}>Enter Slokas</Text>
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
  slide: { alignItems: "center", justifyContent: "center", paddingHorizontal: 28, paddingTop: 16 },
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
  dots: { flexDirection: "row", justifyContent: "center", gap: 8, marginTop: 24, marginBottom: 20 },
  dot: { width: 9, height: 9, borderRadius: 5, backgroundColor: "rgba(38,71,45,0.18)" },
  dotActive: { backgroundColor: colors.lotusNight, width: 9 },
  cta: {
    marginHorizontal: 20,
    backgroundColor: colors.lotusDeep,
    borderRadius: radius.pill,
    paddingVertical: 16,
    alignItems: "center",
    ...shadow.cta,
  },
  ctaText: { fontFamily: fonts.semibold, fontSize: 17, color: "#fff" },
});
