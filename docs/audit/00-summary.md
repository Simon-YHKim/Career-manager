# Career Manager — End-to-End Audit Summary

**Audit branch**: `audit/career-manager`
**Audit target**: `main` (empty) vs `claude/android-web-app-Kmvku` (PR #1 — Sprint 1, 54 files)
**Date**: 2026-04-29
**Skill set used**: SimonK-stack vendored at PR #2 (`chore/simonk-stack`)
**Scope**: 기획 · 리서치 · 디자인 · 구현 · 보안 · DX · 퍼블리싱
**Excluded**: 마케팅 (사용자 결정으로 별도 세션)

---

## Composite health score: **5.4 / 10**

(unweighted average of 6 phase scores; planning has no numeric score)

| Phase | Score | Skill |
|---|---|---|
| 1. 기획 | _qualitative — 3 blockers, 4 majors_ | `office-hours` |
| 2. 리서치 | _qualitative — 3 red risks_ | `simon-research` |
| 3. 디자인 | **5.4 / 10** | `plan-design-review` |
| 4. 구현 | **7.0 / 10** | `review` + `nextjs-optimizer` |
| 5. 보안 | **5.5 / 10** | `security-orchestrator` |
| 6. DX | **6.5 / 10** | `plan-devex-review` |
| 7. 퍼블리싱 | **3.0 / 10** | `/ship` + `land-and-deploy` readiness |

S1 스캐폴딩 자체의 코드 품질은 견고하나 (구현 7.0), 운영 표준 (`.env.example`, `error.tsx`/`loading.tsx`, `VERSION`, `CHANGELOG`, `DESIGN.md`, verification loop, robots.txt, sitemap.ts) 이 거의 전무하여 퍼블리싱 readiness 가 3.0 으로 떨어진다. 보안은 RLS 가 S2 로 명시적으로 미뤄졌기 때문에 5.5 인 것이지, S2 후 RLS 가 들어오면 정상적인 수준에 도달한다.

---

## Phase outputs

| Phase | Skill(s) | Report |
|---|---|---|
| 1. 기획 (Planning) | `office-hours` | [10-planning.md](./10-planning.md) |
| 2. 리서치 (Research) | `simon-research` | [20-research.md](./20-research.md) |
| 3. 디자인 (Design) | `plan-design-review` | [30-design.md](./30-design.md) |
| 4. 구현 (Engineering) | `review` + `nextjs-optimizer` | [40-engineering.md](./40-engineering.md) |
| 5. 보안 (Security) | `security-orchestrator` 5-stage | [50-security.md](./50-security.md) |
| 6. DX | `plan-devex-review` | [60-devex.md](./60-devex.md) |
| 7. 퍼블리싱 (Publishing) | `/ship` + `/land-and-deploy` readiness | [70-publishing.md](./70-publishing.md) |
| 8. Action items | (consolidation) | [90-action-items.md](./90-action-items.md) |

---

## Top blockers (cross-phase)

가장 자주 등장하는 갭 — multiple phases 가 동일하게 지적한 항목 (severity 가중 ↑):

1. **`.env.example` 부재** — phase 4, 5, 6, 7 (4×). DX·보안·deploy 모두 차단. → **fix-now**
2. **`pnpm 9 EOL = 2026-04-30 (내일)`** — phase 2. toolchain 부지원 직전. → **urgent fix-now (pnpm 10 bump + lockfile 재생성)**
3. **CLAUDE.md verification loop 부재 (1/7)** — phase 6. Boris Cherny 원칙 미실현. → **fix-now**
4. **Pretendard 폰트가 Tailwind 에 선언됐지만 next/font 로드 없음** — phase 3. UI 가 시스템 산세리프로 렌더 중. → **fix-now**
5. **RLS 가 6 테이블 모두 부재** — phase 5. S2 명시적 미루기지만 prod blocker. → **S2-or-later**
6. **`error.tsx` / `loading.tsx` / `not-found.tsx` triad 부재** — phase 4. Next.js 표준 boundary. → **fix-now**
7. **`VERSION` / `CHANGELOG.md` 부재** — phase 7. `/ship` skill 전제 조건. → **fix-now**
8. **`content_hash` 가 client-trusted** — phase 5. server-side 트리거로 재계산 필요. → **S2-or-later (Auth 들어온 뒤)**
9. **JSONB body 크기 무제한** — phase 5. app + DB CHECK 캡 필요. → **S2-or-later**
10. **배포 플랫폼 미결정** — phase 7. `/land-and-deploy` 실행 불가. → **decision pending (Vercel 권장)**

---

## Decision queue (사용자 결정 필요)

- [ ] 7대 기능 정의 (현재 13 DocumentType enum 만 존재)
- [ ] Persona A-F 각각의 prose 정의
- [ ] Narrowest wedge 확정 (audit 권장: `cover_letter × Persona B 신입`)
- [ ] Single-user vs multi-tenant 궤적 (sharing 도입 시점)
- [ ] Web 배포 플랫폼 (Vercel · Fly · Render — Vercel 권장)
- [ ] Android 배포 경로 (Play 내부 · closed beta · public)
- [ ] 결제 provider (Toss · PortOne · Stripe — S18 직전 결정, Iamport 는 deprecated)
- [ ] OAuth provider 우선순위 (Naver 는 Supabase 네이티브 미지원, custom OIDC 필요)
- [ ] 프로덕션 도메인 + Supabase 프로젝트

자세한 후속 PR 큐 → [90-action-items.md](./90-action-items.md).
