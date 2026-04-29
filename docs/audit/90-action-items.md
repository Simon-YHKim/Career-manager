# Action Items — Severity-sorted후속 작업 큐

**Date**: 2026-04-29
**Source**: phases 1-7 audit reports

---

## Legend

- **Severity**: blocker · major · minor · nit
- **Type**: fix-now (별도 작은 PR) · S2-dep (Auth/RLS 시점) · S6+-dep (LLM 기능 시점) · S18-dep (결제) · decision (사용자 결정 필요) · report-only
- **Owner**: claude · user

---

## 🟥 Blockers

| # | Item | Phase | Type | Owner | Note |
|---|---|---|---|---|---|
| 1 | pnpm 9 → 10 마이그레이션 | 2 | fix-now (urgent) | claude | 2026-04-30 EOL. `package.json` engines 업데이트 + lockfile 재생성 + Vercel build smoke test |
| 2 | `.env.example` 작성 | 4·5·6·7 | fix-now | claude | NEXT_PUBLIC_SUPABASE_URL / ANON_KEY / SERVICE_ROLE / PROJECT_REF / DB_PASSWORD / SITE_URL placeholder |
| 3 | CLAUDE.md `## Verification commands` 섹션 | 6 | fix-now | claude | dev / typecheck / test / lint / build / DB / browser URL — 7 entries |
| 4 | Pretendard `next/font` 로드 | 3 | fix-now | claude | `apps/web/app/layout.tsx` 에 `next/font/local` 또는 `next/font/google` (Pretendard Variable) |
| 5 | Next.js App Router triad — `error.tsx` / `loading.tsx` / `not-found.tsx` | 4 | fix-now | claude | `apps/web/app/` 표준 파일 추가 |
| 6 | `VERSION` + `CHANGELOG.md` | 7 | fix-now | claude | `0.1.0` (Android 와 일치) + Sprint 1 entry |
| 7 | RLS 정책 6 테이블 모두 | 5 | S2-dep | user+claude | `0002_rls.sql` migration. `auth.uid() = user_id` pattern. |
| 8 | 배포 플랫폼 결정 | 7 | decision | user | Vercel (권장) · Fly · Render. 결정 후 `vercel.json` / `fly.toml` 추가 |

---

## 🟧 Majors

