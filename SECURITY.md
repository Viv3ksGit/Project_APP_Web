# Security Policy

## Supported Scope

This policy applies to the `sloka-sabha-web` application and supporting CI workflows.

## Reporting A Vulnerability

If you find a security issue, do not open a public issue.

Use private reporting through the repository security advisories, or notify the maintainers directly.

Include:

1. A clear description of the issue and impact.
2. Steps to reproduce.
3. A minimal proof of concept.
4. Suggested fix, if known.

## Security Response Targets

1. Triage within 2 business days.
2. Confirm severity and owner within 3 business days.
3. Patch high/critical issues before the next release.
4. Publish a post-fix note when disclosure is safe.

## Minimum Security Gates

1. Pull request review is required before merge.
2. `npm run check:quality` must pass.
3. `npm run check:security` must pass for release branches.
4. Secrets must not be committed to source control.
