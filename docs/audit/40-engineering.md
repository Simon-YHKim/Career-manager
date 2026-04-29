# Phase 4 — 구현 (Engineering) Audit

**Skills**: `review` + `nextjs-optimizer`
**Inputs**: 12 sampled files (web, schema, tokens, CI, Android, SQL)
**Date**: 2026-04-29

## Summary

- **Composite engineering score: 7.0 / 10**
  - Strict TS + Zod schema + WCAG token utilities = strong foundation
  - Web layer is a token-parity scaffold only — missing standard Next.js production guardrails (`error.tsx`, `loading.tsx`, OG meta, sitemap/robots, env validation)
  - No application code paths to test yet; coverage gap is structural, not regression
- **Top 3 issues**:
  1. `apps/web` lacks `error.tsx` / `loading.tsx` / `not-found.tsx` — standard App Router production triad missing
  2. `apps/web/app/layout.tsx` SEO/social surface is minimal — no `openGraph`, `twitter`, `metadataBase`, no `robots.txt`/`sitemap.ts`
  3. No `.env.example` and no env-validation module (`@t3-oss/env-nextjs` or hand-rolled Zod) — Sprint 2 Supabase wiring will introduce unguarded `process.env.NEXT_PUBLIC_SUPABASE_*` reads unless seeded now

## A. Code review

| # | File:Line | Issue | Severity |
|---|---|---|---|
| 1 | `apps/web/app/layout.tsx:1-17` | Metadata is title+description only; no `openGraph`, `twitter`, `metadataBase`, `icons`. Will hurt link-share appearance from day one. | M |
| 2 | `apps/web/app/layout.tsx:13` | `<html lang="ko">` hardcoded — minor; but spec is bilingual (ko/en). Acceptable for S1, file as report-only. | L |
| 3 | `apps/web/app/page.tsx` | No `<h1>`/`<h2>` semantic gap, but `Sprint 1 · Foundation` `<p>` precedes `<h1>` — minor a11y reading order nit. | L |
| 4 | `apps/web/components/StageCard.tsx:34` | Inline literal `#0b0f17` / `#ffffff` — should derive from `stages[stageKey]["50"]`/`["900"]` or a neutral token to avoid drift. | L |
| 5 | `apps/web/next.config.mjs` | No `images.remotePatterns`, no `experimental.typedRoutes`, no `headers()` for security (CSP, X-Frame-Options). Acceptable for S1; flag for S2 when Auth lands. | M |
| 6 | repo-wide | No `.env.example` at repo root or in `apps/web/`. Sprint 2 begins Supabase wiring → unguarded `process.env.NEXT_PUBLIC_SUPABASE_URL` reads will fail silently in dev. | **H** |
| 7 | `tsconfig.base.json` | `strict: true` + `noUncheckedIndexedAccess: true` — excellent. No `any` found in sampled files. ✅ | — |
| 8 | `packages/design-tokens/src/contrast.ts:15` | `as unknown as [string, string, string, string]` — unavoidable narrowing after regex match; safe given the regex anchors. ✅ | — |
| 9 | `packages/schema/src/document.ts:45` | `body: z.unknown()` — intentional per comment ("type-narrowed downstream"). Track that S4 lands the discriminated union. | L (deferred) |
| 10 | `supabase/migrations/0001_init.sql:1-80` | No RLS — explicitly deferred to S2 per file header. SQL itself uses no string interpolation (DDL only). ✅ | — |
| 11 | `apps/android/.../MainActivity.kt` | Standard Compose entry, `enableEdgeToEdge()` set. No issues for S1 scaffold. ✅ | — |

**No `any` types, no unguarded `process.env.X`, no SQL string interpolation, no LLM trust boundaries (no LLM yet), no hardcoded secrets** found in the 12 sampled files. The strict-TS posture is real.

## B. Next.js 5-axis perf

| Axis | Status | Finding | Fix |
|---|---|---|---|
| Images | N/A | No `<img>` and no `next/image` in scaffold (only CSS `backgroundColor`). Re-audit when S2 adds avatars/logos. | Use `next/image` w/ `width`/`height` to prevent CLS when introduced. |
| Render strategy | OK | `app/page.tsx` is a pure RSC (no `'use client'`, no client APIs). `StageCard.tsx` also RSC-compatible. Static by default at build. | Add `export const dynamic = 'force-static'` once known, or `revalidate` once data wiring lands (S2). |
| Code splitting | N/A | No `dynamic()` imports. Page tree is trivial; bundle is dominated by React 19 + Tailwind runtime. No bloat candidates. | Re-audit at S4 when document editor lands — that's the natural `dynamic()` boundary. |
| Script loading | OK | No `<script>` / `next/script` usage. No analytics, no third-party. | Use `next/script strategy="afterInteractive"` or `lazyOnload` when adding analytics. |
| Data caching | N/A | No `fetch`, no `unstable_cache`, no `revalidateTag`. Page is fully static. | Plan tag taxonomy for S2 (`user:{id}`, `doc:{id}`) before first authenticated fetch lands. |

