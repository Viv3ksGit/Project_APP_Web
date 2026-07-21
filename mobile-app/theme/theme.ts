// Design tokens — canonical values from the official design system
// (claude design / colors_and_type.css). Single source of truth.
export const colors = {
  lotus: "#2e7d32",
  lotusDeep: "#1f5d3a",
  lotusNight: "#17492d",
  leaf: "#1b5e20",
  gold: "#d4af37",
  goldSoft: "#c8a96b",
  copper: "#b87333",
  amber: "#f0ab2e",
  amberDeep: "#e79607",
  paper: "#faf7f0",
  paperWarm: "#fffdf8",
  paperDeep: "#f6efe3",
  surface: "#ffffff",
  surfaceTint: "#f8f3e8",
  card: "#fffdf8",
  cream: "#f8f3e8",
  ink: "#1c1c1c",
  inkSoft: "#1c2a22",
  inkDeep: "#19392a",
  muted: "#6d6d6d",
  mutedWarm: "#5f6e7d",
  mutedLeaf: "#6b7a70",
  line: "rgba(27, 94, 32, 0.16)",
  lineWarm: "#e0d9c9",
  halo: "rgba(46, 125, 50, 0.12)",
  night: "#12100d",
  heart: "#2e7d32",
  calendarPill: "#7e9079",
} as const;

export const radius = {
  sm: 7,
  md: 8,
  lg: 12,
  xl: 14,
  xxl: 24,
  pill: 999,
} as const;

export const spacing = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 22,
  xl: 30,
} as const;

export const fonts = {
  body: "Lora_400",
  medium: "Lora_500",
  semibold: "Lora_600",
  bold: "Lora_700",
  tamil: "NotoSerifTamil_500",
  tamilBold: "NotoSerifTamil_700",
} as const;

export const shadow = {
  card: {
    shadowColor: "#11241480",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 3,
  },
  cta: {
    shadowColor: colors.lotusNight,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 5,
  },
} as const;
