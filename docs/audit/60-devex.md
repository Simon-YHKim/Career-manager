# Phase 6 — DX Audit

**Skill applied**: `plan-devex-review` (DX TRIAGE) + `project-context-md`
**Inputs scanned**: `README.md`, `CLAUDE.md`, root `package.json`, `apps/web/package.json`, `apps/android/app/build.gradle.kts`, `.github/workflows/ci.yml`, `turbo.json`, `pnpm-workspace.yaml`
**Date**: 2026-04-29

## Summary

- **TTFC estimate**: ~38 min for a competent dev (web-only path: ~12 min; +Android: ~26 min more)
- **Onboarding artifacts present**: 4 / 8
- **Verification loop coverage**: 1 / 7 listed in CLAUDE.md (commands exist in README but not surfaced for Claude)
- **Composite DX score**: **6.5 / 10** — solid bones (clear README, engines pinned, CI mirrors local), but Boris-Cherny verification loop is missing from CLAUDE.md and onboarding artifacts (`.env.example`, `.nvmrc`, `CONTRIBUTING.md`) are absent.

## A. TTFC walkthrough

| # | Step | Command | Est. min | Friction |
|---|---|---|---|---|
| 1 | Clone | `git clone … && cd Career-manager` | 1 | none |
| 2 | Enable pnpm | `corepack enable && corepack prepare pnpm@9.12.3 --activate` | 1 | README mentions it; if dev's Node < 20 they hit `engines` warning. No `.nvmrc`, so `nvm use` doesn't work — manual version check needed. |
| 3 | Install deps | `pnpm install` | 4–6 | First-run cold cache; Next 15 + tailwind v4 + turbo pulls ~600MB. No `--frozen-lockfile` hint for local. |
| 4 | Build packages first | `pnpm --filter "./packages/*" build` | 1 | **Hidden requirement**: web `typecheck` depends on built `.d.ts` from packages (per CI line 30 comment). README's `pnpm -r typecheck` will fail on a clean clone if packages aren't built first. Not documented in README. |
| 5 | Web dev server | `pnpm --filter web dev` | <1 | Turbopack — fast. URL `http://localhost:3000` documented. No mocked auth, no `.env.example` so any Supabase-touching code path will throw. |
| 6 | Verify (web) | open browser, check 12-stage color cards | 1 | README §Verification names this exactly — good. |
| 7 | First commit | `git checkout -b claude/<topic>-<id>` | 1 | Convention for AI agents only; no human-dev convention (`feat/`, `fix/`) documented. |
| **Web-only subtotal** | | | **~12 min** | |
| 8 | JDK 17 install | `sdk install java 17-tem` | 5 | If absent. Not scripted. |
| 9 | Android SDK API 35 | export `ANDROID_HOME`, accept licenses | 10 | README says "ANDROID_HOME 설정 필요" but no walkthrough. New devs lose 30+ min here in practice. |
| 10 | Emulator/device | AVD create or USB device | 5 | Undocumented. |
| 11 | Build APK | `cd apps/android && ./gradlew :app:assembleDebug` | 4–6 | First Gradle sync downloads BOM, Compose, Material3 (~400MB). |
| **Total TTFC (web + android)**: | | | **~38 min** | (optimistic — Android first-time setup commonly blows past 60 min) |

**Friction hotspots**: (1) `pnpm -r typecheck` order-of-operations not in README; (2) no `.env.example` blocks any DB-aware feature work; (3) Android prerequisites under-documented.

## B. Onboarding checklist

| Artifact | Present | Severity | Recommendation |
|---|---|---|---|
| README prerequisites table | ✓ | — | Good — Node, pnpm, JDK, Android SDK listed. |
| Getting started commands | ✓ | — | Copy-pasteable, with web URL. |
| `.env.example` | ✗ | **major** | Create at repo root with `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` placeholders. Block S2 auth work without it. |
| `.nvmrc` | ✗ | minor | Add `20` so `nvm use` / Volta auto-switch work. `engines.node >=20` already in `package.json` — good fallback. |
| `CONTRIBUTING.md` | ✗ | major | Minimal stub: branch convention (`claude/<topic>-<id>` for AI, `feat/<slug>` / `fix/<slug>` for humans), commit style (Conventional Commits), PR template pointer. |
| CLAUDE.md verification commands | ✗ | **major** | Add `## Verification commands` section (see C). |
| `pnpm dev` top-level alias | ✓ (partial) | minor | Root `package.json` has `"dev": "turbo run dev"`, but only `apps/web` defines a `dev` script. Currently equivalent to `pnpm --filter web dev`; document in README that root `pnpm dev` is the one-command entry. |
| Troubleshooting section | ✗ | minor | Add common pitfalls: corepack not enabled, packages-must-build-before-typecheck, port 3000 conflict, Gradle cache wipe (`./gradlew clean`). |
| `.editorconfig` | ✗ | minor | Add 2-space TS / 4-space Kotlin / LF / final newline to prevent style noise across editors. |

## C. Verification loop coverage (Boris Cherny)

The Boris Cherny principle: Claude (and human devs) must be able to self-verify without asking the user. The commands exist in the README, but **CLAUDE.md is the file Claude loads at session start** — and currently it only describes architecture and working agreements, not how to run anything.

