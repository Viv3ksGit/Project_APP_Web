import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { deityImage } from "../lib/deityImages";
import { toggleFavorite, useStore } from "../lib/store";
import type { SlokaSummary } from "../lib/types";
import { colors, fonts, radius, shadow } from "../theme/theme";

type Props = {
  sloka: SlokaSummary;
  onPress?: () => void;
};

export default function SlokaCard({ sloka, onPress }: Props) {
  const router = useRouter();
  const { favorites } = useStore();
  const favorite = favorites.includes(sloka.id);

  const open = onPress ?? (() => router.push({ pathname: "/reader/[id]", params: { id: sloka.id } }));

  return (
    <Pressable style={styles.card} onPress={open}>
      <View style={styles.tile}>
        <Image source={deityImage(sloka.category)} style={styles.tileImg} contentFit="cover" />
      </View>
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={1}>
          {sloka.title}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          <Text style={styles.tamil}>{sloka.titleTamil}</Text>
          {`  ·  ${sloka.category}  ·  ${sloka.duration}`}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.muted} style={styles.chevron} />
      <Pressable hitSlop={10} onPress={() => toggleFavorite(sloka.id)} style={styles.heart}>
        <Ionicons
          name={favorite ? "heart" : "heart-outline"}
          size={22}
          color={favorite ? colors.heart : colors.lotus}
        />
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.line,
    ...shadow.card,
  },
  tile: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceTint,
    overflow: "hidden",
    marginRight: 12,
  },
  tileImg: { width: "100%", height: "100%" },
  body: { flex: 1 },
  title: { fontFamily: fonts.bold, fontSize: 16, color: colors.ink },
  meta: { fontFamily: fonts.body, fontSize: 12.5, color: colors.muted, marginTop: 3 },
  tamil: { fontFamily: fonts.tamil, fontSize: 12.5, color: colors.lotusDeep },
  chevron: { marginHorizontal: 6 },
  heart: { paddingLeft: 4 },
});
