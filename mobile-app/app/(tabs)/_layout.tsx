import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { contentMaxWidth } from "../../lib/responsive";
import { colors, fonts, radius } from "../../theme/theme";

const ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  home: "home-outline",
  explore: "flower-outline",
  insights: "stats-chart-outline",
  search: "search-outline",
  profile: "person-outline",
};

// A hand-rolled tab bar, in place of the default one. The stock bar renders
// each tab as a bare touch target with no pressed/active feedback, which on
// mobile browsers reads as "static" — and its underlying <a>-based links have
// been unreliable to tap on some phones. This version uses plain Pressables
// (guaranteed touch handling) wired straight to navigation.navigate, with an
// active pill background and press-opacity so it visibly responds to touch.
function TabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const max = contentMaxWidth(width);

  return (
    <View style={[styles.wrap, { paddingBottom: insets.bottom || 8 }]}>
      <View style={[styles.bar, { maxWidth: max }]}>
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          if (route.name === "journey") return null; // reachable via Profile, not shown in the tab bar
          const focused = state.index === index;
          const label = options.title ?? route.name;
          const icon = ICONS[route.name] ?? "ellipse-outline";

          const onPress = () => {
            const event = navigation.emit({ type: "tabPress", target: route.key, canPreventDefault: true });
            if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              hitSlop={6}
              style={({ pressed }) => [styles.item, pressed && styles.itemPressed]}
            >
              <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
                <Ionicons name={icon} size={20} color={focused ? colors.lotus : colors.muted} />
              </View>
              <Text style={[styles.label, focused && styles.labelActive]} numberOfLines={1}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="home" options={{ title: "Home" }} />
      <Tabs.Screen name="journey" options={{ title: "Journey", href: null }} />
      <Tabs.Screen name="explore" options={{ title: "Explore" }} />
      <Tabs.Screen name="insights" options={{ title: "Insights" }} />
      <Tabs.Screen name="search" options={{ title: "Search" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  wrap: { backgroundColor: colors.paperWarm, borderTopWidth: 1, borderTopColor: colors.line },
  bar: {
    flexDirection: "row",
    alignSelf: "center",
    width: "100%",
    paddingTop: 8,
    paddingHorizontal: 4,
  },
  item: { flex: 1, alignItems: "center", gap: 3, paddingVertical: 2, borderRadius: radius.md },
  itemPressed: { opacity: 0.55 },
  iconWrap: {
    width: 36,
    height: 26,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapActive: { backgroundColor: "rgba(46,125,50,0.12)" },
  label: { fontFamily: fonts.medium, fontSize: 11, color: colors.muted },
  labelActive: { color: colors.lotus, fontFamily: fonts.semibold },
});