**Bundle baseline**: not measured in audit env; CI confirmed green build on PR #1 (Node + Android jobs).

## C. Test coverage gap

| Module | Tests? | Gap |
|---|---|---|
| `packages/design-tokens/contrast` | ✓ (`contrast.test.ts`) | Verify adversarial cases: invalid hex (3-char, no `#`), all-white/all-black edge ratios, lowercase vs uppercase parity. |
| `packages/schema/document` | ✓ (`document.test.ts`) | Verify rejection of: invalid UUID, oversize `title` (>200), unknown `type` enum, naive ISO datetime. |
| `packages/schema/career-profile` | ✗ | No test file. Add Zod parse tests for Persona, Language, salary non-negativity, `career_thesis` 280-char cap. |
| `apps/web` | ✗ | No tests. Acceptable for S1 (pure scaffold); add Playwright/Vitest harness in S2 alongside Auth. |
| `apps/android` | ✗ | No JVM/Compose tests. Add `androidx.compose.ui.test` smoke (theme renders, no crash) in S2. |
| `supabase/migrations` | ✗ | No psql apply test in CI. Add `supabase db reset` smoke in CI before S2 RLS lands (catches malformed SQL pre-merge). |

## D. Build graph

**`turbo.json`** — correct: `build`, `typecheck`, `test` all `dependsOn: ["^build"]`, so `apps/web`'s tasks wait for `packages/*` to emit `dist/` first. Outputs include `dist/**` and `.next/**` (with `!.next/cache/**`). ✅

**`.github/workflows/ci.yml`** — step order is correct and matches the PR #1 fix:
1. corepack → pnpm 9.12.3
2. `pnpm install --frozen-lockfile`
3. `pnpm --filter "./packages/*" build` ← **packages built first** so web can read their `.d.ts`
4. `pnpm -r typecheck`
5. `pnpm --filter "./packages/*" test`
6. `pnpm --filter web build`

Android job runs in parallel with `setup-java@v4` (Temurin 17) + `setup-android@v3`, then `lint` and `assembleDebug`. ✅

**Concurrency group** `ci-${{ github.ref }}` with `cancel-in-progress: true` is the recommended pattern. ✅

Minor gap: no `pnpm lint` step, no `actions/cache` for pnpm store / Gradle cache. Acceptable for S1; CI is fast enough today.

## Recommended fixes

### fix-now (S1.1 polish, ~1 PR)

- [ ] `apps/web/app/error.tsx` — App Router error boundary
- [ ] `apps/web/app/loading.tsx` — route-level Suspense fallback
- [ ] `apps/web/app/not-found.tsx` — 404 page
- [ ] `.env.example` at repo root + `apps/web/.env.example` — seed the Supabase keys before S2 needs them
- [ ] `apps/web/app/sitemap.ts` + `apps/web/public/robots.txt`
- [ ] OG/Twitter/`metadataBase`/icons in `apps/web/app/layout.tsx`
- [ ] Replace inline `#0b0f17`/`#ffffff` in `StageCard.tsx` with token shades

### report-only (defer to owning sprint)

- [ ] RLS policies — owned by S2 (security phase, `security-orchestrator`)
- [ ] Compose UI test infra (`androidx.compose.ui.test`) — S2 alongside Auth screen
- [ ] `supabase db reset` smoke in CI — add when first non-trivial migration lands (S2)
- [ ] Env validation module (`@t3-oss/env-nextjs` or Zod-based) — add the moment first `process.env.X` read appears in `apps/web`
- [ ] CSP + security headers in `next.config.mjs` — S2 with Auth
- [ ] `experimental.typedRoutes` — opt in once routes stabilize
- [ ] `pnpm lint` step + `actions/cache` for pnpm/Gradle — DX polish

## Decision queue

- [ ] **Env validation strategy**: `@t3-oss/env-nextjs` (typed, opinionated) vs hand-rolled Zod module in `packages/env`? Decide before S2 Supabase wiring.
- [ ] **Test runner for `apps/web`**: Vitest+Testing-Library (matches packages) vs Playwright (e2e from day one)? Recommend Vitest for unit + Playwright for one smoke flow.
- [ ] **Android test scope**: Compose UI tests on emulator in CI (slow, flaky) vs Robolectric/JVM-only (fast, less coverage)? Recommend Robolectric for S2.
- [ ] **CI cache**: enable `actions/cache` for pnpm store + Gradle now, or wait until CI exceeds 5 min? Currently green and fast; defer.
