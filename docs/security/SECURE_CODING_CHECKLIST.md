# Secure Coding Checklist

Use this checklist before opening a PR.

## Input And Output

1. All external input validated.
2. No unsanitized HTML rendering.
3. Error responses do not leak internals.

## Auth And Authorization

1. Server-side authz enforced for each protected action.
2. No role checks only in client code.
3. Sensitive actions require authenticated user context.

## Secrets And Config

1. No secrets in source files.
2. No secrets in `NEXT_PUBLIC_` variables.
3. `.env.example` updated for new required variables.

## Dependencies

1. No unreviewed high-risk package additions.
2. `npm audit` reviewed for new findings.
3. Lockfile changes reviewed carefully.

## Web Security

1. Security headers still present after config changes.
2. CSP changes are documented and justified.
3. No mixed-content resource URLs.

## Data Safety

1. Data queries are parameterized.
2. Access boundaries are explicit and tested.
3. Logs avoid sensitive data leakage.
