import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Screen from "../components/Screen";
import { getPanchangamDetail } from "../lib/tamilCalendar";
import { colors, fonts, radius, shadow } from "../theme/theme";

export default function Panchangam() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const p = useMemo(() => getPanchangamDetail(), []);

  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace("/(tabs)/home");
  };

  return (
    <Screen>
      <View style={[styles.topBar, { paddingTop: insets.top + 6 }]}>
        <Pressable onPress={goBack} hitSlop={12} style={styles.iconBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.inkDeep} />
        </Pressable>
        <Text style={styles.topTitle}>Tamil Calendar</Text>
        <View style={styles.iconBtn} />
      </View>

      {!p ? (
        <View style={styles.empty}>
          <Ionicons name="cloud-offline-outline" size={40} color={colors.goldSoft} />
          <Text style={styles.emptyText}>Panchangam is unavailable right now.</Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 28 }}
        >
          {/* Date header */}
          <View style={styles.headCard}>
            <Text style={styles.headDay}>{p.weekday}</Text>
            <Text style={styles.headDate}>{p.date}</Text>
            <View style={styles.highlightPill}>
              <Ionicons name="sparkles" size={13} color="#fff" />
              <Text style={styles.highlightText}>{p.highlight}</Text>
            </View>
          </View>

          {/* Core panchangam */}
          <Text style={styles.section}>Panchangam</Text>
          <View style={styles.grid}>
            {[
              ["Tithi", p.tithi],
              ["Paksha", p.paksha],
              ["Masa", p.masa],
              ["Nakshatra", p.nakshatra],
              ["Yoga", p.yoga],
              ["Karana", p.karana],
              ["Ritu", p.ritu],
              ["Vara", p.weekday],
            ].map(([k, v]) => (
              <View key={k} style={styles.cell}>
                <Text style={styles.cellKey}>{k.toUpperCase()}</Text>
                <Text style={styles.cellVal} numberOfLines={1} adjustsFontSizeToFit>{v}</Text>
              </View>
            ))}
          </View>

          {/* Sun & moon */}
          <Text style={styles.section}>Sun & Moon</Text>
          <View style={styles.grid}>
            {[
              ["Sunrise", p.sunrise, "sunny-outline"],
              ["Sunset", p.sunset, "partly-sunny-outline"],
              ["Moonrise", p.moonrise, "moon-outline"],
              ["Moonset", p.moonset, "cloudy-night-outline"],
            ].map(([k, v, icon]) => (
              <View key={k} style={styles.cell}>
                <Ionicons name={icon as never} size={16} color={colors.copper} />
                <Text style={[styles.cellKey, { marginTop: 4 }]}>{k.toUpperCase()}</Text>
                <Text style={styles.cellVal}>{v}</Text>
              </View>
            ))}
          </View>

          {/* Auspicious timings */}
          <Text style={styles.section}>Timings</Text>
          <View style={styles.timeList}>
            {[
              ["Brahma Muhurta", p.brahmaMuhurta, true],
              ["Abhijit Muhurta", p.abhijitMuhurta, true],
              ["Rahu Kalam", p.rahuKalam, false],
            ].map(([k, v, good]) => (
              <View key={k as string} style={styles.timeRow}>
                <View style={[styles.timeDot, { backgroundColor: good ? colors.lotus : "#C2455E" }]} />
                <Text style={styles.timeKey}>{k}</Text>
                <Text style={styles.timeVal}>{v}</Text>
              </View>
            ))}
          </View>

          {/* Festivals */}
          {p.festivals.length > 0 && (
            <>
              <Text style={styles.section}>Festivals & Observances</Text>
              <View style={styles.festWrap}>
                {p.festivals.map((f) => (
                  <Text key={f.name} style={styles.festPill}>{f.name}</Text>
                ))}
              </View>
            </>
          )}

          <Text style={styles.loc}>{p.location} · computed for Chennai coordinates</Text>
        </ScrollView>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  topBar: { flexDirection: "row", alignItems: "center", paddingHorizontal: 8, paddingBottom: 6 },
  iconBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  topTitle: { flex: 1, fontFamily: fonts.bold, fontSize: 17, color: colors.inkDeep, textAlign: "center" },

  headCard: {
    alignItems: "center",
    backgroundColor: colors.lotusNight,
    borderRadius: radius.xl,
    paddingVertical: 20,
    marginTop: 6,
    ...shadow.card,
  },
  headDay: { fontFamily: fonts.bold, fontSize: 24, color: "#fff" },
  headDate: { fontFamily: fonts.body, fontSize: 14, color: "#cfe3d2", marginTop: 3 },
  highlightPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: radius.pill,
    backgroundColor: "rgba(255,255,255,0.16)",
  },
  highlightText: { fontFamily: fonts.semibold, fontSize: 13, color: "#fff" },

  section: { fontFamily: fonts.bold, fontSize: 16, color: colors.inkDeep, marginTop: 22, marginBottom: 10 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  cell: {
    width: "48%",
    flexGrow: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  cellKey: { fontFamily: fonts.semibold, fontSize: 10, color: colors.copper, letterSpacing: 1 },
  cellVal: { fontFamily: fonts.bold, fontSize: 16, color: colors.inkDeep, marginTop: 3 },

  timeList: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 14,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 13,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.line,
  },
  timeDot: { width: 8, height: 8, borderRadius: 4 },
  timeKey: { flex: 1, fontFamily: fonts.medium, fontSize: 14, color: colors.ink },
  timeVal: { fontFamily: fonts.semibold, fontSize: 13, color: colors.lotusDeep },

  festWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  festPill: {
    fontFamily: fonts.medium,
    fontSize: 12.5,
    color: "#fff",
    backgroundColor: colors.lotusDeep,
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: radius.pill,
    overflow: "hidden",
  },

  loc: { fontFamily: fonts.body, fontSize: 11.5, color: colors.muted, textAlign: "center", marginTop: 24 },
  empty: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  emptyText: { fontFamily: fonts.body, fontSize: 14, color: colors.muted },
});
