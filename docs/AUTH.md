```markdown
# Authentication Guide — Ory First

This document compares recommended open-source auth providers and records our decision to prioritize **Ory Kratos** for user/session management where authentication is required. For the portfolio demo auth is optional, but this doc provides a migration path and implementation checklist.

## Recommendation Summary

- Preferred provider: **Ory Kratos** (user management) + **Ory Hydra** (OAuth2/OIDC) for token management where needed.
- Alternate: **Keycloak** for an all-in-one self-hosted identity provider if you want a single-server solution.
- Rationale: Ory provides modern, composable primitives, easier cloud-native integration, and a smaller security surface for a demo that may need to scale.

---

## Ory vs Keycloak (short)

- Ory Kratos

  - Strengths: composable identity, modern APIs, programmable flows, cloud-native friendly, good docs.
  - Use cases: user self-service flows, passwordless, magic links, session handling.
  - Considerations: needs more wiring (Kratos + Hydra) for full OAuth support.

- Keycloak
  - Strengths: batteries included (UI, admin console, providers), works out-of-the-box for OAuth/OIDC.
  - Use cases: enterprise SSO, quick start with UI, less infra composition required.
  - Considerations: heavier VM footprint and more configuration for customization.

---

## When to implement auth in this project

- Phase 1: Research and document chosen approach in `docs/AUTH.md` (this file).
- Phase 4: Implement an optional sandboxed auth flow (demo accounts) that does not gate feature work.

## Ory Implementation Checklist

- [ ] Create an `auth/` directory for integration demos and Docker Compose for local dev (Kratos + Hydra + Postgres).
- [ ] Add environment variables template for Ory endpoints and admin tokens in `.env.example`.
- [ ] Implement a small `AuthService` that handles login/logout, session tokens, and profile fetch; keep it optional via a feature flag.
- [ ] Provide demo users and scripts to seed local DB for testing (no real user data committed).
- [ ] Add Playwright tests covering login/logout, protected-route redirection, and session persistence.
- [ ] Storybook: if UI components require auth state, provide a story decorator that injects a demo authenticated state (avoid real secrets in stories).

## Keycloak Migration Notes (if chosen later)

- Use Keycloak docker image and configure realms/clients via `kcadm` or a realm export.
- Map Ory flows to Keycloak equivalents (user flows, roles, groups).

## Security Notes

- Do not store secrets in the repo. Use GitHub Actions secrets for CI and GitHub Pages where applicable.
- Limit admin tokens in local dev to short-lived test tokens.

**_ End of doc _**
```