| # | Item | Phase | Type | Owner | Note |
|---|---|---|---|---|---|
| 9 | `content_hash` server-side 트리거로 재계산 | 5 | S2-dep | claude | client-trusted 면 audit chain 손상 가능. supabase function/trigger |
| 10 | JSONB `body` 크기 캡 | 5 | S2-dep | claude | app-side Zod refine + DB CHECK constraint |
| 11 | OG meta + Twitter Card + `metadataBase` | 4 | fix-now | claude | `apps/web/app/layout.tsx` `metadata` 객체 확장 |
| 12 | `app/sitemap.ts` + `public/robots.txt` | 4·7 | fix-now | claude | 출시 전까지 `Disallow: /` |
| 13 | `app/api/health/route.ts` health 엔드포인트 | 7 | fix-now | claude | `{status, commit, version}` JSON, `/canary` 전제 |
| 14 | GitHub Actions SHA 핀닝 | 5 | fix-now | claude | `actions/checkout@<sha>`, `actions/setup-node@<sha>`, `gradle/actions/setup-gradle@<sha>` |
| 15 | Workflow `permissions:` 블록 (least privilege) | 5 | fix-now | claude | `permissions: { contents: read }` for read-only jobs |
| 16 | `.nvmrc` (Node 20) | 6 | fix-now | claude | engines 와 일관 |
| 17 | `CONTRIBUTING.md` (branch · commit · PR convention) | 6 | fix-now | claude | `feat/` `fix/` for human devs alongside `claude/<topic>-<id>` |
| 18 | `DESIGN.md` (font · color · spacing · motion · brand 정책) | 3 | fix-now | claude | < 200 lines, opinionated |
| 19 | `StageCard.tsx:34` inline `#0b0f17` / `#ffffff` 제거 | 4 | fix-now | claude | tokens 우회 방지 |
| 20 | Naver OAuth 구현 spike (Supabase 네이티브 미지원) | 2·3-dep | S3-dep | user+claude | custom OIDC 또는 server-side `/api/auth/naver/callback` 1-day spike |
| 21 | 결제 provider 마이그레이션 — Iamport 는 deprecated | 2 | S18-dep | user | PortOne SDK + 2026 3DS mandate. CLAUDE.md 참조 갱신 |
| 22 | 7대 기능 정의 (현재 13 DocumentType enum 만) | 1 | report-only / decision | user | `docs/product/features.md` 작성 권장 |
| 23 | Persona A-F prose 정의 | 1 | report-only / decision | user | schema enum 옆에 `docs/product/personas.md` |
| 24 | Narrowest wedge 확정 | 1 | decision | user | audit 권장: `cover_letter × Persona B 신입` |
| 25 | Pretendard `tailwind.config.ts` 선언만 있고 실제 로드 안 됨 | 3 | fix-now | claude | (#4 와 동일 — 통합) |

---

## 🟨 Minors

| # | Item | Phase | Type | Owner | Note |
|---|---|---|---|---|---|
| 26 | `career-profile.ts` Zod parse 테스트 | 4 | fix-now | claude | adversarial inputs (invalid persona enum, oversized strings) |
| 27 | Compose UI 테스트 인프라 | 4 | report-only | claude | `:app:connectedAndroidTest` + UI test for `CareerProfileScreen` |
| 28 | Supabase migration apply 테스트 (CI) | 4·7 | report-only | claude | `psql -f 0001_init.sql` against ephemeral postgres in CI |
| 29 | Web↔Android 토큰 codegen | 3 | report-only | claude | TS → Kotlin codegen (Style Dictionary 또는 자체 스크립트). drift 자동 감지 |
| 30 | `.editorconfig` | 6 | fix-now | claude | tab/space, line ending |
| 31 | Lighthouse CI / Vercel Speed Insights | 7 | report-only | claude | 첫 deploy 후 |
| 32 | Sentry / 에러 추적 | 7 | S2-dep | claude | free tier 충분 |
| 33 | next.config.mjs 보안 헤더 (CSP, HSTS, X-Frame-Options) | 7 | fix-now | claude | 출시 직전 강화 |
| 34 | Android `signingConfig` (release build) | 7 | decision-dep | user | Play 배포 결정 후 |
| 35 | PR template `.github/pull_request_template.md` | 7 | fix-now | claude | summary / test plan / blast radius |

---

## 🟦 Nits

| # | Item | Phase | Type | Owner | Note |
|---|---|---|---|---|---|
| 36 | `package.json` root version `0.0.0` ↔ Android `0.1.0` 불일치 | 7 | fix-now | claude | `0.1.0` 으로 통일 (#6 과 묶음) |
| 37 | README troubleshooting 섹션 (`pnpm -r typecheck` 빌드 선행 등) | 6 | fix-now | claude | 신규 dev 의 hidden gotcha |
| 38 | `pnpm dev` 루트 어그리게이터 스크립트 | 6 | fix-now | claude | `turbo run dev` |

---

## Fix-now PR 분할 제안

audit 본 PR (`audit/career-manager`) 와 별개로 다음 작은 PR 들을 각각 만든다 (병렬 review 가능):

| PR | 브랜치 | 포함 항목 | 의존성 |
|---|---|---|---|
| #A | `fix/pnpm-10-bump` | #1 (pnpm 9→10) | none — **first, urgent** |
| #B | `fix/env-example` | #2 (.env.example) | none |
| #C | `fix/claude-md-verification-loop` | #3 (verification commands), #16 (.nvmrc), #17 (CONTRIBUTING.md), #37 (troubleshooting), #38 (pnpm dev) | none |
| #D | `fix/web-app-router-triad` | #5 (error/loading/not-found), #11 (OG meta + metadataBase), #12 (sitemap + robots), #13 (health endpoint), #19 (StageCard inline color) | none |
| #E | `fix/font-pretendard` | #4 + #25 (Pretendard next/font) | none |
| #F | `fix/design-md-draft` | #18 (DESIGN.md) | E (폰트 결정 후) |
| #G | `fix/release-meta` | #6 (VERSION), #7 (CHANGELOG), #36 (version 통일), #35 (PR template) | none |
| #H | `fix/ci-supply-chain` | #14 (Action SHA 핀닝), #15 (permissions block) | none |

총 8 PR. PR #A 가 가장 시급 (오늘 EOL).

---

## S2-or-later 항목 (Auth + RLS 들어올 때 함께)

- #7 RLS 정책
- #9 content_hash trigger
- #10 JSONB body 크기 캡
- #20 Naver OAuth (S3)
- #32 Sentry 통합

---

## Decision queue (사용자 결정 → 다음 세션 input)

- [ ] D1: 7대 기능 정의 — `cover_letter`, `experience_atom`, `jd_analysis`, ... 중 어느 것?
- [ ] D2: Persona A-F prose 정의
- [ ] D3: Narrowest wedge 확정 (audit 권장: `cover_letter × Persona B`)
- [ ] D4: Single-user vs multi-tenant 궤적
- [ ] D5: Web 배포 플랫폼 (Vercel 권장)
- [ ] D6: Android 배포 경로
- [ ] D7: 결제 provider (Iamport 제외; PortOne/Toss/Stripe 중)
- [ ] D8: OAuth provider 우선순위 + Naver 구현 방식
- [ ] D9: 프로덕션 도메인 + Supabase 프로젝트 ref

각 결정은 `docs/decisions/<DXX>-<slug>.md` 로 기록 권장 (ADR 패턴).
