# Changelog

All notable changes to Career Manager are documented here.
Format: [Keep a Changelog](https://keepachangelog.com/) · [SemVer](https://semver.org/).

## [Unreleased]

_Sprint 1 follow-ups (from `docs/audit/`) — pending merge:_
- chore(deps): bump pnpm 9.12.3 → 10.33.2 (PR #4)
- chore: add `.env.example` documenting required env vars S1-S18 (PR #5)
- docs: CLAUDE.md verification loop + `.nvmrc` + `CONTRIBUTING.md` + README troubleshooting (PR #6)
- feat(web): App Router triad (`error.tsx` / `loading.tsx` / `not-found.tsx`) + OG meta + sitemap + robots + `/api/health` (PR #7)
- feat(web): self-host Pretendard via `next/font/local` (PR #8)
- docs: `DESIGN.md` codifying brand · type · color · motion · a11y policy (PR #9)
- ci: pin Actions to SHA + add `permissions:` block (PR #10 — TBD)

## [0.1.0] — 2026-04-29 — Sprint 1 foundation

First scaffolded release. No public-facing functionality yet — establishes
the monorepo, design system, and CI surface so subsequent sprints add
features non-destructively.

### Added
- pnpm workspace + Turborepo (`pnpm-workspace.yaml`, `turbo.json`).
- Web app (`apps/web`): Next.js 15 App Router + React 19 + Tailwind v4. Landing page renders 12-stage color card grid for token-sync verification.
- Android app (`apps/android`): Kotlin 2.0.21 + Jetpack Compose (BOM 2024.12.01) + Material 3, `minSdk 26 / targetSdk 35`. First screen renders identical 12-stage color card grid.
- `@career/design-tokens` package: 12 stages × 5 shades (50/100/500/700/900) Okabe-Ito palette, single source of truth at `packages/design-tokens/src/stages.ts`. Vitest WCAG contrast tests.
- `@career/schema` package: Zod schemas for `DocumentBase` (13 `DocumentType`s, `KillerClass`, `EngineId`, `EvaluationMode`) and `CareerProfileMinimal` (Persona A-F, Language, TargetJob, Preferences). Schema validation tests.
- Supabase migration `0001_init.sql`: 6 tables — `project`, `document`, `document_version`, `document_snapshot`, `task`, `memory`. RLS policies deferred to S2; pgvector deferred to S24.
- GitHub Actions CI: Node job (typecheck · build · test · web build) + Android job (lint · `assembleDebug`).
- `README.md` (project layout · prerequisites · common commands), `CLAUDE.md` (tech stack · working agreements).

### Known gaps (audit findings)
See [`docs/audit/`](./docs/audit/) for the SimonK-stack end-to-end audit
producing a composite **5.4 / 10**. Top blockers tracked in
[`docs/audit/90-action-items.md`](./docs/audit/90-action-items.md):
- No RLS policies (S2 dependency, intentional).
- `.env.example` absent (PR #5 fix-now).
- CLAUDE.md verification loop coverage 1/7 (PR #6 fix-now).
- Pretendard declared but not loaded (PR #8 fix-now).
- App Router boundaries + SEO triad missing (PR #7 fix-now).
- DESIGN.md absent (PR #9 fix-now).
- pnpm 9 EOL on 2026-04-30 (PR #4 urgent).

### Out of scope
- OAuth (S2-S3): Google · Apple · Email Magic Link · Kakao · Naver · LinkedIn.
- Document editor + Yjs CRDT (S9). 7대 기능 LLM workflows (S6-S16). Astro blog (S17). Payments (S18 — PortOne, since Iamport is deprecated). Memory system / pgvector (S24-S25). iOS build.

[Unreleased]: https://github.com/Simon-YHKim/Career-manager/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/Simon-YHKim/Career-manager/releases/tag/v0.1.0
