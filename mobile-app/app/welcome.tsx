import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Screen from "../components/Screen";
import { SETUP_LIBRARY_ICON, SETUP_RITUAL_ICON } from "../lib/deityImages";
import { colors, fonts, radius, shadow } from "../theme/theme";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
}

export default function Welcome() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <Screen scene>
    <ScrollView
      style={styles.root}
      contentContainerStyle={{ paddingTop: insets.top + 20, paddingBottom: insets.bottom + 28, paddingHorizontal: 20 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.om}>ॐ</Text>
        <Text style={styles.greeting}>{greeting()}</Text>
        <Text style={styles.sub}>Begin your spiritual journey today</Text>
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerDot}>۞</Text>
          <View style={styles.dividerLine} />
        </View>
      </View>

      {/* Set Up Ritual */}
      <View style={[styles.choice, { backgroundColor: "rgba(235, 243, 232, 0.86)" }]}>
        <Image source={SETUP_RITUAL_ICON} style={styles.choiceImg} contentFit="contain" />
        <View style={styles.choiceBody}>
          <Text style={[styles.choiceTitle, { color: colors.lotusNight }]}>Set Up Ritual</Text>
          <Text style={styles.choiceDesc}>
            Personalize your chanting journey. Set goals, choose duration, and create your daily ritual.
          </Text>
          <Pressable style={[styles.choiceBtn, { backgroundColor: colors.lotusDeep }]} onPress={() => router.push("/setup")}>
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
          <Pressable
            style={[styles.choiceBtn, { backgroundColor: colors.amber }]}
            onPress={() => router.replace("/(tabs)/explore")}
          >
            <Text style={styles.choiceBtnText}>Explore Library</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "transparent" },
  header: { alignItems: "center", marginBottom: 22 },
  om: { fontSize: 26, color: colors.lotus, marginBottom: 4 },
  greeting: { fontFamily: fonts.bold, fontSize: 30, color: colors.inkDeep, textAlign: "center" },
  sub: { fontFamily: fonts.body, fontSize: 14, color: colors.muted, marginTop: 6 },
  divider: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 14 },
  dividerLine: { width: 60, height: 1, backgroundColor: colors.goldSoft },
  dividerDot: { color: colors.copper, fontSize: 14 },
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
