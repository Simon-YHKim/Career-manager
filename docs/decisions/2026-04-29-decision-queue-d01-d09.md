# Decision queue D1-D9 — recommendations

**Date**: 2026-04-29
**Source**: [audit phase 1+7+8 (PR #3)](../audit/90-action-items.md)
**Status**: drafts — awaiting user confirmation per item.

각 항목은 audit 또는 sprint plan 에서 사용자 결정이 필요하다고 표시된 항목.
이 문서는 **권장 + 근거** 만 제시; 최종 채택은 사용자 confirm 후 별도 PR 로 commit.

각 D-N 마다:
- **Context** — 왜 결정해야 하는가
- **Options** — 후보 (있으면)
- **Recommend** — 권장 + 1-2줄 근거
- **Trade-off** — 권장이 깨질 수 있는 조건
- **Action if confirmed** — 채택 시 다음 단계

---

## D1 · 7대 기능 정의

**Context**: README · CLAUDE.md 가 "7대 기능 LLM 워크플로우 (S6-S16)" 라고만 표시. 실제 7개가 무엇인지는 미정의. schema 의 `DocumentType` enum 은 13개 (이미 너무 많음).

**Recommend**: 다음 7 기능으로 확정 (DocumentType 13개 중 일부는 단순 데이터 컨테이너로 분리, '기능' 은 LLM 이 실제로 작업해주는 단위로 한정).

| # | 기능 | DocumentType 매핑 | Sprint |
|---|---|---|---|
| 1 | **이력서 ATS-tuned 자동 생성** | `resume` | S6 |
| 2 | **경력기술서 풀어쓰기** | `career` | S6 |
| 3 | **자소서 reframe** (회사·공고 기반) | `essay` | S7 |
| 4 | **포트폴리오 OG-card 자동화** | `portfolio` | S8 |
| 5 | **모의면접 코칭** (피드백) | `interviewCoaching` | S11 |
| 6 | **모의면접 평가** (점수) | `interviewEvaluation` | S12 |
| 7 | **연봉 협상 시뮬레이션 + 시장 데이터** | `salary` | S13 |

`profile` · `experience` · `memory` 는 **기반 데이터** (input), `todo` · `blog` 는 **유틸리티** — '7대 기능' 에서 제외.

**Trade-off**: 향후 LLM 이 새 surface 를 만들면 (예: cover-letter generator) 8번째 추가 시 마케팅 카피 (`7대 기능`) 변경 필요.

**Action**: 확정 시 `docs/product/features.md` 작성 + README · CLAUDE.md 갱신.

---

## D2 · Persona A-F prose 정의

**Context**: schema `Persona` enum 은 A-F 코드만, 한 줄 라벨만 존재 (`career-profile.ts` 주석). UI 에서 사용자가 "내가 어디에 속하나?" 답할 때 한 줄 설명으로는 부족.

**Recommend**: 각 페르소나에 **(타겟 상황 · 핵심 고민 · 자주 막히는 곳)** 3 줄로 정의. 아래는 v1 초안:

| 코드 | 한 줄 라벨 | 타겟 상황 | 핵심 고민 | 자주 막히는 곳 |
|---|---|---|---|---|
| **A** 취린이 | 첫 직장 준비 중 (대학생·졸업 직후) | 경험이 부족해 보일까봐 | 자소서·이력서가 비어 보임 |
| **B** 신입 | 졸업 ~ 첫 1년 | 인턴·프로젝트를 어떻게 풀어쓸지 | 경험 atom 수가 적어 reframe 한계 |
| **C** 주니어 이직자 | 1-5년차 첫 이직 준비 | 다음 회사 fit · 연봉 점프 | 협상 처음 — counter 어떻게 |
| **D** 시니어 | 5-15년차 | tech lead/manager track 결정 | 깊이 있는 경력기술서 시간 부족 |
| **E** 베테랑·임원 | 15년+ 또는 임원 트랙 | 임원 면접의 압박 질문 · referee | "사례를 너무 많이 안다" — 어떤 걸 골라야 |
| **F** 외국계·영미권 | 한국 → 미국·유럽 진출 | 영문 이력서·문화 차이 | 문화 적응 + 비자 + 연봉 협상 동시 |

**Trade-off**: 정해진 6개에 끼지 않는 사용자 (예: 전직 군인 → IT) 가 어색함. UI 에 "기타" enum 추가는 미루지만 onboarding 인터뷰에서 신호 잡기.

**Action**: 확정 시 `docs/product/personas.md` 작성 + `/profile` 페이지의 SelectField 라벨 갱신.

---

## D3 · Narrowest wedge

**Context**: audit phase 1 권장은 `cover_letter × Persona B (신입)`. 7대 기능 모두를 동시에 출시하면 wedge 가 흐려짐.

**Recommend**: **자소서 reframe × Persona C (주니어 이직자)**. 이유:
- C 는 자소서를 다시 써본 경험이 있어 "내 자소서가 별로다" 라는 자각이 있음 (A·B 는 비교 대상이 없음).
- 이직 시점에 결제 의사가 가장 강함 (A·B 는 학생, D·E 는 reputation 으로 옮김).
- 자소서는 결과물이 명확하고 즉시 효용 검증 가능 (이력서·면접보다 retention 빠름).

대안 (검토했으나 비추천):
- `interview-coaching × B 신입`: 첫 면접의 두려움 큼 — 하지만 결제 의사가 약함 (학생).
- `salary × D 시니어`: 결제 의사 최고 — 하지만 시장이 작고 사용 빈도 낮아 retention 약함.

**Trade-off**: C 만 타겟하면 A·B 가 등 돌릴 위험. 마케팅 메시지는 "이력서 다음 단계" 로 모두 포섭하되 첫 wedge 만 자소서.

**Action**: 확정 시 마케팅 카피·랜딩 hero · 첫 onboarding flow 모두 자소서·C 중심으로 정렬.

---

## D4 · Single-user vs multi-tenant 궤적

**Context**: schema 는 single-owner (`user_id` 만). 향후 코칭 멘토 · 친구 리뷰 등 sharing 기능 등장 시 RBAC/ReBAC 필요.

**Recommend**: **MVP 는 single-user; sharing 은 S? 별도 결정**. 이유:
- 7대 기능 검증 전에 sharing 도입 시 복잡도 폭증 (RLS 정책 × 2-3배).
- 자소서 wedge 는 매우 사적 — sharing 수요 낮음.
- pgvector + memory 는 user-private 가 자연.

도입 시점 신호: 사용자가 **3번 이상** "친구가 봐주면 좋겠다" 라고 요청 (telemetry).

**Trade-off**: 처음부터 multi-tenant 로 설계하지 않으면 후에 schema 마이그레이션 필요 (큰 작업). 다만 single-user 설계의 schema 는 단순한 `auth.uid() = user_id` RLS 로 거의 모든 기능 커버.

**Action**: 확정 시 audit phase 5 의 authz-designer 결과를 "S?+ defer" 로 마킹.

---

## D5 · Web 배포 플랫폼

**Context**: 현재 GitHub Pages (정적 export) — `/api/health` 가 빌드 시점 baked. S2 부터는 server-side 실행 필요 (Supabase Auth callback, 향후 LLM proxy, …).

**Recommend**: **Vercel** 로 이전 (S2 작업과 동시).

| 항목 | Vercel | Fly.io | Cloudflare Pages | Render |
|---|---|---|---|---|
| Next.js native | ✅ | ⚠️ Docker | ⚠️ partial | ⚠️ Docker |
| Edge Functions | ✅ | ✅ | ✅ | ⚠️ |
| 한국 region | 인천 (S 2024) | 도쿄·싱가폴 | 서울 PoP | 싱가폴 |
| Free tier | 100GB/mo · hobby | 256MB · 3 머신 | 100k req/day | 750hrs |
| 가격 (5k MAU) | $20/mo (Pro) | ~$5/mo | $0 | ~$7/mo |
| Vendor lock-in | 중 | 낮음 | 중 | 낮음 |

이유:
- Next.js 15 + App Router + ISR 모두 zero-config.
- 한국 인천 region (2024 추가) → latency 양호.
- preview deploy per PR (이미 GitHub 연동 가능).

**Trade-off**: 비용이 가장 높음. 5k MAU 까지는 hobby 무료, 그 이상부터 Pro $20/mo. 진짜 트래픽 폭증 시 Cloudflare Pages 로 마이그레이션 검토.

**Action**: 확정 시:
1. `vercel.json` 추가 (basePath 제거 — Vercel 은 root domain).
2. GitHub Pages workflow disable (deploy-pages.yml).
3. Vercel project 생성 → Supabase env vars 주입.
4. (옵션) custom 도메인 연결 — D9 참조.

---

## D6 · Android 배포 경로

**Context**: `apps/android` 는 현재 `./gradlew :app:assembleDebug` 만. release build · signing config · distribution 미정.

**Recommend**: **Internal Testing → Closed Beta → Public** 단계적.

1. **S2-S5**: Play Console internal testing (이메일 화이트리스트 50명 한도). signing 은 Play App Signing 위임 (upload key 만 관리).
2. **S6-S15**: Closed beta — Google Group 으로 1000명까지 확장. 유료 결제는 Sandbox 모드 (테스트 IAP 만).
3. **S16+**: Production. 평점 4.0 도달 후 광고 시작.

**Trade-off**: iOS 미진행 — 한국·미국 모두 iOS 비중 큼. iOS 는 D6 의 후속 결정으로 별도 큐.

**Action**: 확정 시:
1. Play Console 계정 생성 ($25 일회).
2. `apps/android/keystore` (gitignore) + `.github/workflows/android-release.yml` 작성.
3. `versionCode` 자동 bump 정책 (CI에서 `git rev-list --count`).

---

## D7 · 결제 provider

**Context**: 마스터 플랜에는 "Iamport" 표기 — audit phase 2 가 deprecated 라고 발견 (2026-03 sunset).

**Recommend**: **PortOne** (구 Iamport 의 successor). 한국 결제는 PG 통합 + 토스·카카오·신한 등 모두 단일 SDK. 영미권은 **Stripe** 별도 통합 (S15+).

| 항목 | PortOne | Toss Payments | Stripe |
|---|---|---|---|
| 한국 PG | 모든 (15개+) | 토스만 | ⚠️ 한국 미지원 |
| 영미권 카드 | ⚠️ 일부 | ❌ | ✅ |
| Webhook | ✅ HMAC | ✅ | ✅ |
| 정기 결제 | ✅ (NICE 등) | ✅ | ✅ |
| 3DS 2.0 (2026 의무) | ✅ | ✅ | ✅ |
| 가격 | PG 수수료 + 0.5% | 2.9% + ₩100 | 2.9% + 30¢ |

이유:
- 한국 첫 launch — PortOne 이 자연.
- 추후 영미권 진출 (Persona F) 시 Stripe 분리 — 구조적으로 영역 분리하기 쉬움.

**Trade-off**: PortOne + Stripe 듀얼 통합은 복잡도 ↑. user 의 region 결정 로직 필요 (locale or IP).

**Action**: 확정 시:
1. CLAUDE.md "Iamport" → "PortOne" 정정.
2. `.env.example` 의 `PORTONE_*` 변수 (이미 있음) 활용.
3. S18 sprint plan에 PortOne webhook 6-layer 보안 (audit phase 5 stage 3) 통합.

---

## D8 · OAuth 우선순위 + Naver 구현

**Context**: audit phase 2 가 Naver 는 Supabase 네이티브 미지원 발견. Custom OIDC 또는 server-side callback 필요.

**Recommend**: 우선순위 + 구현 방식.

| Provider | 우선순위 | 구현 |
|---|---|---|
| Google | S2 (1) | Supabase native |
| Apple | S2 (2) | Supabase native (iOS 진출 시 강제) |
| Email Magic Link | S2 (3) | Supabase native (fallback) |
| Kakao | S3 (4) | Supabase native (한국 사용자 70%+ 커버) |
| LinkedIn | S3 (5) | Supabase native (Persona F · 영미권) |
| Naver | S3 (6) | **Custom OIDC route** — 1-day spike |

Naver 구현:
- `apps/web/app/auth/naver/route.ts` (Next.js Route Handler — Vercel 이전 후) — Naver OAuth → 토큰 교환 → Supabase admin client 로 user 생성/조회.
- 또는 Supabase Edge Function — 동일 로직.

**Trade-off**: Naver 는 한국 사용자의 ~30% 가 사용 — 미지원 시 가입 friction. 우선순위 5 → 6 강등은 LinkedIn 영미권 가치 우선.

**Action**: 확정 시 audit phase 2 의 "Naver custom OIDC" S3 spike 로 sprint plan 에 추가.

---

## D9 · 도메인 + Supabase 프로젝트

**Context**: 현재 `simon-yhkim.github.io/Career-manager/` — 임시. 프로덕션 launch 전에 정식 도메인 + Supabase 프로젝트 결정 필요.

**Recommend**:

### 도메인
3 후보:
- **`careermanager.kr`** (한국 주력 — 권장)
- `careermgr.app` (글로벌 추정)
- `cm.app` (짧음 · 검증 필요)

확인할 것:
- `careermanager.kr` 등록 가능 여부 (`whois`).
- 트레이드마크 충돌 (한국 특허청 KIPRIS).

### Supabase 프로젝트
- region: **AWS Seoul (ap-northeast-2)** — 한국 주력일 때.
- tier: **Free → Pro** ($25/mo, S2 launch 직후 전환).
- 프로젝트 ref: `career-manager-prod` + `career-manager-staging` (분리).

**Trade-off**: 한국 region 은 영미권 latency 200ms+ — Persona F 영향. CDN (Vercel edge) 가 정적 page 는 커버하지만 DB 호출은 region-bound.

**Action**: 확정 시:
1. 도메인 등록.
2. Supabase 프로젝트 생성 (staging + prod).
3. URL 4쌍 + anon key 4개 + service role key 2개 → `.env.local` (개발) + Vercel env vars (배포).
4. CLAUDE.md 의 "verification commands" 에 staging URL 추가.

---

## Decision summary table

| # | Decision | Recommend | User confirm? |
|---|---|---|---|
| D1 | 7대 기능 | resume·career·essay·portfolio·coaching·evaluation·salary | ☐ |
| D2 | Persona A-F prose | 6개 prose 정의 (위 표) | ☐ |
| D3 | Narrowest wedge | essay × C (주니어 이직자) | ☐ |
| D4 | Multi-tenant | single-user MVP, sharing defer | ☐ |
| D5 | Web 배포 | Vercel (S2 동시) | ☐ |
| D6 | Android | Internal → Closed beta → Public | ☐ |
| D7 | 결제 | PortOne (한국) + Stripe (영미권 분리) | ☐ |
| D8 | OAuth | Google·Apple·Email (S2) → Kakao·LinkedIn·Naver-custom (S3) | ☐ |
| D9 | 도메인+Supabase | careermanager.kr + Seoul region · staging+prod 분리 | ☐ |

각 항목은 사용자 confirm 시 별도 PR 로 채택 — `docs/decisions/D{N}-{slug}.md` ADR 패턴.
