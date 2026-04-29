# Phase 2 — 리서치 (Research) Audit

**Skill applied**: `simon-research` (stack-risk matrix mode)
**Inputs scanned**: `apps/web/package.json`, `apps/android/gradle/libs.versions.toml`, `package.json` (root), `supabase/migrations/0001_init.sql`, `CLAUDE.md`
**Date**: 2026-04-29

## Summary

- **pnpm 9 reaches End-of-Support tomorrow (2026-04-30).** Root `package.json` pins `pnpm@9.12.3` and `engines.pnpm: ">=9.0.0"`. This flips from green to **red** within 24 hours and is the single most urgent fix in this audit.
- **Web stack is one major version behind upstream.** Next.js 15.1.3 vs current 16.2.4 (released 2026-04-16). Next.js 15.x is supported but the migration must be on the S2/S3 backlog before the LTS window closes.
- **Android stack is a full quarter behind.** Compose BOM 2024.12.01 is two cycles stale (BOM 2026.03.00 ships Compose 1.11). Kotlin 2.0.21 trails 2.3.20 (Mar 2026) by two minor versions.
- **Two Korean integrations carry hard red risks**: Naver OAuth has *no* official Supabase Auth provider (custom OIDC required), and the legacy `iamport` npm package was deprecated on 2026-03-04 — S18 must use PortOne (V2) from day one.
- **3DS is now a Korea regulatory requirement in 2026** (no longer a "security choice"). Toss Payments integration in S18 must enable 3DS by default; webhook (`PAYMENT_STATUS_CHANGED`) recommended for async result confirmation.
- **pgvector HNSW 2000-dim ceiling** locks embedding model choice for S24 — `text-embedding-3-small` (1536) ✓; `text-embedding-3-large` (3072) requires `halfvec` or truncation.

## Stack risk matrix

