import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SETUP_LIBRARY_ICON, SETUP_RITUAL_ICON } from "../lib/deityImages";
import { setSettings } from "../lib/store";
import { colors, fonts, radius, shadow } from "../theme/theme";

// Shared "Set Up Ritual / Explore Library" choice cards — used both by the
// one-time entry flow (app/welcome.tsx) and the always-available "Journey"
// tab, so returning users can revisit this choice without seeing the
// misty entry scene again.
export default function JourneyChoices() {
  const router = useRouter();

  const goSetup = () => {
    setSettings({ welcomeSeen: true });
    router.push("/setup");
  };

  const goExplore = () => {
    setSettings({ welcomeSeen: true });
    router.push("/(tabs)/explore");
  };

  return (
    <View>
      {/* Set Up Ritual */}
      <View style={[styles.choice, { backgroundColor: "rgba(235, 243, 232, 0.86)" }]}>
        <Image source={SETUP_RITUAL_ICON} style={styles.choiceImg} contentFit="contain" />
        <View style={styles.choiceBody}>
          <Text style={[styles.choiceTitle, { color: colors.lotusNight }]}>Set Up Ritual</Text>
          <Text style={styles.choiceDesc}>
            Personalize your chanting journey. Set goals, choose duration, and create your daily ritual.
          </Text>
          <Pressable style={[styles.choiceBtn, { backgroundColor: colors.lotusDeep }]} onPress={goSetup}>
            <Text style={styles.choiceBtnText}>Set Up My Ritual</Text>
          </Pressable>
        </View>
      </View>

      {/* Explore Library */}
      <View style={[styles.choice, { backgroundColor: "rgba(251, 241, 223, 0.86)" }]}>
        <Image source={SETUP_LIBRARY_ICON} style={styles.choiceImg} contentFit="contain" />
        <View style={styles.choiceBody}>
          <Text style={[styles.choiceTitle, { color: colors.copper }]}>Explore Library</Text>
          <Text style={styles.choiceDesc}>
            Browse a rich collection of slokas by deity, purpose, category, or mood.
          </Text>
          <Pressable style={[styles.choiceBtn, { backgroundColor: colors.amber }]} onPress={goExplore}>
            <Text style={styles.choiceBtnText}>Explore Library</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  choice: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: radius.lg,
    padding: 16,
    marginBottom: 18,
    gap: 14,
    ...shadow.card,
  },
  choiceImg: { width: 92, height: 110 },
  choiceBody: { flex: 1 },
  choiceTitle: { fontFamily: fonts.bold, fontSize: 20 },
  choiceDesc: { fontFamily: fonts.body, fontSize: 13, color: colors.muted, marginTop: 6, lineHeight: 20 },
  choiceBtn: {
    alignSelf: "flex-start",
    borderRadius: radius.pill,
    paddingHorizontal: 18,
    paddingVertical: 11,
    marginTop: 14,
  },
  choiceBtnText: { fontFamily: fonts.semibold, fontSize: 14, color: "#fff" },
});
