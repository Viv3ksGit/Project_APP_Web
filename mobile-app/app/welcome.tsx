import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import FadeIn from "../components/FadeIn";
import JourneyChoices from "../components/JourneyChoices";
import Screen from "../components/Screen";
import { colors, fonts } from "../theme/theme";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
}

export default function Welcome() {
  const insets = useSafeAreaInsets();

  return (
    <Screen scene>
    <FadeIn>
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

      <JourneyChoices />
    </ScrollView>
    </FadeIn>
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
});
