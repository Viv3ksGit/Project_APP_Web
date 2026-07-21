import type { ImageSourcePropType } from "react-native";

// React Native requires static require() paths — they cannot be built dynamically.
const IMAGES: Record<string, ImageSourcePropType> = {
  Shiva: require("../assets/deities/shiva.png"),
  Vishnu: require("../assets/deities/vishnu.png"),
  Durga: require("../assets/deities/durga.png"),
  Hanuman: require("../assets/deities/hanuman.png"),
  Ganesh: require("../assets/deities/ganesh.png"),
  Krishna: require("../assets/deities/krishna.png"),
  Lakshmi: require("../assets/deities/lakshmi.png"),
  Saraswati: require("../assets/deities/saraswati.png"),
  Muruga: require("../assets/deities/muruga.png"),
  Rama: require("../assets/deities/rama.png"),
  Amman: require("../assets/deities/amman.png"),
  Venkateshwara: require("../assets/deities/venkateshwara.png"),
  Guruvayurappan: require("../assets/deities/guruvayurappan.png"),
  Ayyappa: require("../assets/deities/ayyappa.png"),
};

export const BRAND_MARK: ImageSourcePropType = require("../assets/brand/my-shloka-ritual-mark.png");
export const BRAND_LOGO: ImageSourcePropType = require("../assets/brand/my-shloka-ritual-logo-transparent.png");
export const SPLASH_BG: ImageSourcePropType = require("../assets/media/entry-splash-bg.png");
export const SETUP_RITUAL_ICON: ImageSourcePropType = require("../assets/brand/setup-ritual-icon.png");
export const SETUP_LIBRARY_ICON: ImageSourcePropType = require("../assets/brand/setup-library-icon.png");

export function deityImage(category: string): ImageSourcePropType {
  return IMAGES[category] ?? BRAND_MARK;
}

export const DEITY_ORDER = [
  "Shiva",
  "Vishnu",
  "Hanuman",
  "Ganesh",
  "Durga",
  "Krishna",
  "Muruga",
  "Lakshmi",
  "Saraswati",
  "Rama",
  "Amman",
  "Venkateshwara",
  "Guruvayurappan",
  "Ayyappa",
];
