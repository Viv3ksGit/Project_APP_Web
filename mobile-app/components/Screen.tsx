import { Image } from "expo-image";
import { ReactNode } from "react";
import { Platform, StyleSheet, useWindowDimensions, View } from "react-native";
import { SPLASH_BG } from "../lib/deityImages";
import { contentMaxWidth } from "../lib/responsive";
import { colors } from "../theme/theme";

// Content column scales up with the browser window on web (see lib/responsive)
// instead of staying pinned to a fixed mobile width — so the site reads as a
// real responsive page, not a phone screen floating in a big window. Native
// (iOS/Android) always gets the full device width. Each screen owns its
// full-window background (the misty scene on entry screens, paper on content
// screens) so nothing bleeds onto the sides.
//
// sceneFit controls how the splash art fills a wide desktop window:
//   "cover"   → full-bleed, fills the whole viewport (gentle crop). Default.
//   "contain" → whole square composition shown uncropped (used on the splash
//               landing so the full lotus/lake/sunrise art is visible).
// On phones the scene is always full-bleed ("cover") regardless.
export default function Screen({
  children,
  scene = false,
  sceneFit = "cover",
}: {
  children: ReactNode;
  scene?: boolean;
  sceneFit?: "cover" | "contain";
}) {
  const { width } = useWindowDimensions();
  const max = contentMaxWidth(width);
  const column = <View style={[styles.col, { maxWidth: max }]}>{children}</View>;

  if (scene) {
    const isWideWeb = Platform.OS === "web" && width >= 760;
    const fit = isWideWeb ? sceneFit : "cover";
    const letterboxed = fit === "contain";
    return (
      <View style={[styles.fill, letterboxed && { backgroundColor: colors.paperDeep }]}>
        <Image source={SPLASH_BG} style={StyleSheet.absoluteFill} contentFit={fit} />
        <View style={styles.sceneWash} />
        {column}
      </View>
    );
  }
  return <View style={[styles.fill, { backgroundColor: colors.paper }]}>{column}</View>;
}

const styles = StyleSheet.create({
  fill: { flex: 1, backgroundColor: "#EFE7D6" },
  col: { flex: 1, width: "100%", alignSelf: "center", overflow: "hidden" },
  // Gentle overlay so text stays legible wherever the crop/letterbox lands
  sceneWash: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255,251,242,0.12)",
  },
});
