# Secure SDLC

## Purpose

Define how this team ships features with predictable security outcomes.

## Workflow

1. Plan:
Document user story, abuse cases, and data classification.

2. Design:
Update threat model for any new data flow, auth flow, or third-party integration.

3. Implement:
Follow secure coding standards and least privilege.

4. Verify:
Run lint, type checks, dependency audit, and focused manual security tests.

5. Release:
Approve only if quality and security checks pass.

6. Operate:
Track incidents, patch vulnerabilities, and run dependency updates routinely.

## Required Artifacts Per Feature

1. Feature spec with data handling notes.
2. OWASP category impact (if applicable).
3. Test evidence for input validation and authz rules.
4. Rollback plan for risky changes.

## Branch And Review Policy

1. All work happens in feature branches.
2. No direct commits to protected branches.
3. At least one reviewer on each PR.
4. Security-sensitive changes require explicit security review.
