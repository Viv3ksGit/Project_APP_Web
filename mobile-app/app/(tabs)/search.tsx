import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Screen from "../../components/Screen";
import SlokaCard from "../../components/SlokaCard";
import { getSlokaSummaries } from "../../lib/slokas";
import { colors, fonts, radius, shadow } from "../../theme/theme";

export default function Search() {
  const insets = useSafeAreaInsets();
  const all = useMemo(() => getSlokaSummaries(), []);
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return all.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.titleTamil.includes(query.trim())
    );
  }, [query, all]);

  const suggestions = ["Shiva", "Hanuman", "Ganesh", "Krishna", "Lakshmi", "Muruga"];

  return (
    <Screen>
    <ScrollView
      style={styles.root}
      contentContainerStyle={{ paddingTop: insets.top + 16, paddingHorizontal: 20, paddingBottom: 24 }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Search</Text>
      <View style={styles.search}>
        <Ionicons name="search" size={18} color={colors.muted} style={{ marginRight: 10 }} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search sloka, deity or Tamil…"
          placeholderTextColor={colors.muted}
          style={styles.searchInput}
          autoFocus
        />
        {query.length > 0 && (
          <Pressable onPress={() => setQuery("")} hitSlop={8}>
            <Ionicons name="close-circle" size={18} color={colors.muted} />
          </Pressable>
        )}
      </View>

      {!query && (
        <>
          <Text style={styles.sectionTitle}>Popular searches</Text>
          <View style={styles.chips}>
            {suggestions.map((s) => (
              <Pressable key={s} style={styles.chip} onPress={() => setQuery(s)}>
                <Text style={styles.chipText}>{s}</Text>
              </Pressable>
            ))}
          </View>
        </>
      )}

      {query.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>
            {results.length} result{results.length === 1 ? "" : "s"}
          </Text>
          {results.length === 0 ? (
            <Text style={styles.empty}>No slokas match “{query}”.</Text>
          ) : (
            results.map((s) => <SlokaCard key={s.id} sloka={s} />)
          )}
        </>
      )}
    </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "transparent" },
  title: { fontFamily: fonts.bold, fontSize: 26, color: colors.inkDeep, marginBottom: 14 },
  search: {
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
  searchInput: { flex: 1, fontFamily: fonts.body, fontSize: 14, color: colors.ink, padding: 0 },
  sectionTitle: { fontFamily: fonts.semibold, fontSize: 16, color: colors.inkDeep, marginTop: 24, marginBottom: 12 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  chipText: { fontFamily: fonts.medium, fontSize: 13, color: colors.ink },
  empty: { fontFamily: fonts.body, fontSize: 14, color: colors.muted, marginTop: 8 },
});
