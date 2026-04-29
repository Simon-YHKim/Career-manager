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

## What's next (S2)

- Supabase Auth client wiring (Web + Android)
- OAuth providers: Google + Apple + Email Magic Link first; Kakao/Naver/LinkedIn in S3
- RLS policies on the tables created in `0001_init.sql`
- Onboarding flow that produces a `CareerProfileMinimal` row
