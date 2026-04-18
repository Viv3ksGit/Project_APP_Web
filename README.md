This is the Sloka Sabha web application built with [Next.js](https://nextjs.org).

## Getting Started

Install dependencies and run the development server:

```bash
npm ci
npm run dev
```

Open [http://127.0.0.1:3000](http://127.0.0.1:3000) with your browser.

## Quality And Security Commands

```bash
npm run lint
npm run typecheck
npm run build
npm run audit:deps
```

## Project Security Baseline

1. Secure SDLC process: `docs/sdlc/SECURE_SDLC.md`
2. OWASP control mapping: `docs/security/OWASP_TOP10_MAPPING.md`
3. Threat model: `docs/security/THREAT_MODEL.md`
4. Secure coding checklist: `docs/security/SECURE_CODING_CHECKLIST.md`
5. Reporting policy: `SECURITY.md`

## CI Workflows

1. `.github/workflows/ci.yml` runs lint, typecheck, and build.
2. `.github/workflows/security.yml` runs dependency audit on PRs and weekly schedule.

## Next Steps

1. Add Supabase project and environment variables from `.env.example`.
2. Implement auth and row-level security before handling real user data.
3. Add API route validation for each write endpoint.
