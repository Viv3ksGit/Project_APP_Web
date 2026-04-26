export const colors = {
  primary: "#1F5D3A",
  primaryDark: "#17492D",
  accent: "#C8A96B",
  background: "#F7F3EA",
  card: "#FFFDF8",
  text: "#1C2A22",
  muted: "#6B7A70",
  border: "#D9D4C7",
  success: "#4E8B64",
  softGold: "#D9BE8A",
  lotusTint: "#EFE4CF",
  leafTint: "#DCE8DF",
  shadow: "rgba(17, 24, 20, 0.08)",
} as const;

export type AppColors = typeof colors;
