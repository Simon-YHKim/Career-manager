# Phase 7 — 퍼블리싱 (Publishing) Readiness Audit

**Skill applied**: `/ship` + `land-and-deploy` + `canary` (readiness — no actual deploy)
**Inputs scanned**: `.github/workflows/ci.yml`, `CLAUDE.md`, `README.md`, `package.json`, `apps/web/next.config.mjs`, `apps/android/app/build.gradle.kts`, `supabase/config.toml`, `supabase/migrations/0001_init.sql`, `.gitignore`, `turbo.json`
**Date**: 2026-04-29

---

## Summary

- **Deploy readiness composite**: **3/10** — CI is green and gating works, but every "what platform / where do prod secrets live / how does DB migrate" question is unanswered.
- **Blockers to first deploy**: **7** (no platform decision, no `.env.example`, no production Supabase project ref, no Android signing, no health endpoint, no error tracker, no robots.txt before public URL).
- **Decisions pending**: **4** (web platform, Android distribution, prod Supabase project, production domain).

---

## A. /ship readiness

| Item | Status | Severity if missing | Fix |
|---|---|---|---|
| `VERSION` file | ✗ absent | medium — `/ship` needs it for bump step | `0.1.0` (matches Android `versionName`) |
| `CHANGELOG.md` | ✗ absent | medium — release diff opaque | seed with Sprint 1 entry |
| Conventional Commits style | ◐ partial | low — only `chore:` / `ci:` so far, no `feat:`/`fix:` yet (pre-feature) | document allowed types in `CONTRIBUTING.md` |
| `.github/pull_request_template.md` | ✗ absent | low — Checklist drift across PRs | add template (security/tests/migration/tokens-mirror checks) |
| Branch convention `claude/<topic>-<id>` | ✓ documented in `CLAUDE.md` §16 | — | also allow `feat/` `fix/` for human contributors |
| CI tests gate | ✓ `pnpm --filter "./packages/*" test` (line 37) | — | extend to `apps/*` once apps gain tests |
| CI typecheck gate | ✓ `pnpm -r typecheck` (line 34) | — | — |
| CI build gate | ✓ web build + Android `assembleDebug` | — | add `assembleRelease` once signing config lands |
| `package.json` release script | ✗ no `release` / `version` script | low | optional — fold into `/ship` skill |
| `package.json` version | `0.0.0` | medium — placeholder, not aligned w/ Android `0.1.0` | bump to `0.1.0` alongside `VERSION` |

---

## B. /land-and-deploy readiness

### Deploy platform — **undecided ✗**

No platform config in repo (verified via `find -maxdepth 3`):

| File | Present? |
|---|---|
| `vercel.json` | ✗ |
| `fly.toml` | ✗ |
| `render.yaml` | ✗ |
| `netlify.toml` | ✗ |
| `Dockerfile` | ✗ |
| `docker-compose.yml` | ✗ |
| `Procfile` | ✗ |
| `apps/web/next.config.mjs` `output: 'standalone'` | ✗ (default Vercel/Node target) |

**Candidates**:
- **Vercel** — Next.js 15 native, App Router + React 19 first-class, zero ops, free tier covers S2-S5. Cons: vendor lock, edge cost grows after S18 launch, KR latency worse than Tokyo region of competitors.
- **Fly.io** — Tokyo (`nrt`) region near KR users, Docker-friendly, predictable cost. Cons: requires `Dockerfile` + standalone build + manual scaling tuning.
- **Render** — middle ground, simple. Cons: no KR/JP region (US/EU/SG only).
- **Self-host on Cloudflare Pages + Workers** — cheap, KR edge POPs. Cons: Next.js App Router compat is improving but still has rough edges with React 19 server components.

**Recommendation**: **Vercel for web** through S2-S5 (speed of iteration trumps cost), **Supabase Cloud** for DB. Re-evaluate at S18 (paid plans launch — cost visible). Mirror to **Fly.io `nrt`** if KR p95 latency exceeds 300 ms.

### env management — **needs `.env.example` ✗**

`.gitignore` lines 31-34 correctly exclude `.env*` but allow `!.env.example` — yet **no `.env.example` exists**. CI uses zero secrets today (verified: `ci.yml` references no `${{ secrets.* }}`).

Required env vars for first deploy (inferred from `supabase/config.toml` + Next.js conventions):

