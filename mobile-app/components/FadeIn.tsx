import { ReactNode, useEffect, useRef } from "react";
import { Animated } from "react-native";

// Gentle fade-in for a screen's content, so it eases into view instead of
// appearing instantly.
export default function FadeIn({ children, duration = 550 }: { children: ReactNode; duration?: number }) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration,
      useNativeDriver: true,
    }).start();
  }, [opacity, duration]);

  return <Animated.View style={{ flex: 1, opacity }}>{children}</Animated.View>;
}
