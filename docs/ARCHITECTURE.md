# Architecture Diagram

```mermaid
flowchart TD
  U["User (Web/PWA Browser)"] --> UI["Next.js App Router UI"]
  UI --> API["Next.js API Routes"]

  API --> SVC["Session Service (In-Memory Store)"]
  API --> SD["Sloka Domain Data"]

  SD --> SL["Sloka Catalog"]
  SVC --> SE["Session Records"]
  SVC --> LI["Live Line State"]

  API --> SEC["Validation + Security Guards"]
  SEC --> HDR["Security Headers (CSP, COOP, etc.)"]

  CI["GitHub CI / Security Workflows"] --> QG["Lint + Typecheck + Build + Audit Gates"]
```

## Current Runtime Layers

1. Presentation:
`components/AppClient.tsx`, `app/page.tsx`, `app/globals.css`

2. API:
`app/api/*`

3. Domain:
`lib/domain/*`

4. Server State:
`lib/server/session-store.ts`

## Next Planned Evolution

1. Replace in-memory session store with Supabase tables.
2. Add auth and role-aware policies (host, participant, admin).
3. Replace polling with Supabase Realtime subscriptions.
