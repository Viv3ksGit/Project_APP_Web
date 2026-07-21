import { ReactNode } from "react";
import { ImageBackground, Platform, StyleSheet, View } from "react-native";
import { SPLASH_BG } from "../lib/deityImages";
import { colors } from "../theme/theme";

// Phone-width content column on web; full width on native. Each screen owns its
// full-window background (the misty scene on entry screens, paper on content
// screens) so nothing bleeds onto the sides — matching the reference app.
const MAX = Platform.OS === "web" ? 480 : undefined;

export default function Screen({ children, scene = false }: { children: ReactNode; scene?: boolean }) {
  const column = <View style={styles.col}>{children}</View>;
  if (scene) {
    return (
      <ImageBackground source={SPLASH_BG} style={styles.fill} resizeMode="cover">
        {column}
      </ImageBackground>
    );
  }
  return <View style={[styles.fill, { backgroundColor: colors.paper }]}>{column}</View>;
}

const styles = StyleSheet.create({
  fill: { flex: 1, backgroundColor: "#EFE7D6" },
  col: { flex: 1, width: "100%", maxWidth: MAX, alignSelf: "center", overflow: "hidden" },
});
