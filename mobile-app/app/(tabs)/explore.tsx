import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Screen from "../../components/Screen";
import { benefitOf } from "../../lib/benefits";
import { BRAND_MARK, DEITY_ORDER, deityImage } from "../../lib/deityImages";
import { getTodayRecommendedIds } from "../../lib/recommendations";
import { getSlokaSummaries } from "../../lib/slokas";
import { toggleFavorite, useStore } from "../../lib/store";
import { colors, fonts, radius, shadow } from "../../theme/theme";

export default function Explore() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ deity?: string }>();
  const all = useMemo(() => getSlokaSummaries(), []);
  const { favorites, perSlokaCount } = useStore();
  const [active, setActive] = useState<string>(params.deity ?? "All");

  useEffect(() => {
    if (params.deity) setActive(params.deity);
  }, [params.deity]);

  const todayIds = useMemo(() => getTodayRecommendedIds(), []);
  const todayPickId = useMemo(() => all.find((s) => todayIds.includes(s.id))?.id, [all, todayIds]);

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const s of all) map[s.category] = (map[s.category] ?? 0) + 1;
    return map;
  }, [all]);

  const deities = useMemo(() => DEITY_ORDER.filter((d) => counts[d] > 0), [counts]);
  const results = useMemo(() => {
    const list = active === "All" ? all : all.filter((s) => s.category === active);
    // Surface today's pick first on All
    if (active === "All" && todayPickId) {
      return [...list].sort((a, b) => (a.id === todayPickId ? -1 : b.id === todayPickId ? 1 : 0));
    }
    return list;
  }, [active, all, todayPickId]);

  const open = (id: string) => router.push({ pathname: "/reader/[id]", params: { id } });

  return (
    <Screen>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Image source={BRAND_MARK} style={styles.logo} contentFit="contain" />
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Shloka Library</Text>
          <Text style={styles.subtitle}>Daily chants for inner calm</Text>
        </View>
        <Pressable style={styles.circleBtn} onPress={() => router.push("/(tabs)/search")}>
          <Ionicons name="search" size={18} color={colors.ink} />
        </Pressable>
      </View>

      {/* Filter chips */}
      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
          {["All", ...deities].map((d) => (
            <Pressable key={d} onPress={() => setActive(d)} style={[styles.chip, active === d && styles.chipActive]}>
              <Text style={[styles.chipText, active === d && styles.chipTextActive]}>{d}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Card grid */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}>
        <View style={styles.grid}>
          {results.map((s) => {
            const fav = favorites.includes(s.id);
            const isPick = s.id === todayPickId;
            const chants = perSlokaCount[s.id] ?? 0;
            return (
              <Pressable key={s.id} style={[styles.card, isPick && styles.cardPick]} onPress={() => open(s.id)}>
                {isPick && (
                  <View style={styles.pickBadge}>
                    <Ionicons name="star" size={9} color="#fff" />
                    <Text style={styles.pickText}>{"Today's Pick"}</Text>
                  </View>
                )}
                <Pressable hitSlop={8} onPress={() => toggleFavorite(s.id)} style={styles.heart}>
                  <Ionicons name={fav ? "heart" : "heart-outline"} size={18} color={fav ? colors.heart : colors.goldSoft} />
                </Pressable>

                <View style={styles.artWrap}>
                  <Image source={deityImage(s.category)} style={styles.art} contentFit="contain" />
                </View>
                <Text style={styles.cardTitle} numberOfLines={1}>{s.title}</Text>
                <Text style={styles.cardBenefit} numberOfLines={2}>{benefitOf(s.category)}</Text>

                <View style={styles.cardDivider} />

                <View style={styles.metaRow}>
                  <View style={styles.metaItem}>
                    <Ionicons name="time-outline" size={11} color={colors.muted} />
                    <Text style={styles.metaText}>{s.duration}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Ionicons name="leaf-outline" size={11} color={colors.muted} />
                    <Text style={styles.metaText}>{chants} chants</Text>
                  </View>
                </View>

                <View style={styles.playBtn}>
                  <Ionicons name="play" size={16} color={colors.lotusDeep} style={{ marginLeft: 2 }} />
                </View>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", gap: 11, paddingHorizontal: 18, paddingBottom: 12 },
  logo: { width: 34, height: 34 },
  title: { fontFamily: fonts.bold, fontSize: 22, color: colors.inkDeep },
  subtitle: { fontFamily: fonts.body, fontSize: 12, color: colors.muted, marginTop: 1 },
  circleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.line,
  },

  chipRow: { paddingHorizontal: 16, gap: 8, paddingBottom: 12 },
  chip: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  chipActive: { backgroundColor: colors.lotusNight, borderColor: colors.lotusNight },
  chipText: { fontFamily: fonts.medium, fontSize: 13, color: colors.ink },
  chipTextActive: { color: "#fff" },

  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", rowGap: 12 },
  card: {
    width: "48.5%",
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.line,
    paddingTop: 14,
    paddingBottom: 12,
    paddingHorizontal: 12,
    alignItems: "center",
    ...shadow.card,
  },
  cardPick: { borderColor: colors.gold, borderWidth: 1.5 },
  pickBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.copper,
    borderRadius: radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 3,
    zIndex: 2,
  },
  pickText: { fontFamily: fonts.semibold, fontSize: 9, color: "#fff" },
  heart: { position: "absolute", top: 8, right: 8, zIndex: 2, padding: 2 },

  artWrap: { width: 84, height: 84, marginTop: 6 },
  art: { width: "100%", height: "100%" },
  cardTitle: { fontFamily: fonts.bold, fontSize: 14.5, color: colors.inkDeep, textAlign: "center", marginTop: 8 },
  cardBenefit: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.muted,
    textAlign: "center",
    marginTop: 3,
    lineHeight: 15,
    minHeight: 30,
  },
  cardDivider: { width: 34, height: 1, backgroundColor: colors.goldSoft, opacity: 0.6, marginTop: 8, marginBottom: 7 },
  metaRow: { flexDirection: "row", gap: 12 },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 3 },
  metaText: { fontFamily: fonts.body, fontSize: 10.5, color: colors.muted },
  playBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1.5,
    borderColor: colors.lotusDeep,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 9,
  },
});
