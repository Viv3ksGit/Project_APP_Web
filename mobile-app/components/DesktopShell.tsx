import { Image } from "expo-image";
import { ReactNode } from "react";
import { Platform, StyleSheet, useWindowDimensions, View } from "react-native";
import { SPLASH_BG } from "../lib/deityImages";

const isWeb = Platform.OS === "web";
const DESKTOP_BREAKPOINT = 760;
const FRAME_WIDTH = 430;
const NOTCH_HEIGHT = 28;

// On native and narrow (mobile) web this is a pass-through — zero behavior
// change. On a wide desktop browser it wraps the whole navigator (Stack +
// Tabs + tab bar together) in one phone-shaped frame over a blurred backdrop,
// so nothing floats disconnected the way a lone screen-level card would.
export default function DesktopShell({ children }: { children: ReactNode }) {
  const { width, height } = useWindowDimensions();
  const isDesktop = isWeb && width >= DESKTOP_BREAKPOINT;

  if (!isDesktop) return <>{children}</>;

  const frameHeight = Math.min(height - 56, 900);

  return (
    <View style={styles.backdrop}>
      <Image source={SPLASH_BG} style={StyleSheet.absoluteFill} contentFit="cover" blurRadius={80} />
      <View style={[StyleSheet.absoluteFill, styles.wash]} />

      <View style={[styles.frame, { height: frameHeight }]}>
        <View style={styles.notch} />
        <View style={styles.contentArea}>{children}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    minHeight: "100vh" as unknown as number,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#171712",
  },
  wash: { backgroundColor: "rgba(12,16,10,0.58)" },
  frame: {
    width: FRAME_WIDTH,
    borderRadius: 44,
    overflow: "hidden",
    borderWidth: 10,
    borderColor: "#0c0a08",
    backgroundColor: "#000",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 30 },
    shadowOpacity: 0.5,
    shadowRadius: 60,
    elevation: 20,
  },
  notch: {
    position: "absolute",
    top: 0,
    alignSelf: "center",
    width: 140,
    height: NOTCH_HEIGHT,
    backgroundColor: "#0c0a08",
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    zIndex: 10,
  },
  contentArea: { flex: 1, paddingTop: NOTCH_HEIGHT },
});
