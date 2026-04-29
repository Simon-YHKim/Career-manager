# CLAUDE.md

This is a monorepo for a Korea + Western unified career platform (Native Android + Next.js Web).
Sprint 1 has scaffolded the foundation. Future sprints add features non-destructively.

## Tech stack (decided)

- **Web**: Next.js 15 App Router + React 19 + Tailwind v4 + shadcn-style components (manual; no CLI)
- **Android**: Kotlin 2.0.21 + Jetpack Compose (BOM 2024.12.01) + Material 3, minSdk 26 / target 35
- **Shared**: pnpm workspaces + Turborepo, TypeScript strict, Zod
- **DB**: Supabase (Postgres + Auth + Storage + RLS) — migrations live in `supabase/migrations/`
- **Design tokens**: 12 stages × {50,100,500,700,900} shades, Okabe-Ito based palette
  - Single source of truth: `packages/design-tokens/src/stages.ts`
  - Android mirror (manual until codegen): `apps/android/app/src/main/kotlin/io/career/manager/ui/theme/Color.kt`

## Working agreements

- Edit only what the current task requires. Don't preemptively scaffold features for later sprints.
- Every LLM-bound output must pass Format Lock + Anti-Inflation + Truth-First (see master plan).
  These checks are NOT prompt-only — they will be enforced in code as features land.
- Web ↔ Android color tokens MUST stay in sync. When you change `stages.ts`, mirror to `Color.kt` in the same PR.
- Supabase migrations are append-only. Do not edit `0001_init.sql` after merge — write a new migration.
- Branch convention: feature work goes to `claude/<topic>-<id>` and is opened as draft PR.

## Verification commands

These are the commands Claude (and human devs) can run autonomously to verify
work without asking the user. Per Boris Cherny's verification-loop principle.

| Purpose | Command | Notes |
|---|---|---|
| Install deps | `pnpm install` | uses pnpm 10 via corepack |
| Build packages | `pnpm --filter "./packages/*" build` | must run before typecheck — web imports built `.d.ts` |
| Typecheck all | `pnpm -r typecheck` | requires packages built first |
| Run all tests | `pnpm -r test` | Vitest (contrast.test, document.test) |
| Build web | `pnpm --filter web build` | Next.js production build |
| Web dev server | `pnpm --filter web dev` | Turbopack, http://localhost:3000 |
| Lint web | `pnpm --filter web lint` | ESLint via `next lint` |
| Android lint | `cd apps/android && ./gradlew :app:lint` | requires JDK 17 + Android SDK 35 |
| Android debug build | `cd apps/android && ./gradlew :app:assembleDebug` | first run ~5-8 min, cached <2 min |
| DB migration apply | `psql -f supabase/migrations/0001_init.sql` | requires local Postgres; pgvector deferred to S24 |

**One-shot full check** (mirrors CI):

```bash
pnpm install --frozen-lockfile && \
  pnpm --filter "./packages/*" build && \
  pnpm -r typecheck && \
  pnpm --filter "./packages/*" test && \
  pnpm --filter web build
```

## What's next (S2)

- Supabase Auth client wiring (Web + Android)
- OAuth providers: Google + Apple + Email Magic Link first; Kakao/Naver/LinkedIn in S3
- RLS policies on the tables created in `0001_init.sql`
- Onboarding flow that produces a `CareerProfileMinimal` row
