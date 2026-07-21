# My Shloka Ritual (Expo)

Native iOS + Android rebuild of the **My Shloka Ritual** sloka chanting app, built with **Expo + expo-router** and runnable in **Expo Go**.

This is the primary repo for the mobile app. The original web/PWA version (Next.js) lives separately.

## Stack
- Expo SDK 56 (React Native 0.85, React 19)
- expo-router (file-based navigation)
- expo-font, expo-image, expo-linear-gradient, @expo/vector-icons

## Screens (first round)
Designed to match the deployed web app (project-app-web.vercel.app) — light/cream theme with a persistent bottom tab bar.

1. **Landing** (`app/index.tsx`) — background scene + swipeable splash slides + "Enter Slokas".
2. **Welcome** (`app/welcome.tsx`) — "Good Evening" greeting + illustrated "Set Up Ritual" / "Explore Library" cards.
3. **Home tab** (`app/(tabs)/home.tsx`) — greeting, Today card, search, "Chant by Deity" rail, Tamil calendar card, Popular Slokas list.
4. **Explore/Library tab** (`app/(tabs)/explore.tsx`) — green banner, deity category chips, deity grid, filtered sloka list.

Bottom tabs: Home, Explore, Sessions, Search, Profile (last three are placeholders).

## Run locally
```bash
npm install
npx expo start
```
Scan the QR code with the **Expo Go** app on iOS or Android.

## Project layout
- `app/` — routes (expo-router)
- `components/` — shared UI (`SlokaCard`)
- `lib/` — `types.ts`, `slokas.ts` (sloka catalog, ported from web), `deityImages.ts`
- `theme/` — design tokens (colors, fonts, spacing)
- `assets/fonts` — Lora + Noto Serif Tamil
- `assets/deities`, `assets/brand` — imagery

## Roadmap (not yet implemented)
Setup wizard, sloka reader/player, Tamil calendar/Panchangam, favorites persistence (AsyncStorage), live sessions.
