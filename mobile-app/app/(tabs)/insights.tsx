import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Circle, Rect } from "react-native-svg";
import Screen from "../../components/Screen";
import { getSlokaSummaries } from "../../lib/slokas";
import { useStore } from "../../lib/store";
import { colors, fonts, radius, shadow } from "../../theme/theme";

const RING = 120;
const STROKE = 11;

function Ring({ value, target, color, track, label, unit }: {
  value: number; target: number; color: string; track: string; label: string; unit: string;
}) {
  const r = (RING - STROKE) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.min(1, value / Math.max(1, target));
  return (
    <View style={ringStyles.wrap}>
      <Svg width={RING} height={RING}>
        <Circle cx={RING / 2} cy={RING / 2} r={r} stroke={track} strokeWidth={STROKE} fill="none" />
        <Circle
          cx={RING / 2}
          cy={RING / 2}
          r={r}
          stroke={color}
          strokeWidth={STROKE}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${c * pct} ${c}`}
          transform={`rotate(-90 ${RING / 2} ${RING / 2})`}
        />
      </Svg>
      <View style={ringStyles.center}>
        <Text style={ringStyles.value}>
          {value}
          <Text style={ringStyles.target}> / {target}</Text>
        </Text>
        <Text style={ringStyles.unit}>{unit}</Text>
      </View>
      <Text style={[ringStyles.label, { color }]}>{label}</Text>
    </View>
  );
}

const ringStyles = StyleSheet.create({
  wrap: { alignItems: "center", flex: 1 },
  center: { position: "absolute", top: 0, width: RING, height: RING, alignItems: "center", justifyContent: "center" },
  value: { fontFamily: fonts.bold, fontSize: 26, color: colors.inkDeep },
  target: { fontFamily: fonts.body, fontSize: 14, color: colors.muted },
  unit: { fontFamily: fonts.body, fontSize: 11.5, color: colors.muted, marginTop: 1 },
  label: { fontFamily: fonts.semibold, fontSize: 13, marginTop: 8 },
});

function dayKey(t: number): string {
  return new Date(t).toISOString().slice(0, 10);
}

export default function Insights() {
  const insets = useSafeAreaInsets();
  const { dailyCount, dailyTarget, streak, totalCount, settings, chantLog } = useStore();
  const all = useMemo(() => getSlokaSummaries(), []);

  const todayMinutes = useMemo(() => {
    const k = dayKey(Date.now());
    return chantLog.filter((e) => dayKey(e.t) === k).reduce((s, e) => s + e.min, 0);
  }, [chantLog]);

  const totalMinutes = useMemo(() => chantLog.reduce((s, e) => s + e.min, 0), [chantLog]);

  // Last 7 days chant counts for the bar chart
  const week = useMemo(() => {
    const days: { label: string; count: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86_400_000);
      const k = d.toISOString().slice(0, 10);
      days.push({
        label: d.toLocaleDateString("en-US", { weekday: "narrow" }),
        count: chantLog.filter((e) => dayKey(e.t) === k).length,
      });
    }
    return days;
  }, [chantLog]);

  const maxCount = Math.max(1, ...week.map((d) => d.count));
  const recent = chantLog.slice(0, 5);

  const titleOf = (id: string) => all.find((s) => s.id === id)?.title ?? id;

  return (
    <Screen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: insets.top + 16, paddingHorizontal: 20, paddingBottom: 24 }}
      >
        <Text style={styles.title}>{"Today's Progress"}</Text>
        <Text style={styles.sub}>Your progress toward {"today's"} goals 🌿</Text>

        {/* Rings */}
        <View style={styles.ringsCard}>
          <Ring
            value={dailyCount}
            target={dailyTarget}
            color={colors.lotus}
            track="rgba(46,125,50,0.13)"
            label="Chant Count"
            unit="chants"
          />
          <Ring
            value={todayMinutes}
            target={settings.dailyMinutes}
            color={colors.amberDeep}
            track="rgba(231,150,7,0.15)"
            label="Chant Time"
            unit="min"
          />
        </View>
        <View style={styles.motivate}>
          <Text style={styles.motivateText}>
            {dailyCount >= dailyTarget
              ? "🎉 Goal complete! Beautiful practice today."
              : "🌿 You're doing great! Keep going."}
          </Text>
        </View>

        {/* Totals */}
        <View style={styles.totalsRow}>
          {[
            { icon: "leaf-outline" as const, val: String(totalCount), label: "Total Chants", color: colors.lotus },
            { icon: "time-outline" as const, val: `${totalMinutes} min`, label: "Total Time", color: colors.amberDeep },
            { icon: "flame-outline" as const, val: String(streak), label: "Day Streak", color: colors.copper },
          ].map((s) => (
            <View key={s.label} style={styles.totalCell}>
              <Ionicons name={s.icon} size={17} color={s.color} />
              <Text style={styles.totalVal}>{s.val}</Text>
              <Text style={styles.totalLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Weekly bar chart */}
        <Text style={styles.section}>This Week</Text>
        <View style={styles.chartCard}>
          <Svg width="100%" height={110} viewBox="0 0 280 110">
            {week.map((d, i) => {
              const h = Math.max(4, (d.count / maxCount) * 80);
              return (
                <Rect
                  key={i}
                  x={12 + i * 38}
                  y={92 - h}
                  width={18}
                  height={h}
                  rx={4}
                  fill={i === 6 ? colors.lotus : "rgba(46,125,50,0.35)"}
                />
              );
            })}
          </Svg>
          <View style={styles.chartLabels}>
            {week.map((d, i) => (
              <Text key={i} style={[styles.chartLabel, i === 6 && { color: colors.lotus, fontFamily: fonts.semibold }]}>
                {d.label}
              </Text>
            ))}
          </View>
        </View>

        {/* Recent activity */}
        <Text style={styles.section}>Recent Activity</Text>
        {recent.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="flower-outline" size={30} color={colors.goldSoft} />
            <Text style={styles.emptyText}>No chants yet today. Open a sloka and begin 🙏</Text>
          </View>
        ) : (
          <View style={styles.activityCard}>
            {recent.map((e, i) => (
              <View key={`${e.t}-${i}`} style={[styles.activityRow, i > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.line }]}>
                <View style={styles.activityIcon}>
                  <Ionicons name="leaf-outline" size={15} color={colors.lotus} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.activityTitle} numberOfLines={1}>{titleOf(e.id)}</Text>
                  <Text style={styles.activityMeta}>
                    {new Date(e.t).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })} · {e.min} min · 1 chant
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Consistency note */}
        <View style={styles.noteCard}>
          <Ionicons name="trending-up-outline" size={20} color={colors.lotus} />
          <Text style={styles.noteText}>Consistency is the key to transformation. {"We're"} here to support your sacred journey.</Text>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontFamily: fonts.bold, fontSize: 24, color: colors.inkDeep, textAlign: "center" },
  sub: { fontFamily: fonts.body, fontSize: 13, color: colors.muted, textAlign: "center", marginTop: 4, marginBottom: 18 },

  ringsCard: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.line,
    paddingVertical: 18,
    ...shadow.card,
  },
  motivate: { alignItems: "center", marginTop: 12 },
  motivateText: { fontFamily: fonts.medium, fontSize: 13, color: colors.lotusDeep },

  totalsRow: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
    paddingVertical: 14,
    marginTop: 16,
  },
  totalCell: { flex: 1, alignItems: "center", gap: 3 },
  totalVal: { fontFamily: fonts.bold, fontSize: 17, color: colors.inkDeep },
  totalLabel: { fontFamily: fonts.body, fontSize: 11, color: colors.muted },

  section: { fontFamily: fonts.bold, fontSize: 16, color: colors.inkDeep, marginTop: 22, marginBottom: 10 },
  chartCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
    paddingTop: 10,
    paddingBottom: 8,
    paddingHorizontal: 6,
  },
  chartLabels: { flexDirection: "row", justifyContent: "space-around", paddingHorizontal: 8 },
  chartLabel: { fontFamily: fonts.body, fontSize: 11, color: colors.muted, width: 20, textAlign: "center" },

  activityCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 14,
  },
  activityRow: { flexDirection: "row", alignItems: "center", gap: 11, paddingVertical: 11 },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.halo,
    alignItems: "center",
    justifyContent: "center",
  },
  activityTitle: { fontFamily: fonts.semibold, fontSize: 13.5, color: colors.ink },
  activityMeta: { fontFamily: fonts.body, fontSize: 11.5, color: colors.muted, marginTop: 1 },

  empty: { alignItems: "center", gap: 10, paddingVertical: 24 },
  emptyText: { fontFamily: fonts.body, fontSize: 13, color: colors.muted },

  noteCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "rgba(46,125,50,0.07)",
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 14,
    marginTop: 22,
  },
  noteText: { flex: 1, fontFamily: fonts.body, fontSize: 12.5, color: colors.inkSoft, lineHeight: 18 },
});