| Var | Where used | Scope |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | client + server | public (browser) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | client + server | public (browser) |
| `SUPABASE_SERVICE_ROLE_KEY` | server-only | secret — **never** prefix `NEXT_PUBLIC_` |
| `SUPABASE_PROJECT_REF` | CI for `supabase db push` | secret |
| `SUPABASE_DB_PASSWORD` | CI migrate step | secret |
| `NEXT_PUBLIC_SITE_URL` | OAuth redirect base | public, env-specific |

The anon-vs-service-role split is **not documented** anywhere — this is a classic leakage risk (S2 Auth work).

### Production URL — **undecided ✗**

No domain referenced in `package.json`, `CLAUDE.md`, `README.md`, or `supabase/config.toml` (which still hardcodes `http://localhost:3000` for `site_url` and `additional_redirect_urls`). OAuth providers in `config.toml` are all `enabled = false`, so the URL gap doesn't break local dev — but **must** be parameterized before S2 OAuth wiring.

### Android publishing — **debug only ✗**

`apps/android/app/build.gradle.kts`:
- `versionCode = 1`, `versionName = "0.1.0"` ✓
- `release` build type exists but has **no `signingConfig`** (line 19-27) — `assembleRelease` will produce an unsigned APK that no store accepts.
- CI runs `:app:assembleDebug` only (`ci.yml` line 61). No release signing path.
- `release.isMinifyEnabled = false` — should be `true` once Compose Compiler stable rules are confirmed for Kotlin 2.0.21.

Distribution path **not decided**: Play Store internal track? Closed beta? Side-loaded APK release? Android publishing is gated on this decision.

---

## C. /canary readiness

| Tool | Status | Recommendation |
|---|---|---|
| Production URL | ✗ | post first deploy |
| Health endpoint (`/api/health`) | ✗ — `apps/web/app/` has no `api/` directory at all | add `apps/web/app/api/health/route.ts` returning `{status:"ok", commit: process.env.VERCEL_GIT_COMMIT_SHA, ts: Date.now()}` |
| Error tracking | ✗ — no Sentry / Datadog / Bugsnag dep | Sentry free tier (5k events/mo) post S2 — covers web + Android via single org |
| Performance baseline | ✗ — no Lighthouse CI, no `@vercel/speed-insights` | enable Vercel Speed Insights at first deploy (free); add `nextjs-optimizer` skill output as Lighthouse regression gate at S5 |
| Synthetic monitoring | ✗ | UptimeRobot free / BetterStack free at first deploy |
| Console error tracker (browser) | ✗ | Sentry Browser SDK (overlap with above) |
| Android crash reporting | ✗ | Firebase Crashlytics or Sentry Android — decide alongside distribution path |

---

## D. DB migration strategy

- ✓ Append-only convention documented (`CLAUDE.md` line 22).
- ✓ Single migration today: `supabase/migrations/0001_init.sql` (tables only — RLS deferred per file header).
- ✗ **No CD step** runs `supabase db push` — migrations would deploy by hand only.
- ✗ **No dry-run** in CI (`supabase db diff --linked` against staging would catch destructive diffs).
- ✗ **No rollback plan** documented. Append-only forbids `DROP`; recovery from a bad migration is unspecified (compensating migration? PITR via Supabase? both?).
- ✗ Naming convention for next migrations not stated. Recommend: **zero-padded sequential** (`0002_rls.sql`, `0003_storage_buckets.sql`) — matches existing `0001_*` style. Supabase CLI default is timestamp (`20260429120000_*`); pick one and document.
- ✗ No staging Supabase project — production migrations would land untested.

---

## E. Secrets & env management

- ✗ **`.env.example` missing** — blocker. Devs and CI cannot bootstrap without trial-and-error. Listed in `.gitignore` allow-list (`!.env.example`) so the slot is reserved but empty.
- ✓ `.gitignore` correctly excludes `.env`, `.env.local`, `.env.*.local`.
- ✗ GitHub Actions secrets: zero used today (acceptable for CI-only, blocker for CD).
- ✗ Service role vs anon key split undocumented — at S2 a single careless `NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY` leaks DB superuser to every browser.
- ✗ Supabase `config.toml` `site_url = "http://localhost:3000"` is committed — fine for local CLI but must be overridden in prod via dashboard, not via this file. Add a comment.

