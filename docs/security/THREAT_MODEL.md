# Threat Model (MVP)

## Assets

1. User accounts and profile data.
2. Session invite links and room metadata.
3. Group membership and private schedules.
4. Sloka content and playlist data.
5. Admin or organizer privileges.

## Entry Points

1. Public web routes.
2. Session join links.
3. Future APIs and server actions.
4. Future auth callbacks and webhooks.

## Primary Threats

1. Unauthorized access to private sessions.
2. Link guessing/bruteforce on session codes.
3. Input abuse and injection attempts.
4. Account takeover attempts.
5. Excessive requests or abuse traffic.

## Mitigations To Implement

1. Signed or high-entropy session join tokens.
2. Server-side authz checks on all session reads/writes.
3. Input schema validation for every API boundary.
4. Rate limiting on session join and auth endpoints.
5. Security event logging and anomaly alerts.

## Open Risks For MVP

1. Local demo state has no auth.
2. Realtime sync security depends on Supabase RLS policy design.
3. Invite link misuse risk until role checks and expiry are added.
