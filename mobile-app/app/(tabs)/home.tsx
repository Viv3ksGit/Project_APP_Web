import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Screen from "../../components/Screen";
import SlokaCard from "../../components/SlokaCard";
import { DEITY_ORDER, deityImage } from "../../lib/deityImages";
import { useProfileName } from "../../lib/profile";
import { getTodayRecommendedIds } from "../../lib/recommendations";
import { getSlokaSummaries } from "../../lib/slokas";
import { useStore } from "../../lib/store";
import { getTamilCalendarToday } from "../../lib/tamilCalendar";
import { colors, fonts, radius, shadow } from "../../theme/theme";

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
}

export default function Home() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const all = useMemo(() => getSlokaSummaries(), []);
  const [query, setQuery] = useState("");
  const { name, refresh } = useProfileName();
  const { dailyCount, dailyTarget, streak, settings, chantLog } = useStore();
  useFocusEffect(useCallback(() => refresh(), [refresh]));

  const todayMinutes = useMemo(() => {
    const k = new Date().toISOString().slice(0, 10);
    return chantLog.filter((e) => new Date(e.t).toISOString().slice(0, 10) === k).reduce((s, e) => s + e.min, 0);
  }, [chantLog]);

  const today = new Date();
  const weekday = WEEKDAYS[today.getDay()];
  const cal = useMemo(() => getTamilCalendarToday(), []);
  const todayIds = getTodayRecommendedIds();
  const todaySloka = all.find((s) => todayIds.includes(s.id));
  const featured = todaySloka ?? all.find((s) => s.category === "Ganesh") ?? all[0];
  const progress = Math.min(1, dailyCount / Math.max(1, dailyTarget));
  const progressPct = Math.round(progress * 100);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return all;
    return all.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.titleTamil.includes(query.trim())
    );
  }, [query, all]);

  const openReader = (id: string) => router.push({ pathname: "/reader/[id]", params: { id } });

  return (
    <Screen>
    <ScrollView
      style={styles.root}
      contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: 24, paddingHorizontal: 20 }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.om}>ॐ</Text>
          <View>
            <Text style={styles.greeting}>{name ? `${greeting()}, ${name}` : greeting()}</Text>
            <Text style={styles.subGreeting}>Begin your spiritual journey today</Text>
          </View>
        </View>
        <Pressable style={styles.avatar} onPress={() => router.push("/(tabs)/profile")}>
          {name ? (
            <Text style={styles.avatarText}>{name.trim().charAt(0).toUpperCase()}</Text>
          ) : (
            <Ionicons name="person-outline" size={20} color={colors.lotus} />
          )}
        </Pressable>
      </View>

      {/* Today card */}
      {featured && (
        <View style={styles.todayCard}>
          <View style={styles.todayLabelRow}>
            <Text style={styles.todayLabel}>{todaySloka ? `Today — ${weekday}` : "Featured"}</Text>
            <Pressable onPress={() => router.push("/(tabs)/insights")} hitSlop={8}>
              <Text style={styles.todayDay}>Progress ›</Text>
            </Pressable>
          </View>

          {/* 3-stat row matching reference */}
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>
                {dailyCount}<Text style={styles.statDenom}>/{dailyTarget}</Text>
              </Text>
              <Text style={styles.statLabel}>Chants</Text>
            </View>
            <View style={styles.statSep} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>
                {todayMinutes}<Text style={styles.statDenom}>m</Text>
              </Text>
              <Text style={styles.statLabel}>of {settings.dailyMinutes}m time</Text>
            </View>
            <View style={styles.statSep} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>{streak}</Text>
              <Text style={styles.statLabel}>Day streak 🔥</Text>
            </View>
          </View>

          {/* Progress bar + % */}
          <View style={styles.progressRow}>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${progressPct}%` }]} />
            </View>
            <Text style={styles.progressPct}>{progressPct}%</Text>
          </View>
        </View>
      )}

      {/* Today's recommended slokas — moved up, right after the progress card */}
      {!query && todayIds.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>For {weekday}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingBottom: 4 }}>
            {all.filter((s) => todayIds.includes(s.id)).map((s) => (
              <Pressable key={s.id} style={styles.todayPill} onPress={() => openReader(s.id)}>
                <Image source={deityImage(s.category)} style={styles.todayPillImg} contentFit="cover" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.todayPillTitle} numberOfLines={1}>{s.title}</Text>
                  <Text style={styles.todayPillMeta}>{s.category} · {s.duration}</Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </>
      )}

      {/* Search */}
      <View style={styles.search}>
        <Ionicons name="search" size={18} color={colors.muted} style={{ marginRight: 10 }} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search sloka, deity or Tamil…"
          placeholderTextColor={colors.muted}
          style={styles.searchInput}
        />
      </View>

      {/* Chant by Deity */}
      {!query && (
        <>
          <Text style={styles.sectionTitle}>Chant by Deity</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.rail}>
            {DEITY_ORDER.map((d) => (
              <Pressable
                key={d}
                style={styles.deityTile}
                onPress={() => router.push({ pathname: "/(tabs)/explore", params: { deity: d } })}
              >
                <View style={styles.deityTileImgWrap}>
                  <Image source={deityImage(d)} style={styles.deityTileImg} contentFit="cover" />
                </View>
                <Text style={styles.deityTileName}>{d}</Text>
              </Pressable>
            ))}
          </ScrollView>

          {/* Tamil calendar (live panchangam) */}
          {cal && (
            <Pressable style={styles.calCard} onPress={() => router.push("/panchangam")}>
              <View style={styles.calHeadRow}>
                <Text style={styles.calDate}>
                  {cal.weekday}, {cal.date}
                </Text>
                <Ionicons name="chevron-forward" size={16} color={colors.lotusDeep} />
              </View>
              <View style={styles.calRow}>
                {[
                  ["TITHI", cal.tithi],
                  ["PAKSHA", cal.paksha],
                  ["MASA", cal.masa],
                ].map(([k, v]) => (
                  <View key={k} style={styles.calPill}>
                    <Text style={styles.calPillKey}>{k}</Text>
                    <Text style={styles.calPillVal} numberOfLines={1} adjustsFontSizeToFit>
                      {v}
                    </Text>
                  </View>
                ))}
              </View>
              <View style={styles.festRow}>
                <Text style={styles.festPill}>{cal.highlight}</Text>
                {cal.festivals.slice(0, 2).map((f) => (
                  <Text key={f.name} style={styles.festPill}>{f.name}</Text>
                ))}
              </View>
              <Text style={styles.calLoc}>{cal.location}</Text>
            </Pressable>
          )}
        </>
      )}

      {/* Popular */}
      <Text style={styles.sectionTitle}>{query ? `Results (${results.length})` : "Popular Slokas"}</Text>
      {(query ? results : results.slice(0, 5)).map((s) => (
        <SlokaCard key={s.id} sloka={s} />
      ))}

      {!query && (
        <Pressable style={styles.exploreBtn} onPress={() => router.push("/(tabs)/explore")}>
          <Ionicons name="library-outline" size={18} color={colors.lotus} />
          <Text style={styles.exploreBtnText}>Explore all slokas</Text>
          <Ionicons name="arrow-forward" size={17} color={colors.lotus} />
        </Pressable>
      )}
    </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "transparent" },
  exploreBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 4,
    marginBottom: 8,
    paddingVertical: 14,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.lotus,
    backgroundColor: colors.surface,
  },
  exploreBtnText: { fontFamily: fonts.semibold, fontSize: 15, color: colors.lotus },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 10, flex: 1 },
  om: { fontSize: 26, color: colors.lotus },
  greeting: { fontFamily: fonts.bold, fontSize: 24, color: colors.inkDeep },
  subGreeting: { fontFamily: fonts.body, fontSize: 13, color: colors.muted, marginTop: 2 },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.halo,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontFamily: fonts.semibold, fontSize: 17, color: colors.lotus },
  todayCard: {
    backgroundColor: "#FBF2E0",
    borderRadius: radius.lg,
    padding: 16,
    marginTop: 18,
    borderWidth: 1,
    borderColor: "rgba(184,115,51,0.18)",
  },
  todayLabelRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  todayLabel: { fontFamily: fonts.semibold, fontSize: 13, color: colors.copper, letterSpacing: 0.5 },
  todayDay: { fontFamily: fonts.semibold, fontSize: 13, color: colors.lotusDeep },
  statsRow: { flexDirection: "row", alignItems: "center", marginBottom: 14 },
  stat: { flex: 1, alignItems: "center" },
  statValue: { fontFamily: fonts.bold, fontSize: 22, color: colors.inkDeep },
  statDenom: { fontFamily: fonts.body, fontSize: 14, color: colors.muted },
  statLabel: { fontFamily: fonts.body, fontSize: 11, color: colors.muted, marginTop: 2 },
  statSep: { width: 1, height: 36, backgroundColor: colors.line },
  progressRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 14 },
  progressTrack: {
    flex: 1,
    height: 7,
    borderRadius: 4,
    backgroundColor: "rgba(184,115,51,0.18)",
    overflow: "hidden",
  },
  progressFill: { height: "100%", borderRadius: 4, backgroundColor: colors.lotus },
  progressPct: { fontFamily: fonts.semibold, fontSize: 12, color: colors.lotusDeep, width: 36, textAlign: "right" },
  todayRow: { flexDirection: "row", alignItems: "center", marginTop: 14, gap: 12 },
  todayImg: { width: 52, height: 52, borderRadius: radius.md, backgroundColor: colors.halo },
  todayBody: { flex: 1 },
  todayTitle: { fontFamily: fonts.bold, fontSize: 16, color: colors.ink },
  todayMeta: { fontFamily: fonts.body, fontSize: 12.5, color: colors.muted, marginTop: 2 },
  chantBtn: { backgroundColor: colors.lotusDeep, borderRadius: radius.pill, paddingHorizontal: 16, paddingVertical: 10 },
  chantText: { fontFamily: fonts.semibold, fontSize: 13, color: "#fff" },
  todayPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 12,
    width: 220,
    ...shadow.card,
  },
  todayPillImg: { width: 40, height: 40, borderRadius: radius.md, backgroundColor: colors.halo },
  todayPillTitle: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink },
  todayPillMeta: { fontFamily: fonts.body, fontSize: 11.5, color: colors.muted, marginTop: 2 },
  search: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    paddingHorizontal: 18,
    paddingVertical: 13,
    marginTop: 18,
    borderWidth: 1,
    borderColor: colors.line,
    ...shadow.card,
  },
  searchInput: { flex: 1, fontFamily: fonts.body, fontSize: 14, color: colors.ink, padding: 0 },
  sectionTitle: { fontFamily: fonts.bold, fontSize: 18, color: colors.inkDeep, marginTop: 24, marginBottom: 14 },
  rail: { flexDirection: "row" },
  deityTile: { alignItems: "center", marginRight: 14, width: 72 },
  deityTileImgWrap: {
    width: 72,
    height: 72,
    borderRadius: radius.md,
    backgroundColor: colors.cream,
    borderWidth: 1,
    borderColor: colors.line,
    overflow: "hidden",
  },
  deityTileImg: { width: "100%", height: "100%" },
  deityTileName: { fontFamily: fonts.medium, fontSize: 12, color: colors.ink, marginTop: 6, textAlign: "center" },
  calCard: {
    backgroundColor: colors.cream,
    borderRadius: radius.lg,
    padding: 16,
    marginTop: 20,
    borderWidth: 1,
    borderColor: colors.line,
  },
  calHeadRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  calDate: { fontFamily: fonts.semibold, fontSize: 15, color: colors.lotusDeep },
  calRow: { flexDirection: "row", gap: 10, marginTop: 14 },
  calPill: { flex: 1, backgroundColor: colors.calendarPill, borderRadius: radius.md, padding: 12 },
  calPillKey: { fontFamily: fonts.semibold, fontSize: 10, color: "#DCEBD6", letterSpacing: 1 },
  calPillVal: { fontFamily: fonts.bold, fontSize: 16, color: "#fff", marginTop: 4 },
  festRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 14 },
  festPill: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: "#fff",
    backgroundColor: colors.lotusDeep,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.pill,
    overflow: "hidden",
  },
  calLoc: { fontFamily: fonts.body, fontSize: 12.5, color: colors.muted, marginTop: 14 },
});