| Tool | Listed in CLAUDE.md? | Recommended entry |
|---|---|---|
| Dev server | ✗ | `pnpm --filter web dev` → http://localhost:3000 |
| Test command | ✗ | Aggregate: `pnpm -r test`. Per-package: `pnpm --filter @career/design-tokens test` (WCAG contrast), `pnpm --filter @career/schema test` (Zod). |
| Typecheck | ✗ | `pnpm --filter "./packages/*" build && pnpm -r typecheck` (note: packages must build first — surface this gotcha). |
| Browser URL | ✗ (implicit in README) | http://localhost:3000 — landing renders 12-stage color cards. |
| DB access | ✗ | `supabase start` (local stack) or `psql $SUPABASE_DB_URL`. Migrations: `supabase db reset` against local; append-only in `supabase/migrations/`. |
| Lint | ✗ | Web: `pnpm --filter web lint` (next lint). Android: `cd apps/android && ./gradlew :app:lint`. Aggregate: `pnpm -r lint` (note: packages currently have no lint script — silent no-op). |
| Build | ✗ | `pnpm --filter "./packages/*" build && pnpm --filter web build`. Android: `cd apps/android && ./gradlew :app:assembleDebug`. |

**Verification loop score**: **1 / 7** (the README's `## Verification` section names the visual smoke test, but does not surface commands to CLAUDE.md). After fix-now: 7/7.

## D. Daily workflow ergonomics

- **Watch mode**: `pnpm dev` at root runs `turbo run dev` and only `apps/web` defines a `dev` task — fine for solo web work, but no aggregated watcher across packages. Editing `packages/design-tokens/src/stages.ts` requires manual rebuild before web sees `.d.ts` updates (because turbopack reads transpiled types). Worth documenting.
- **Type errors visible**: `pnpm typecheck` works but is one-shot; no `tsc --watch` wired. Mid-development feedback is via Next dev server's overlay only. Consider documenting `pnpm --filter web exec tsc --noEmit --watch` for tight loops.
- **Test feedback**: `vitest` is implied (packages have `test` scripts) but no `--watch` aliases. Vitest watch is the default when `pnpm test` runs interactively, but in CI/turbo it's one-shot. Add `test:watch` script per package (report-only).
- **pnpm vs npm warnings**: `packageManager: "pnpm@9.12.3"` is set, so corepack will block npm — good. But no preinstall guard if user disables corepack. Consider an `only-allow` preinstall hook (report-only).
- **Common commands**: README is the index — good. CLAUDE.md should mirror the verification subset so Claude doesn't need to re-read README every session.

## E. CLAUDE.md quality (per `project-context-md` skill)

| Section | Present | Notes |
|---|---|---|
| Tech stack | ✓ | Concise, accurate, includes versions and source-of-truth file paths. |
| Working agreements | ✓ | Captures non-obvious invariants (color token mirroring, append-only migrations, branch convention). |
| Verification commands | ✗ | **Missing — top fix-now.** This is the single most impactful CLAUDE.md addition per the Boris Cherny principle. |
| Sprint context | ✓ | "What's next (S2)" gives Claude scope guardrails. |
| Verification loop | ✗ | See C — 1/7 entries reachable from CLAUDE.md. |
| SimonK-stack pointer | ✓ | "Working method" section names skills and triggers. |

Overall CLAUDE.md is well-written for *understanding* the project but under-equipped for *operating* on it autonomously.

## Recommended fixes

### fix-now (block before merging S2 Auth work)

- [ ] Add `## Verification commands` section to `CLAUDE.md` with all 7 entries from §C, including the package-build-before-typecheck gotcha.
- [ ] Add `.nvmrc` (`20`) at repo root.
- [ ] Add `.env.example` at repo root with Supabase placeholders (matches what S2 Auth will need).
- [ ] Add minimal `CONTRIBUTING.md`: branch convention for humans (`feat/<slug>`, `fix/<slug>`) alongside `claude/<topic>-<id>`, commit-message style, PR draft policy.
- [ ] Document the `pnpm --filter "./packages/*" build` prerequisite for `pnpm -r typecheck` in README (Setup section).

### report-only (S2-S3 timeframe)

- [ ] `.editorconfig` for cross-editor consistency.
- [ ] Troubleshooting section in README (corepack, port conflict, Gradle cache).
- [ ] `test:watch` scripts per package + vitest UI mode.
- [ ] Add `lint` script to `packages/*` so `pnpm -r lint` isn't a silent no-op.
- [ ] `ARCHITECTURE.md` — defer until post-S2 when auth + onboarding flow lands and there's actual data flow to diagram.
- [ ] PR template under `.github/PULL_REQUEST_TEMPLATE.md` (Format Lock checklist, design-token mirror checkbox, RLS-touched checkbox).
- [ ] `only-allow pnpm` preinstall guard for hard package-manager enforcement.
- [ ] Aggregated `pnpm dev` that watches `packages/*` rebuilds in parallel with web.

## Decision queue

- [ ] Will human devs use `feat/`/`fix/` branches alongside `claude/<topic>-<id>`? (CONTRIBUTING.md will enforce one answer.)
- [ ] Should CLAUDE.md include the local Supabase stack commands now (`supabase start`), or wait until S2 when DB access becomes load-bearing?
- [ ] Do we want a top-level `pnpm verify` script that chains `build packages → typecheck → test → web build` to give Claude one verification command instead of seven?
- [ ] Does the team want PR-template enforcement of the design-token sync rule (Web/Android mirror), or stay on convention-only?
- [ ] Android-side TTFC: invest in a `scripts/setup-android.sh` (sdkmanager + license accept), or accept the ~30-min onboarding tax until S5 when Android features ramp?
