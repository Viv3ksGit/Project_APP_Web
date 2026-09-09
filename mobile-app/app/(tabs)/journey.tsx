import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import FadeIn from "../../components/FadeIn";
import JourneyChoices from "../../components/JourneyChoices";
import Screen from "../../components/Screen";
import { colors, fonts } from "../../theme/theme";

export default function Journey() {
  const insets = useSafeAreaInsets();

  return (
    <Screen>
    <FadeIn>
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingTop: insets.top + 20, paddingBottom: 24, paddingHorizontal: 20 }}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Journey Selection</Text>
        <Text style={styles.sub}>Choose how you'd like to continue your practice.</Text>
      </View>

      <JourneyChoices />
    </ScrollView>
    </FadeIn>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: 20 },
  title: { fontFamily: fonts.bold, fontSize: 24, color: colors.inkDeep },
  sub: { fontFamily: fonts.body, fontSize: 13.5, color: colors.muted, marginTop: 4 },
});
