import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Screen from "../components/Screen";
import { getStoredName, setStoredName } from "../lib/profile";
import { setDailyTarget, setReaderPrefs, setSettings, useStore } from "../lib/store";
import { colors, fonts, radius, shadow } from "../theme/theme";

type RitualStyle = "calm" | "count" | "timed";
type Reminder = "morning" | "evening" | "custom" | "none";

const STEP_TITLES = ["Welcome! Let's get started.", "Shape your daily practice"];
const STEP_SUBS = [
  "Set up your ritual — you can change any of this anytime.",
  "Pick a chanting style and when you'd like a nudge.",
];
const STEP_TABS = ["Basics", "Practice"];
const LAST_STEP = STEP_TITLES.length - 1;

export default function Setup() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { dailyTarget, settings, readerPrefs } = useStore();

  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [chants, setChants] = useState(dailyTarget);
  const [minutes, setMinutes] = useState(settings.dailyMinutes);
  const [language, setLanguage] = useState<"tamil" | "english">(readerPrefs.language);
  const [showMeaning, setShowMeaning] = useState(readerPrefs.showMeaning);
  const [style, setStyle] = useState<RitualStyle>(settings.ritualStyle);
  const [autoScroll, setAutoScroll] = useState(settings.autoScroll);
  const [speed, setSpeed] = useState<"slow" | "medium" | "fast">(settings.scrollSpeed);
  const [reminder, setReminder] = useState<Reminder>(settings.reminder);
  const [hoveredStyle, setHoveredStyle] = useState<RitualStyle | null>(null);

  useEffect(() => {
    getStoredName().then((n) => n && setName(n));
  }, []);

  const finish = async () => {
    await setStoredName(name);
    setDailyTarget(chants);
    setReaderPrefs({ language, showMeaning });
    setSettings({ dailyMinutes: minutes, ritualStyle: style, autoScroll, scrollSpeed: speed, reminder, setupDone: true });
    router.replace("/(tabs)/home");
  };

  const next = () => (step < LAST_STEP ? setStep(step + 1) : finish());
  const back = () => (step > 0 ? setStep(step - 1) : router.back());

  return (
    <Screen scene>
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      {/* Header: back + small step tabs */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <Pressable onPress={back} hitSlop={12} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={colors.inkDeep} />
        </Pressable>
        <View style={styles.tabsWrap}>
          {STEP_TABS.map((label, i) => (
            <Pressable key={label} onPress={() => setStep(i)} style={[styles.tab, i === step && styles.tabActive]}>
              <Text style={[styles.tabText, i === step && styles.tabTextActive]}>{label}</Text>
            </Pressable>
          ))}
        </View>
        <View style={styles.backBtn} />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>{STEP_TITLES[step]}</Text>
        <Text style={styles.sub}>{STEP_SUBS[step]}</Text>

        {step === 0 && (
          <>
            <Text style={styles.fieldLabel}>What should we call you?</Text>
            <Text style={styles.fieldHint}>This will be used to personalize your experience.</Text>
            <View style={styles.field}>
              <Ionicons name="person-outline" size={18} color={colors.muted} style={{ marginRight: 10 }} />
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
                placeholderTextColor={colors.muted}
                style={styles.input}
                maxLength={40}
              />
            </View>

            <Text style={[styles.fieldLabel, { marginTop: 26 }]}>Set your daily goals</Text>
            <Text style={styles.fieldHint}>These goals will help you build a consistent ritual.</Text>

            <View style={styles.goalRow}>
              <View style={[styles.goalCard, styles.goalCardHalf]}>
                <View style={styles.goalHead}>
                  <Ionicons name="leaf-outline" size={14} color={colors.lotus} />
                  <Text style={styles.goalTitle}>Chants / day</Text>
                </View>
                <Slider
                  style={styles.slider}
                  minimumValue={1}
                  maximumValue={51}
                  step={1}
                  value={chants}
                  onValueChange={setChants}
                  minimumTrackTintColor={colors.lotus}
                  maximumTrackTintColor={colors.line}
                  thumbTintColor={colors.lotusDeep}
                />
                <View style={styles.sliderEnds}>
                  <Text style={styles.sliderEndText}>1</Text>
                  <Text style={styles.goalValue}>{chants}</Text>
                  <Text style={styles.sliderEndText}>51</Text>
                </View>
              </View>

              <View style={[styles.goalCard, styles.goalCardHalf]}>
                <View style={styles.goalHead}>
                  <Ionicons name="time-outline" size={14} color={colors.amberDeep} />
                  <Text style={styles.goalTitle}>Minutes / day</Text>
                </View>
                <Slider
                  style={styles.slider}
                  minimumValue={5}
                  maximumValue={180}
                  step={5}
                  value={minutes}
                  onValueChange={setMinutes}
                  minimumTrackTintColor={colors.amberDeep}
                  maximumTrackTintColor={colors.line}
                  thumbTintColor={colors.copper}
                />
                <View style={styles.sliderEnds}>
                  <Text style={styles.sliderEndText}>5</Text>
                  <Text style={styles.goalValue}>{minutes}</Text>
                  <Text style={styles.sliderEndText}>180</Text>
                </View>
              </View>
            </View>

            <Text style={[styles.fieldLabel, { marginTop: 26 }]}>Select your preferred language</Text>
            {[
              { key: "tamil" as const, main: "தமிழ்", sub: "Tamil" },
              { key: "english" as const, main: "English", sub: "Transliteration" },
            ].map((l) => (
              <Pressable
                key={l.key}
                onPress={() => setLanguage(l.key)}
                style={[styles.option, language === l.key && styles.optionActive]}
              >
                <View style={styles.optionIcon}>
                  <Text style={{ fontFamily: fonts.tamilBold, fontSize: 15, color: colors.lotus }}>
                    {l.key === "tamil" ? "அ" : "A"}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.optionTitle}>{l.main}</Text>
                  <Text style={styles.optionSub}>{l.sub}</Text>
                </View>
                <Ionicons
                  name={language === l.key ? "checkmark-circle" : "ellipse-outline"}
                  size={22}
                  color={language === l.key ? colors.lotus : colors.line}
                />
              </Pressable>
            ))}

            <Text style={[styles.fieldLabel, { marginTop: 24 }]}>How would you like to view slokas?</Text>
            <Text style={styles.fieldHint}>You can change this anytime.</Text>
            <View style={styles.viewRow}>
              <Pressable onPress={() => setShowMeaning(false)} style={[styles.viewCard, !showMeaning && styles.viewCardActive]}>
                <Text style={styles.viewTitle}>Text only</Text>
                <Text style={styles.viewSub}>Just the sloka lines</Text>
                {!showMeaning && <Ionicons name="checkmark-circle" size={18} color={colors.lotus} style={styles.viewCheck} />}
              </Pressable>
              <Pressable onPress={() => setShowMeaning(true)} style={[styles.viewCard, showMeaning && styles.viewCardActive]}>
                <Text style={styles.viewTitle}>With meaning</Text>
                <Text style={styles.viewSub}>Lines + English meaning</Text>
                {showMeaning && <Ionicons name="checkmark-circle" size={18} color={colors.lotus} style={styles.viewCheck} />}
              </Pressable>
            </View>
          </>
        )}

        {step === 1 && (
          <>
            <Text style={styles.fieldLabel}>Choose your chanting style</Text>
            <Text style={styles.fieldHint}>Hover a box to see what it's best for.</Text>
            <View style={styles.styleRow}>
              {[
                { key: "calm" as const, title: "Calm Mode", accent: "Slow & mindful", hint: "Perfect for deep focus and inner peace.", icon: "leaf-outline" as const },
                { key: "count" as const, title: "Count Mode", accent: "Repetitions", hint: "Ideal for sankalpa and building consistency.", icon: "sync-outline" as const },
                { key: "timed" as const, title: "Timed Mode", accent: "By minutes", hint: "Great for fitting chanting into a busy day.", icon: "time-outline" as const },
              ].map((m) => {
                const active = style === m.key;
                const hovered = hoveredStyle === m.key;
                return (
                  <Pressable
                    key={m.key}
                    onPress={() => setStyle(m.key)}
                    onHoverIn={() => setHoveredStyle(m.key)}
                    onHoverOut={() => setHoveredStyle((k) => (k === m.key ? null : k))}
                    style={[styles.styleBox, active && styles.styleBoxActive]}
                  >
                    {active && (
                      <Ionicons
                        name="checkmark-circle"
                        size={15}
                        color={colors.lotus}
                        style={styles.styleCheck}
                      />
                    )}
                    <Ionicons name={m.icon} size={20} color={colors.lotus} />
                    <Text style={styles.styleTitle}>{m.title}</Text>
                    <Text style={styles.styleAccent}>{m.accent}</Text>
                    {hovered && (
                      <View style={styles.styleHintOverlay}>
                        <Text style={styles.styleHint} numberOfLines={4}>{m.hint}</Text>
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </View>

            <Text style={[styles.fieldLabel, { marginTop: 24 }]}>Customize your experience</Text>
            <Text style={styles.fieldHint}>You can change these anytime in Settings.</Text>
            <View style={styles.toggleCard}>
              <View style={styles.toggleRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.goalTitle}>Auto-scroll by default</Text>
                  <Text style={styles.goalHint}>Slokas will scroll automatically while chanting.</Text>
                </View>
                <Switch
                  value={autoScroll}
                  onValueChange={setAutoScroll}
                  trackColor={{ false: "#d8d2c4", true: colors.lotus }}
                  thumbColor="#fff"
                />
              </View>
              <View style={[styles.toggleRow, { borderTopWidth: 1, borderTopColor: colors.line }]}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.goalTitle}>Default scroll speed</Text>
                </View>
                <View style={styles.speedSeg}>
                  {(["slow", "medium", "fast"] as const).map((s) => (
                    <Pressable key={s} onPress={() => setSpeed(s)} style={[styles.speedBtn, speed === s && styles.speedBtnActive]}>
                      <Text style={[styles.speedText, speed === s && styles.speedTextActive]}>
                        {s === "medium" ? "Medium" : s[0].toUpperCase() + s.slice(1)}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            </View>

            <Text style={[styles.fieldLabel, { marginTop: 24 }]}>When should we remind you?</Text>
            {[
              { key: "morning" as const, title: "Morning", sub: "Start your day with divine energy", time: "7:00 AM", icon: "sunny-outline" as const },
              { key: "evening" as const, title: "Evening", sub: "Unwind and reflect after your day", time: "8:00 PM", icon: "partly-sunny-outline" as const },
              { key: "custom" as const, title: "Custom time", sub: "Choose a time that works for you", time: "Set custom time", icon: "moon-outline" as const },
              { key: "none" as const, title: "I'll do it without reminders", sub: "I prefer to practice on my own", time: "", icon: "notifications-off-outline" as const },
            ].map((r) => (
              <Pressable key={r.key} onPress={() => setReminder(r.key)} style={[styles.option, reminder === r.key && styles.optionActive]}>
                <View style={styles.optionIcon}>
                  <Ionicons name={r.icon} size={18} color={colors.amberDeep} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.optionTitle}>{r.title}</Text>
                  <Text style={styles.optionSub}>{r.sub}</Text>
                  {!!r.time && (
                    <Text style={styles.optionTime}>
                      <Ionicons name="time-outline" size={11} color={colors.muted} /> {r.time}
                    </Text>
                  )}
                </View>
                <Ionicons
                  name={reminder === r.key ? "checkmark-circle" : "ellipse-outline"}
                  size={22}
                  color={reminder === r.key ? colors.lotus : colors.line}
                />
              </Pressable>
            ))}
            <Text style={styles.reminderNote}>
              Reminders are saved as a preference for now — notification delivery arrives with the full app build.
            </Text>
          </>
        )}
      </ScrollView>

      {/* Footer CTA */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 14 }]}>
        <Pressable style={styles.cta} onPress={next}>
          <Text style={styles.ctaText}>{step === LAST_STEP ? "Complete Setup" : "Continue"}</Text>
          <Ionicons name="arrow-forward" size={17} color="#fff" />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "transparent" },
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: 10, paddingBottom: 10 },
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  tabsWrap: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    backgroundColor: colors.cream,
    borderRadius: radius.pill,
    padding: 3,
    alignSelf: "center",
  },
  tab: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: radius.pill },
  tabActive: { backgroundColor: colors.lotusDeep },
  tabText: { fontFamily: fonts.medium, fontSize: 12, color: colors.muted },
  tabTextActive: { fontFamily: fonts.semibold, color: "#fff" },

  title: { fontFamily: fonts.bold, fontSize: 25, color: colors.inkDeep, textAlign: "center", marginTop: 8 },
  sub: { fontFamily: fonts.body, fontSize: 13.5, color: colors.muted, textAlign: "center", marginTop: 8, lineHeight: 20, marginBottom: 20 },

  fieldLabel: { fontFamily: fonts.semibold, fontSize: 14, color: colors.inkDeep, marginBottom: 4 },
  fieldHint: { fontFamily: fonts.body, fontSize: 12, color: colors.muted, marginBottom: 12 },
  field: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    paddingHorizontal: 18,
    paddingVertical: 13,
    borderWidth: 1,
    borderColor: colors.line,
    ...shadow.card,
  },
  input: { flex: 1, fontFamily: fonts.medium, fontSize: 15, color: colors.ink, padding: 0 },

  goalRow: { flexDirection: "row", gap: 10, marginBottom: 12 },
  goalCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 10,
    marginBottom: 12,
  },
  goalCardHalf: { flex: 1, marginBottom: 0 },
  goalHead: { flexDirection: "row", gap: 6, alignItems: "center" },
  goalTitle: { fontFamily: fonts.semibold, fontSize: 11.5, color: colors.ink },
  goalHint: { fontFamily: fonts.body, fontSize: 11.5, color: colors.muted, marginTop: 2 },
  goalValue: { fontFamily: fonts.bold, fontSize: 14, color: colors.inkDeep },
  slider: { width: "100%", height: 34, marginTop: 6 },
  sliderEnds: { flexDirection: "row", justifyContent: "space-between", marginTop: -2 },
  sliderEndText: { fontFamily: fonts.body, fontSize: 10.5, color: colors.muted },

  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.line,
    padding: 13,
    marginBottom: 10,
  },
  optionActive: { borderColor: colors.lotus, backgroundColor: "rgba(46,125,50,0.05)" },
  optionIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.halo,
    alignItems: "center",
    justifyContent: "center",
  },
  optionTitle: { fontFamily: fonts.semibold, fontSize: 14.5, color: colors.ink },
  optionAccent: { fontFamily: fonts.medium, fontSize: 12, color: colors.amberDeep, marginTop: 1 },
  optionSub: { fontFamily: fonts.body, fontSize: 12, color: colors.muted, marginTop: 2 },
  optionTime: { fontFamily: fonts.body, fontSize: 11.5, color: colors.muted, marginTop: 4 },

  styleRow: { flexDirection: "row", gap: 10, marginBottom: 4 },
  styleBox: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.line,
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    gap: 2,
  },
  styleBoxActive: { borderColor: colors.lotus, backgroundColor: "rgba(46,125,50,0.05)" },
  styleCheck: { position: "absolute", top: 6, right: 6 },
  styleTitle: { fontFamily: fonts.semibold, fontSize: 12, color: colors.ink, textAlign: "center", marginTop: 2 },
  styleAccent: { fontFamily: fonts.body, fontSize: 10.5, color: colors.amberDeep, textAlign: "center" },
  styleHintOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(46,60,42,0.92)",
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
  },
  styleHint: { fontFamily: fonts.body, fontSize: 10.5, color: "#fff", textAlign: "center", lineHeight: 14 },

  viewRow: { flexDirection: "row", gap: 10 },
  viewCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.line,
    padding: 13,
  },
  viewCardActive: { borderColor: colors.lotus, backgroundColor: "rgba(46,125,50,0.05)" },
  viewTitle: { fontFamily: fonts.semibold, fontSize: 13.5, color: colors.ink },
  viewSub: { fontFamily: fonts.body, fontSize: 11.5, color: colors.muted, marginTop: 3 },
  viewCheck: { position: "absolute", top: 8, right: 8 },

  toggleCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 14,
  },
  toggleRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 13 },
  speedSeg: { flexDirection: "row", backgroundColor: colors.cream, borderRadius: radius.pill, padding: 3 },
  speedBtn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: radius.pill },
  speedBtnActive: { backgroundColor: colors.lotusNight },
  speedText: { fontFamily: fonts.medium, fontSize: 12, color: colors.ink },
  speedTextActive: { color: "#fff" },

  reminderNote: { fontFamily: fonts.body, fontSize: 11.5, color: colors.muted, textAlign: "center", marginTop: 8, lineHeight: 17 },

  footer: { paddingHorizontal: 24, paddingTop: 10 },
  cta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.lotusDeep,
    borderRadius: radius.pill,
    paddingVertical: 15,
    ...shadow.cta,
  },
  ctaText: { fontFamily: fonts.semibold, fontSize: 16, color: "#fff" },
});
