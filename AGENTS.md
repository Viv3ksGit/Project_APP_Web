<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes. APIs, conventions, and file structure may differ from training data. Read the guide in `node_modules/next/dist/docs/` before writing code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Sloka Sabha Product Guidance

## Product goal
Build a calm South Indian sloka app where users can:
1. Enter quickly.
2. Pick deity or search sloka.
3. Pick chanting time (5/10/15, custom later).
4. Read and chant with Tamil and English support.

## MVP scope (Phase 1)
- Landing entry with Start/Enter Slokas.
- Home with search and day-aware suggestions.
- Deity browse screen and sloka listing.
- Sloka detail reading experience.
- Session flow with duration options.
- Favorites, simple chant counts, and reminders.
- Panchangam/Tamil calendar snapshot.

## Out of scope for Phase 1
- Live community rooms.
- Group schedule/join session.
- Advanced gamification loops.
- Full analytics backend.

## UI direction
- Modern spiritual, calm, and minimal.
- Do not use "cute deity cards" wording.
- Use "Deity Collection".
- Keep layout breathable and uncluttered.
- Prefer icon-based controls where reasonable.

## Color theme
- Primary: `#2E7D32`
- Primary dark: `#1B5E20`
- Background: `#FAF7F0`
- Accent copper: `#B87333`
- Accent gold: `#D4AF37`
- Text primary: `#1C1C1C`
- Text secondary: `#6D6D6D`

## Reading experience requirements
- Support Tamil script and English transliteration.
- Meaning toggle on detail page.
- Meaning text should be visually distinct.
- Font size controls must remain accessible while scrolling.
- Keep sloka lines centered in the detail view.

## Navigation expectations
- Main flow: `Landing -> Home -> (Gods/Library/Sessions) -> Detail`.
- Keep Panchangam as a dedicated route/page.

## Engineering guardrails
- Reuse existing components and styling patterns.
- Keep edits scoped and avoid unrelated refactors.
- Prefer typed state and helper functions.
- Preserve local storage keys for user preferences/progress.