| # | Item | Version in PR #1 | Latest (2026-04) | Risk | Source | Note |
|---|---|---|---|---|---|---|
| 1 | Next.js | 15.1.3 | 16.2.4 (released 2026-04-16) | yellow | https://nextjs.org/blog/next-16-2 ; https://endoflife.date/nextjs | 15.x still supported; plan upgrade post-S2. |
| 2 | React | 19.0.0 | 19.x stable | green | https://nextjs.org/blog/next-15 | React 19 GA; supported by Next 15 and 16. |
| 3 | Tailwind CSS | 4.1.13 | 4.x stable | green | https://tailwindcss.com/blog | v4 stable since early 2025; CSS-native `@theme` aligns with our token strategy. |
| 4 | Compose BOM | 2024.12.01 | 2026.03.00 (April '26 ships Compose 1.11) | yellow | https://android-developers.googleblog.com/2026/04/jetpack-compose-april-2026-updates.html ; https://developer.android.com/develop/ui/compose/bom | Two BOM cycles behind. Bump before S2 Android Auth wiring; verify Material 3 components against new BOM. |
| 5 | Kotlin | 2.0.21 | 2.3.20 (released 2026-03) | yellow | https://blog.jetbrains.com/kotlin/2026/03/kotlin-2-3-20-released/ ; https://kotlinlang.org/docs/whatsnew23.html | 2.3.x adds context parameters and a simpler Compose plugin. AGP 8.7.3 also one release line behind. |
| 6 | Supabase pgvector | extension TODO (S24) | included free, all tiers; HNSW max 2000 dim (`vector`), 4000 (`halfvec`) | yellow | https://supabase.com/pricing ; https://github.com/pgvector/pgvector/issues/461 ; https://www.dbi-services.com/blog/pgvector-a-guide-for-dba-part-2-indexes-update-march-2026/ | Free tier 500 MB DB → insufficient for 1M embeddings. Plan: Pro (8 GB) + 1536-dim model. |
| 7 | Yjs (S9) | not yet pinned | Yjs 13.x (~900k weekly DLs); Hocuspocus stable; PartyKit/Liveblocks managed | green | https://www.npmjs.com/package/yjs ; https://tiptap.dev/docs/hocuspocus/getting-started/overview | Yjs is the de-facto CRDT. Hocuspocus = self-host; PartyKit/Liveblocks = managed. |
| 8 | Kakao OAuth (S3) | not yet wired | officially supported by Supabase Auth | green | https://supabase.com/docs/guides/auth/social-login/auth-kakao | First-class provider; admin-key vs app-key separation handled in callback config. |
| 9 | Naver OAuth (S3) | not yet wired | **NOT supported natively**; custom OIDC required | **red** | https://github.com/orgs/supabase/discussions/35631 ; https://supabase.com/docs/guides/auth/custom-oauth-providers | Open feature request since 2024. Use Supabase Custom OAuth/OIDC or roll a server-side flow. Korea market parity demands this. |
| 10 | LinkedIn OAuth (S3) | not yet wired | `linkedin_oidc` provider (legacy `linkedin` deprecated) | green | https://supabase.com/docs/guides/auth/social-login/auth-linkedin | Use `provider: 'linkedin_oidc'`. Apps created pre-2023-08-01 must re-create. |
| 11 | Toss Payments (S18) | not yet wired | V2 REST + 3DS + `PAYMENT_STATUS_CHANGED` webhook; **3DS regulatory in 2026** | yellow | https://docs.tosspayments.com/en/api-guide ; https://docs.tosspayments.com/en/overview ; https://blog.glomopay.com/why-3ds-is-the-new-mandatory-standard-for-your-online-payments/ | Korean two-track flow is synchronous; webhooks recommended. 3DS no longer optional in 2026 — confirm with legal before launch. |
| 12 | Iamport / PortOne (S18) | not yet wired | **legacy `iamport` npm DEPRECATED 2026-03-04**; use PortOne current SDK | **red** | https://www.npmjs.com/package/iamport ; https://github.com/iamport/iamport-rest-client-nodejs/blob/master/README.md ; https://developers.portone.io | Any plan that says "iamport" must be rewritten as "PortOne". Different request shape, different webhook signing. |
| 13 | next-intl | (not chosen) | latest, App Router-native; minor `'use cache'` gap with Next 16 | green (recommend) | https://next-intl.dev/docs/getting-started/app-router ; https://github.com/amannn/next-intl ; https://aurorascharff.no/posts/implementing-nextjs-16-use-cache-with-next-intl-internationalization/ | ~2 KB, RSC-native, middleware routing. Decide before any user-facing route ships. `'use cache'` interop pending `next/root-params`. |
| 14 | Turborepo | 2.3.3 (root devDep) | 2.9.6 (latest); 2.9 released 2026-03-30 | yellow | https://turborepo.dev/blog/2-9 ; https://www.npmjs.com/package/turbo | 6 minors behind; 2.9 brings up to 96% faster time-to-first-task and stable `turbo query`. Bump in next housekeeping PR. |
| 15 | pnpm | `packageManager: pnpm@9.12.3` (root) | 10.33.x stable; **pnpm 9 EOL 2026-04-30** | **red (effective 2026-04-30)** | https://endoflife.date/pnpm ; https://eosl.date/eol/product/pnpm/ ; https://pnpm.io/blog/releases/10.26 | Schedule pnpm 10 migration immediately. Update `packageManager` and `engines.pnpm`. Test Vercel + Turbo cache compatibility. |

## Top 3 red-risk items

### 1. pnpm 9 EOL 2026-04-30 (red — t-1 day)

> "pnpm 9 reaches its End of Support date on Apr 30, 2026." — endoflife.date / eosl.date (Apr 2026). https://endoflife.date/pnpm

Root `package.json` pins:

```
"packageManager": "pnpm@9.12.3",
"engines": { "pnpm": ">=9.0.0" }
```

Tomorrow this becomes an EOL dependency. The fix is mechanical (bump to `pnpm@10.33.x`, update `engines.pnpm: ">=10"`), but every contributor's local install and Vercel's build image must be aligned in the same PR. Test Turbo Remote Cache hits after the bump — pnpm 10's lockfile format change is the most common Turbo cache-miss source.

### 2. Naver OAuth has no official Supabase provider (red)

> "Supabase currently supports Kakao login but does not support Naver." — Supabase Discussion #35631 (open since 2024, still open as of 2026-04). https://github.com/orgs/supabase/discussions/35631

For a Korea-first product this is the single biggest auth gap. Two paths:

- **Custom OAuth/OIDC**: Supabase's Custom OAuth/OIDC Providers feature (https://supabase.com/docs/guides/auth/custom-oauth-providers) accepts arbitrary providers. Naver's endpoints are OAuth 2.0 (not strict OIDC), so token-exchange and userinfo mapping must be authored.
- **Server-side flow**: Implement `/api/auth/naver/callback` in Next.js, exchange code → access_token → userinfo, then `supabase.auth.admin.createUser` + signed JWT. More code, full control over Naver's quirks (token TTLs, refresh window, mandatory `state` checks).

S3 plan must allocate explicit time for one of these. Do not assume "Supabase has it" — it does not.

### 3. Legacy `iamport` npm deprecated; PortOne is the only path (red)

> "iamport-rest-client-nodejs ... deprecated as of March 4, 2026, with no official support provided." — iamport GitHub README + npm registry. https://github.com/iamport/iamport-rest-client-nodejs/blob/master/README.md ; https://www.npmjs.com/package/iamport

CLAUDE.md still says "Iamport" for S18. The plan doc must be updated to "PortOne". This is not just a rename — PortOne's current REST surface, webhook payload, and JS SDK initialization (`PortOne.requestPayment` vs the old `IMP.request_pay`) are all different. Any S18 design done against legacy iamport examples will need full rewrite. Combined with the **2026 Korea 3DS regulatory mandate** (https://blog.glomopay.com/why-3ds-is-the-new-mandatory-standard-for-your-online-payments/), the S18 spec must be rewritten end-to-end before any code ships.

## Recommendations

- **Migrate to pnpm 10 today/tomorrow.** Update root `packageManager` and `engines.pnpm`. Smoke-test Turbo Remote Cache and Vercel build.
- **Bump Turborepo 2.3.3 → 2.9.x** in the same housekeeping PR (low risk; major perf wins).
- **Schedule Next.js 15 → 16 migration** for S5 (after Auth + RLS settle). Track 15.x LTS deadline in the master plan.
- **Bump Compose BOM to 2026.03.00 and Kotlin to 2.3.20** in the same PR that wires Android Auth (S2). Validate Material 3 components against the new BOM before any custom theming lands.
- **Rewrite S18 plan now**: replace every "Iamport" with "PortOne"; add an explicit "3DS mandatory under Korea 2026 regulation" sub-bullet.
- **Decide i18n now**: add `next-intl` to S2 scope. Routing structure (`/[locale]/...`) affects every page from S2 onward.
- **S3 Naver OAuth spike**: 1-day spike before S3 commit — pick custom-OIDC vs server-side and document the chosen flow in `docs/auth/naver.md`.
- **S24 embedding model lock**: write down "1536-dim, OpenAI `text-embedding-3-small` or equivalent" in the master plan; do not leave it open. At 1M memories × 1536 dim × 4 bytes ≈ 6 GB raw → budget Pro tier minimum, plan cold-storage offload at scale.

## Decided

- **report-only items**: Next.js 15→16 (S5+), Compose BOM bump (S2 with Auth), Kotlin 2.3 bump (S2), Turborepo 2.9 bump (housekeeping PR), pgvector dim ceiling (document in S24 plan), i18n choice (S2 scope), Toss 3DS regulation (legal review before S18 launch).
- **fix-now items**:
  1. **pnpm 9 → 10** in root `package.json` before 2026-04-30.
  2. CLAUDE.md / master-plan text edits — replace "Iamport" with "PortOne"; add "Naver = custom OIDC" note next to S3 OAuth list. These doc edits are read-only of code but unblock honest planning for S3/S18.

---

**Word count**: ~1,180 words.