---

## F. Pre-deploy checklist (Gstack `/ship` style)

| Check | Status |
|---|---|
| All tests pass on CI | ✓ (PR #1 CI green per existing audit notes) |
| Typecheck pass | ✓ |
| Build pass | ✓ (web + Android debug) |
| Branch up to date with `main` | ◐ — `main` has 1 commit (`035888a chore: seed main branch`), `claude/android-web-app-Kmvku` is +6 commits ahead. No drift to rebase yet. |
| `CHANGELOG` entry for this release | ✗ |
| `VERSION` bump | ✗ — file does not exist |
| PR description ready | ✓ (PR #1 has body per audit summary) |
| Reviewers assigned | unverified — no `gh` data in this audit shell |
| Security review passed | deferred — Phase 5 audit pending |
| DB migration reviewed | ◐ — `0001_init.sql` reviewed; no RLS yet (S2 scope) |

---

## G. Production hardening

| Concern | Status | Fix when |
|---|---|---|
| Next.js `output: 'standalone'` | not set — fine for Vercel, required for Fly/Docker | when platform decided |
| HTTP security headers (CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy) | ✗ none in `next.config.mjs` (lines 1-7 are minimal: only `reactStrictMode` + `transpilePackages`) | add `headers()` block before first deploy |
| `robots.txt` | ✗ — `apps/web/public/` does not exist | add **disallow-all** until launch (`User-agent: *\nDisallow: /`) |
| `sitemap.xml` | ✗ | generate via `next-sitemap` or App Router `app/sitemap.ts` once routes stabilize (S5+) |
| `apps/web/public/` | ✗ — directory missing entirely | create on first asset commit |
| Favicon / app icons | ✗ | add with first design pass |
| `metadata` SEO defaults in `app/layout.tsx` | unverified — likely Next default placeholder | replace with localized title/description + `openGraph` block |
| Rate limiting | ✗ — N/A until S2 API routes exist | Upstash Redis or Supabase Edge function gate at S2 |
| CSRF protection | server actions only (Next.js handles) | revisit when REST endpoints land |

---

## Recommended fixes

### fix-now (small PR, before any deploy attempt)

- [ ] `VERSION` file → `0.1.0` (mirrors Android `versionName`)
- [ ] `package.json` `version: "0.0.0"` → `"0.1.0"`
- [ ] `CHANGELOG.md` → seed Sprint 1 entry
- [ ] `.env.example` → placeholders for the 6 vars in section B
- [ ] `apps/web/app/api/health/route.ts` → `{status:"ok", commit, ts}` stub
- [ ] `apps/web/public/robots.txt` → `User-agent: *\nDisallow: /` (lift on launch)
- [ ] `.github/pull_request_template.md` → security / tests / migration / token-mirror checklist
- [ ] `next.config.mjs` `headers()` → CSP report-only + HSTS + X-Frame-Options DENY
- [ ] `supabase/config.toml` → comment that `site_url` is local-only; prod via dashboard

### report-only / decision-pending

- [ ] **DECISION D-1**: web deploy platform — Vercel vs Fly.io `nrt` vs Render
- [ ] **DECISION D-2**: Android distribution — Play Store internal / closed beta / public APK
- [ ] **DECISION D-3**: production Supabase project — separate org or sub-project; staging mirror?
- [ ] **DECISION D-4**: production domain — `career-manager.app` / `careermanager.io` / branded
- [ ] Sentry web + Android integration (post S2)
- [ ] `vercel.json` or `fly.toml` (after D-1)
- [ ] CD workflow — `supabase db push` step gated on staging migration diff
- [ ] Android signing config + `:app:assembleRelease` in CI (after D-2)
- [ ] Lighthouse CI / Vercel Speed Insights wiring at S5
- [ ] Status page (BetterStack / Instatus) at first public launch

---

## Decision queue

1. **D-1** Web deploy platform (Vercel recommended)
2. **D-2** Android distribution path
3. **D-3** Production Supabase project + staging mirror policy
4. **D-4** Production domain registration

Until D-1 and D-3 are chosen, **`/land-and-deploy` cannot run end-to-end**. Until D-2 is chosen, **Android shipping path is undefined**. The fix-now list is independent of all four decisions — those changes can ship today inside PR #1's branch or as a follow-up.
