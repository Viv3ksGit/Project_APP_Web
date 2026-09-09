import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Screen from "../../components/Screen";
import SlokaCard from "../../components/SlokaCard";
import { useProfileName } from "../../lib/profile";
import { getSlokaSummaries } from "../../lib/slokas";
import { useStore } from "../../lib/store";
import { colors, fonts, radius, shadow } from "../../theme/theme";

export default function Profile() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { name, refresh } = useProfileName();
  const { favorites, totalCount, streak, perSlokaCount } = useStore();
  useFocusEffect(useCallback(() => refresh(), [refresh]));

  const all = useMemo(() => getSlokaSummaries(), []);
  const favSlokas = useMemo(() => all.filter((s) => favorites.includes(s.id)), [all, favorites]);
  const topChanted = useMemo(
    () =>
      Object.entries(perSlokaCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([slokaId, count]) => ({ sloka: all.find((s) => s.id === slokaId), count }))
        .filter((e): e is { sloka: (typeof all)[number]; count: number } => !!e.sloka),
    [all, perSlokaCount]
  );

  const stats = [
    { label: "Total chants", value: totalCount, icon: "flower-outline" as const },
    { label: "Day streak 🔥", value: streak, icon: "flame-outline" as const },
    { label: "Favorites", value: favorites.length, icon: "heart-outline" as const },
  ];

  return (
    <Screen>
    <ScrollView
      style={styles.root}
      contentContainerStyle={{ paddingTop: insets.top + 16, paddingHorizontal: 20, paddingBottom: 24 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.head}>
        <View style={styles.avatar}>
          {name ? (
            <Text style={styles.avatarText}>{name.trim().charAt(0).toUpperCase()}</Text>
          ) : (
            <Ionicons name="person-outline" size={30} color={colors.lotus} />
          )}
        </View>
        <Text style={styles.name}>{name || "Welcome"}</Text>
        <Pressable style={styles.editBtn} onPress={() => router.push("/setup")}>
          <Ionicons name="create-outline" size={15} color={colors.lotus} />
          <Text style={styles.editText}>{name ? "Edit name" : "Add your name"}</Text>
        </Pressable>
      </View>

      <Pressable style={styles.menuRow} onPress={() => router.push("/(tabs)/journey")}>
        <View style={styles.menuIcon}>
          <Ionicons name="compass-outline" size={18} color={colors.lotus} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.menuTitle}>Journey Selection</Text>
          <Text style={styles.menuSub}>Set up your ritual or explore the library</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.muted} />
      </Pressable>

      <View style={styles.statsRow}>
        {stats.map((s) => (
          <View key={s.label} style={styles.statCard}>
            <Ionicons name={s.icon} size={20} color={colors.lotus} />
            <Text style={styles.statValue}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      {topChanted.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Most Chanted</Text>
          {topChanted.map(({ sloka, count }, idx) => (
            <Pressable
              key={sloka.id}
              style={styles.topRow}
              onPress={() => router.push({ pathname: "/reader/[id]", params: { id: sloka.id } })}
            >
              <Text style={styles.topRank}>{idx + 1}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.topTitle} numberOfLines={1}>{sloka.title}</Text>
                <Text style={styles.topMeta}>{sloka.category} · {sloka.duration}</Text>
              </View>
              <Text style={styles.topCount}>{count}×</Text>
            </Pressable>
          ))}
        </>
      )}

      <Text style={styles.sectionTitle}>Your Favorites</Text>
      {favSlokas.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="heart-outline" size={32} color={colors.goldSoft} />
          <Text style={styles.emptyText}>No favorites yet. Tap the heart on any sloka to save it here.</Text>
        </View>
      ) : (
        favSlokas.map((s) => <SlokaCard key={s.id} sloka={s} />)
      )}

      <Text style={styles.credit}>
        Landing tambura sound: "Amritavarshini" by Arunasank, Wikimedia Commons, licensed CC BY-SA 4.0.
      </Text>
    </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "transparent" },
  head: { alignItems: "center", marginBottom: 22 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.halo,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontFamily: fonts.bold, fontSize: 34, color: colors.lotus },
  name: { fontFamily: fonts.bold, fontSize: 24, color: colors.inkDeep, marginTop: 12 },
  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
  },
  editText: { fontFamily: fonts.medium, fontSize: 13, color: colors.lotus },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 14,
    marginBottom: 20,
    ...shadow.card,
  },
  menuIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.halo,
    alignItems: "center",
    justifyContent: "center",
  },
  menuTitle: { fontFamily: fonts.semibold, fontSize: 14.5, color: colors.ink },
  menuSub: { fontFamily: fonts.body, fontSize: 12, color: colors.muted, marginTop: 1 },
  statsRow: { flexDirection: "row", gap: 12 },
  statCard: {
    flex: 1,
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: colors.line,
    ...shadow.card,
  },
  statValue: { fontFamily: fonts.bold, fontSize: 22, color: colors.inkDeep, marginTop: 6 },
  statLabel: { fontFamily: fonts.body, fontSize: 12, color: colors.muted, marginTop: 2 },
  sectionTitle: { fontFamily: fonts.bold, fontSize: 18, color: colors.inkDeep, marginTop: 26, marginBottom: 14 },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 13,
    marginBottom: 10,
    ...shadow.card,
  },
  topRank: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.halo,
    textAlign: "center",
    lineHeight: 28,
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.lotus,
    overflow: "hidden",
  },
  topTitle: { fontFamily: fonts.bold, fontSize: 15, color: colors.ink },
  topMeta: { fontFamily: fonts.body, fontSize: 12, color: colors.muted, marginTop: 2 },
  topCount: { fontFamily: fonts.semibold, fontSize: 14, color: colors.copper },
  empty: { alignItems: "center", gap: 12, paddingVertical: 30 },
  emptyText: { fontFamily: fonts.body, fontSize: 14, color: colors.muted, textAlign: "center", paddingHorizontal: 30 },
  credit: {
    fontFamily: fonts.body,
    fontSize: 10.5,
    color: colors.muted,
    textAlign: "center",
    marginTop: 28,
    paddingHorizontal: 10,
    lineHeight: 15,
  },
});
