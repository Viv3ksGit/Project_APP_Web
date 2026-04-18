# OWASP Top 10 Mapping (2021)

## A01 Broken Access Control

Controls:

1. Server-side authorization checks for each data action.
2. Row-level security policies in Supabase before production.
3. Deny-by-default API design.

## A02 Cryptographic Failures

Controls:

1. HTTPS only in all environments beyond local dev.
2. No secrets in client code.
3. Store sensitive tokens only server-side.

## A03 Injection

Controls:

1. Use parameterized queries only.
2. Validate and sanitize all user inputs.
3. Avoid raw SQL string concatenation.

## A04 Insecure Design

Controls:

1. Lightweight threat model per feature.
2. Abuse case checklist in design review.
3. Security acceptance criteria in user stories.

## A05 Security Misconfiguration

Controls:

1. Security headers in Next.js configuration.
2. Remove `X-Powered-By`.
3. Environment-specific hardening checklist.

## A06 Vulnerable And Outdated Components

Controls:

1. `npm audit` in CI.
2. Weekly dependency review.
3. Patch high/critical vulnerabilities before release.

## A07 Identification And Authentication Failures

Controls:

1. Use trusted auth provider (Supabase Auth).
2. Enforce secure session handling.
3. Protect privileged routes and actions server-side.

## A08 Software And Data Integrity Failures

Controls:

1. Protected branches and required CI checks.
2. Lockfile committed and reviewed.
3. Dependency source restricted to trusted registries.

## A09 Security Logging And Monitoring Failures

Controls:

1. Log authentication and authorization events.
2. Capture failed access attempts.
3. Define alert thresholds before public launch.

## A10 Server-Side Request Forgery (SSRF)

Controls:

1. Restrict outbound requests from server code.
2. Validate destination allowlists for external fetch operations.
3. Avoid user-controlled arbitrary URL fetch on server.
