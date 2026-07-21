import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Screen from "../../components/Screen";
import { deityImage } from "../../lib/deityImages";
import { getSlokaById } from "../../lib/slokas";
import { clearHighlight, recordChant, setHighlight, setReaderPrefs, toggleFavorite, useStore } from "../../lib/store";
import { colors, fonts, radius, shadow } from "../../theme/theme";

const FONT_STEPS = [0.85, 1, 1.15, 1.3];
const SPEEDS = { slow: 18, medium: 38, fast: 64 } as const;
type Speed = keyof typeof SPEEDS;
type Lang = "tamil" | "english";

// Highlighter palette — solid dot color + translucent marker stroke behind text
const HIGHLIGHTS = [
  { value: "gold", dot: "#E0B84B", marker: "rgba(224,184,75,0.45)" },
  { value: "green", dot: "#43A047", marker: "rgba(67,160,71,0.38)" },
  { value: "rose", dot: "#E0526C", marker: "rgba(224,82,108,0.32)" },
] as const;

const markerOf = (v?: string) => HIGHLIGHTS.find((h) => h.value === v)?.marker;
const dotOf = (v?: string) => HIGHLIGHTS.find((h) => h.value === v)?.dot;

export default function Reader() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const sloka = useMemo(() => (id ? getSlokaById(id) : null), [id]);
  const { favorites, perSlokaCount, dailyCount, dailyTarget, highlights, readerPrefs } = useStore();
  const marks = (id && highlights[id]) || {};

  const { fontIdx, showMeaning, language } = readerPrefs;
  const setFontIdx = (fn: (i: number) => number) => setReaderPrefs({ fontIdx: fn(fontIdx) });
  const setShowMeaning = (fn: (v: boolean) => boolean) => setReaderPrefs({ showMeaning: fn(showMeaning) });
  const setLanguage = (l: Lang) => setReaderPrefs({ language: l });
  const [chanted, setChanted] = useState(false);
  const [active, setActive] = useState(0);
  const [autoScroll, setAutoScroll] = useState(false);
  const [speed, setSpeed] = useState<Speed>("slow");
  const [menuFor, setMenuFor] = useState<number | null>(null);

  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace("/(tabs)/home");
  };

  const scale = FONT_STEPS[Math.min(Math.max(fontIdx, 0), FONT_STEPS.length - 1)] ?? 1;
  const scrollRef = useRef<ScrollView>(null);
  const offsetRef = useRef(0);
  const lineY = useRef<Record<number, number>>({});

  useEffect(() => {
    if (!autoScroll) return;
    const t = setInterval(() => {
      offsetRef.current += SPEEDS[speed] / 20;
      scrollRef.current?.scrollTo({ y: offsetRef.current, animated: false });
    }, 50);
    return () => clearInterval(t);
  }, [autoScroll, speed]);

  if (!sloka) {
    return (
      <View style={[styles.missing, { paddingTop: insets.top }]}>
        <Text style={styles.missingText}>Sloka not found.</Text>
        <Pressable onPress={() => router.replace("/(tabs)/home")} style={styles.missingBtn}>
          <Text style={styles.missingBtnText}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  const favorite = favorites.includes(sloka.id);
  const total = sloka.lines.length;
  const count = perSlokaCount[sloka.id] ?? 0;

  const onChant = () => {
    const minutes = Number.parseInt(sloka.duration, 10) || 5;
    recordChant(sloka.id, minutes);
    setChanted(true);
  };

  const goToLine = (i: number) => {
    const clamped = Math.max(0, Math.min(total - 1, i));
    setActive(clamped);
    const y = lineY.current[clamped];
    if (y != null) {
      offsetRef.current = Math.max(0, y - 110);
      scrollRef.current?.scrollTo({ y: offsetRef.current, animated: true });
    }
  };

  return (
    <Screen>
    <View style={styles.root}>
      {/* Top bar */}
      <View style={[styles.topBar, { paddingTop: insets.top + 6 }]}>
        <Pressable onPress={goBack} hitSlop={12} style={styles.iconBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.inkDeep} />
        </Pressable>
        <Text style={styles.topTitle} numberOfLines={1}>{sloka.title}</Text>
        <Pressable onPress={() => router.push("/(tabs)/search")} hitSlop={12} style={styles.iconBtn}>
          <Ionicons name="search-outline" size={20} color={colors.inkDeep} />
        </Pressable>
        <Pressable onPress={() => toggleFavorite(sloka.id)} hitSlop={12} style={styles.iconBtn}>
          <Ionicons name={favorite ? "heart" : "heart-outline"} size={21} color={favorite ? colors.heart : colors.inkDeep} />
        </Pressable>
      </View>

      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={(e) => { offsetRef.current = e.nativeEvent.contentOffset.y; }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
      >
        {/* Hero with soft halo */}
        <View style={styles.heroWrap}>
          <View style={styles.halo} />
          <View style={styles.ringOuter}>
            <View style={styles.ringInner}>
              <Image source={deityImage(sloka.category)} style={styles.heroImg} contentFit="cover" />
            </View>
          </View>
        </View>

        <Text style={styles.title}>{sloka.title}</Text>
        <Text style={styles.titleTamil}>{sloka.titleTamil}</Text>
        <View style={styles.metaRow}>
          <View style={styles.metaChip}>
            <Ionicons name="time-outline" size={13} color={colors.copper} />
            <Text style={styles.metaChipText}>{sloka.duration}</Text>
          </View>
          <View style={styles.metaChip}>
            <Ionicons name="sparkles-outline" size={13} color={colors.copper} />
            <Text style={styles.metaChipText}>{sloka.category}</Text>
          </View>
        </View>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerDot}>۞</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Verses */}
        <View style={styles.verses}>
          {sloka.lines.map((line, i) => {
            const mark = marks[i];
            const marker = markerOf(mark);
            const isActive = active === i;
            const menuOpen = menuFor === i;
            const mainText = language === "english" ? (line.english || line.tamil) : line.tamil;
            return (
              <View
                key={i}
                style={[styles.verseOuter, menuOpen && styles.verseOuterRaised]}
                onLayout={(e) => { lineY.current[i] = e.nativeEvent.layout.y; }}
              >
                <Pressable
                  onPress={() => { setActive(i); setMenuFor(null); }}
                  style={[styles.verse, isActive && styles.verseActive]}
                >
                  <Text
                    style={[
                      styles.tamil,
                      { fontSize: 16 * scale, lineHeight: 26 * scale },
                      marker && { backgroundColor: marker },
                    ]}
                  >
                    {" "}{mainText}{" "}
                  </Text>
                  {language === "english" && !!line.tamil && (
                    <Text style={[styles.translit, { fontSize: 13 * scale }]}>{line.tamil}</Text>
                  )}
                  {showMeaning && !!line.meaning && (
                    <Text style={[styles.meaning, { fontSize: 12.5 * scale, lineHeight: 19 * scale }]}>{line.meaning}</Text>
                  )}
                </Pressable>

                {/* Overflow "⋯" button on the active verse */}
                {isActive && (
                  <Pressable
                    onPress={() => setMenuFor(menuOpen ? null : i)}
                    hitSlop={10}
                    style={[styles.kebab, (menuOpen || !!mark) && styles.kebabActive]}
                  >
                    <Ionicons
                      name="ellipsis-horizontal"
                      size={18}
                      color={menuOpen ? "#fff" : (dotOf(mark) ?? colors.muted)}
                    />
                  </Pressable>
                )}

                {/* Highlighter popover menu */}
                {menuOpen && (
                  <View style={styles.popover}>
                    <View style={styles.popHeader}>
                      <Ionicons name="brush-outline" size={14} color={colors.copper} />
                      <Text style={styles.popTitle}>Highlight</Text>
                    </View>
                    <View style={styles.popSwatches}>
                      {HIGHLIGHTS.map((h) => {
                        const on = mark === h.value;
                        return (
                          <Pressable
                            key={h.value}
                            onPress={() => { on ? clearHighlight(sloka.id, i) : setHighlight(sloka.id, i, h.value); setMenuFor(null); }}
                            hitSlop={4}
                            style={[styles.swatchWrap, on && { borderColor: h.dot }]}
                          >
                            <View style={[styles.swatch, { backgroundColor: h.dot }]}>
                              {on && <Ionicons name="checkmark" size={15} color="#fff" />}
                            </View>
                          </Pressable>
                        );
                      })}
                    </View>
                    {!!mark && (
                      <Pressable
                        style={styles.popRemove}
                        onPress={() => { clearHighlight(sloka.id, i); setMenuFor(null); }}
                      >
                        <Ionicons name="close-circle-outline" size={16} color={colors.muted} />
                        <Text style={styles.popRemoveText}>Remove highlight</Text>
                      </Pressable>
                    )}
                  </View>
                )}
              </View>
            );
          })}
        </View>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerDot}>۞</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Chant status */}
        {chanted ? (
          <View style={styles.doneCard}>
            <View style={styles.doneIcon}>
              <Ionicons name="checkmark" size={18} color="#fff" />
            </View>
            <View>
              <Text style={styles.doneTitle}>Chanted today</Text>
              <Text style={styles.doneSub}>{dailyCount} of {dailyTarget} chants done</Text>
            </View>
          </View>
        ) : (
          <View style={styles.chantWrap}>
            <Pressable onPress={onChant} style={({ pressed }) => [styles.chantBtn, pressed && styles.chantBtnPressed]}>
              <Ionicons name="flower-outline" size={19} color="#fff" />
              <Text style={styles.chantBtnText}>{"I've chanted this"}</Text>
            </Pressable>
            <Text style={styles.chantHint}>{dailyCount} / {dailyTarget} chants today</Text>
          </View>
        )}

        {count > 0 && <Text style={styles.lifetime}>Chanted {count} time{count !== 1 ? "s" : ""} all-time</Text>}
      </ScrollView>

      {/* Floating control bar */}
      <View style={[styles.controlsOuter, { paddingBottom: insets.bottom + 8 }]}>
        <View style={styles.controls}>
          <View style={styles.ctrlRow}>
            <View style={styles.cellLeft}>
              <View style={styles.seg}>
                <Pressable onPress={() => setLanguage("tamil")} style={[styles.segBtn, language === "tamil" && styles.segBtnActive]}>
                  <Text style={[styles.segText, language === "tamil" && styles.segTextActive]}>தமிழ்</Text>
                </Pressable>
                <Pressable onPress={() => setLanguage("english")} style={[styles.segBtn, language === "english" && styles.segBtnActive]}>
                  <Text style={[styles.segText, language === "english" && styles.segTextActive]}>English</Text>
                </Pressable>
              </View>
            </View>
            <View style={styles.cellCenter}>
              <Pressable onPress={() => setShowMeaning((v) => !v)} style={[styles.pill, showMeaning && styles.pillActive]}>
                <Text style={[styles.pillText, showMeaning && styles.pillTextActive]}>Meaning</Text>
              </Pressable>
            </View>
            <View style={styles.cellRight}>
              <View style={styles.seg}>
                <Pressable onPress={() => setFontIdx((i) => Math.max(0, i - 1))} style={styles.segBtn}>
                  <Text style={[styles.segText, { fontSize: 11 }]}>A</Text>
                </Pressable>
                <Pressable onPress={() => setFontIdx((i) => Math.min(FONT_STEPS.length - 1, i + 1))} style={styles.segBtn}>
                  <Text style={[styles.segText, { fontSize: 15 }]}>A</Text>
                </Pressable>
              </View>
            </View>
          </View>

          <View style={styles.ctrlRow}>
            <View style={styles.cellLeft}>
              <View style={styles.seg}>
                <Pressable onPress={() => goToLine(active - 1)} style={styles.segBtn} disabled={active === 0}>
                  <Ionicons name="chevron-back" size={16} color={active === 0 ? "rgba(255,255,255,0.3)" : "#fff"} />
                </Pressable>
                <Text style={styles.pager}>{active + 1}/{total}</Text>
                <Pressable onPress={() => goToLine(active + 1)} style={styles.segBtn} disabled={active >= total - 1}>
                  <Ionicons name="chevron-forward" size={16} color={active >= total - 1 ? "rgba(255,255,255,0.3)" : "#fff"} />
                </Pressable>
              </View>
            </View>
            <View style={styles.cellCenter}>
              <Pressable onPress={() => setAutoScroll((v) => !v)} style={[styles.pill, autoScroll && styles.pillActive]}>
                <Ionicons name={autoScroll ? "pause" : "play"} size={12} color={autoScroll ? colors.lotusNight : "rgba(255,255,255,0.85)"} />
                <Text style={[styles.pillText, autoScroll && styles.pillTextActive]}>Scroll</Text>
              </Pressable>
            </View>
            <View style={styles.cellRight}>
              <View style={styles.seg}>
                {(["slow", "medium", "fast"] as Speed[]).map((s) => (
                  <Pressable key={s} onPress={() => setSpeed(s)} style={[styles.segBtn, speed === s && styles.segBtnActive]}>
                    <Text style={[styles.segText, speed === s && styles.segTextActive]}>{s === "medium" ? "Med" : s[0].toUpperCase() + s.slice(1)}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "transparent" },
  topBar: { flexDirection: "row", alignItems: "center", paddingHorizontal: 8, paddingBottom: 6, gap: 2 },
  iconBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  topTitle: { flex: 1, fontFamily: fonts.semibold, fontSize: 15, color: colors.inkDeep, textAlign: "center" },

  heroWrap: { alignItems: "center", justifyContent: "center", marginTop: 8, marginBottom: 4, height: 224 },
  halo: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: colors.halo,
    transform: [{ scale: 1.05 }],
  },
  ringOuter: {
    width: 210,
    height: 210,
    borderRadius: 105,
    borderWidth: 2,
    borderColor: colors.goldSoft,
    padding: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  ringInner: {
    width: "100%",
    height: "100%",
    borderRadius: 96,
    borderWidth: 2.5,
    borderColor: colors.gold,
    overflow: "hidden",
    backgroundColor: colors.surface,
  },
  heroImg: { width: "100%", height: "100%" },

  title: { fontFamily: fonts.bold, fontSize: 20, color: colors.inkDeep, textAlign: "center", marginTop: 10 },
  titleTamil: { fontFamily: fonts.tamilBold, fontSize: 13, color: colors.lotusDeep, textAlign: "center", marginTop: 2 },
  metaRow: { flexDirection: "row", justifyContent: "center", gap: 6, marginTop: 8 },
  metaChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  metaChipText: { fontFamily: fonts.medium, fontSize: 11, color: colors.copper },

  divider: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 9, marginTop: 12, marginBottom: 4 },
  dividerLine: { width: 48, height: 1, backgroundColor: colors.goldSoft },
  dividerDot: { color: colors.copper, fontSize: 13 },

  verses: { marginTop: 6 },
  verseOuter: { position: "relative", marginBottom: 2 },
  verseOuterRaised: { zIndex: 30 },
  verse: { paddingVertical: 14, paddingHorizontal: 16, alignItems: "center", borderRadius: radius.lg },
  verseActive: { backgroundColor: colors.surface, ...shadow.card },
  tamil: { fontFamily: fonts.tamilBold, color: colors.lotusDeep, textAlign: "center", borderRadius: 4 },
  translit: { fontFamily: fonts.medium, color: colors.copper, textAlign: "center", marginTop: 4 },
  meaning: { fontFamily: fonts.body, color: colors.muted, textAlign: "center", marginTop: 6 },

  kebab: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.paperWarm,
    borderWidth: 1,
    borderColor: colors.line,
  },
  kebabActive: { backgroundColor: colors.lotus, borderColor: colors.lotus },
  popover: {
    position: "absolute",
    top: 40,
    right: 8,
    zIndex: 40,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 10,
    ...shadow.cta,
    elevation: 10,
  },
  popHeader: { flexDirection: "row", alignItems: "center", gap: 6 },
  popTitle: { fontFamily: fonts.semibold, fontSize: 12, color: colors.inkDeep, letterSpacing: 0.3 },
  popSwatches: { flexDirection: "row", gap: 12 },
  swatchWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 2,
    borderColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  swatch: { width: 26, height: 26, borderRadius: 13, alignItems: "center", justifyContent: "center" },
  popRemove: { flexDirection: "row", alignItems: "center", gap: 6, paddingTop: 8, borderTopWidth: 1, borderTopColor: colors.line },
  popRemoveText: { fontFamily: fonts.medium, fontSize: 12.5, color: colors.muted },

  chantWrap: { alignItems: "center", marginTop: 8 },
  chantBtn: {
    flexDirection: "row",
    alignSelf: "stretch",
    backgroundColor: colors.lotusDeep,
    borderRadius: radius.pill,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    ...shadow.cta,
  },
  chantBtnPressed: { backgroundColor: colors.lotusNight, transform: [{ scale: 0.99 }] },
  chantBtnText: { fontFamily: fonts.semibold, fontSize: 16, color: "#fff" },
  chantHint: { fontFamily: fonts.body, fontSize: 12.5, color: colors.muted, marginTop: 9 },

  doneCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "rgba(46,125,50,0.1)",
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 14,
  },
  doneIcon: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.lotus, alignItems: "center", justifyContent: "center" },
  doneTitle: { fontFamily: fonts.bold, fontSize: 15, color: colors.inkDeep },
  doneSub: { fontFamily: fonts.body, fontSize: 12.5, color: colors.muted, marginTop: 1 },
  lifetime: { fontFamily: fonts.body, fontSize: 11.5, color: colors.muted, textAlign: "center", marginTop: 12 },

  controlsOuter: { paddingHorizontal: 14, paddingTop: 4, backgroundColor: "transparent" },
  controls: {
    backgroundColor: colors.lotusNight,
    paddingHorizontal: 12,
    paddingVertical: 9,
    gap: 8,
    borderRadius: radius.xl,
    ...shadow.cta,
  },
  ctrlRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  cellLeft: { alignItems: "center" },
  cellCenter: { alignItems: "center" },
  cellRight: { alignItems: "center" },
  seg: { flexDirection: "row", backgroundColor: "rgba(255,255,255,0.18)", borderRadius: radius.pill, padding: 2 },
  segBtn: { paddingHorizontal: 9, paddingVertical: 5, borderRadius: radius.pill, alignItems: "center", justifyContent: "center", minWidth: 28 },
  segBtnActive: { backgroundColor: "#fff" },
  segText: { fontFamily: fonts.semibold, fontSize: 11.5, color: "rgba(255,255,255,0.85)" },
  segTextActive: { color: colors.lotusNight },
  pager: { fontFamily: fonts.semibold, fontSize: 11.5, color: "#fff", paddingHorizontal: 7, alignSelf: "center" },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: "rgba(255,255,255,0.13)",
  },
  pillActive: { backgroundColor: "#fff" },
  pillText: { fontFamily: fonts.semibold, fontSize: 11.5, color: "rgba(255,255,255,0.85)" },
  pillTextActive: { color: colors.lotusNight },

  missing: { flex: 1, alignItems: "center", justifyContent: "center", gap: 14, backgroundColor: colors.paper },
  missingText: { fontFamily: fonts.semibold, fontSize: 16, color: colors.ink },
  missingBtn: { backgroundColor: colors.lotusDeep, borderRadius: radius.pill, paddingHorizontal: 20, paddingVertical: 10 },
  missingBtnText: { fontFamily: fonts.semibold, color: "#fff" },
});
