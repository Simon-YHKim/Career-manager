# LESSONS_LEARNED — Career Manager 세션 회고

> 다음 Claude 세션이 같은 실수를 반복하지 않고, 같은 사용자를 같은 톤으로
> 빠르게 도울 수 있도록 누적한 노트. 작성 시점: 2026-04-30 KST.
>
> **읽는 순서**: §1 사용자 프로필 → §2 워크플로 → §3 시행착오 → §4 Quick reference.
> SimonK-stack 의 `SessionStart` 훅이 `.claude/instincts/*.md` 를 자동 로드하니
> 본 문서는 인덱스 / context 용으로 두고, 행동 가능한 룰은 instincts 4파일에 분산.

---

## 1. 사용자 프로필

### 1.1 정체와 동기

- **프로젝트**: Career Manager — 한국 + 글로벌 채용 통합 플랫폼.
- **스택**: Next.js 15 App Router + React 19 + Tailwind v4 + shadcn-style (manual) + Supabase + Kotlin/Compose Android. 모노레포 (pnpm + Turborepo). SimonK-stack vendored 상태.
- **출시 채널**: GitHub Pages (`https://simon-yhkim.github.io/Career-manager/`) 정적 export. 다른 사람과 링크 공유로 데모.
- **장기 목표**: 12 단계 (자기 정리 → 자료 → 면접 → 협상) + /todo, /blog, 리멤버 / LinkedIn 동기화. AI 자동 작성을 점진적으로 합류.

### 1.2 작업 성향 — 강하게 일관되는 패턴

| 성향 | 관찰된 신호 | 의미 |
|---|---|---|
| **빠른 반복** | "전부 다 하자", "모두 진행", "ㄱㄱ" | 결정은 빠르게. 확인 질문 최소화. 의문 있으면 분기 옵션 짧게 제시. |
| **묶음 요청** | 한 메시지에 5-9 항목 번호 매겨 던짐 | 너무 많으면 자동 분할 + 사용자 확인. "너무 많으면 나눠서 해" 명시. |
| **라이브 검증** | "지금 이렇게밖에 안 보여", URL 던지며 "이거 404", 스크린샷 첨부 | 코드 안 보고 페이지 결과로 판단. 라이브 URL 이 곧 truth. |
| **공유 우선** | "다른 사람들에게도 링크 줘야 하거든" | 결과물은 항상 외부 공유 가능 상태여야. 비로그인 흐름이 깨지면 답답. |
| **단순/모노톤** | "색상 다 없애고 기능만", "스크롤 없이 한 화면", AI Slop 3원칙 강조 | 풍선 효과·이모지·다색 금지. 카드 중첩 금지. |
| **개발 메타 숨김** | "발행 정책을 직접적으로 표현하지 마", "우리의 개발 과정이 드러날 필요는 없어" | Sprint 번호, S?+ jargon, 내부 spec 링크 — 사용자 페이지에 X. spec 은 `docs/specs/` 에만. |
| **틀 먼저 → 조정** | "일단은 다음 작업을 진행하자. 전체적인 틀을 먼저 만들고 조정할꺼야" | 디테일·예외 처리는 후속. 큰 그림 먼저 합치고 나서 사용자가 라이브 보고 점지. |
| **STT 입력 혼합** | "농협 웹페이지" = "내 GitHub 페이지", "리멤버" = Remember, "링크데이" = LinkedIn | 음성인식 오타 잦음. 의미는 문맥으로 추론 가능. 되묻지 말고 의도대로 진행. |
| **한국어 존댓말** | 모든 대화 존댓말 | 답변도 단정한 존댓말 + 짧게. |

### 1.3 문제 인식 방법

- **라이브 페이지를 직접 본다** — 다음 단계 가는 길이 막히면 그 경계가 곧 다음 작업.
- **다른 사람 입장에서 본다** — "그 사람 지금 이렇게밖에 안 보여" — 비로그인 / 권한 없는 사용자의 막힘이 곧 우선순위.
- **즉시 다음 요청** — 라이브 라우저 확인 직후 추가 변경 요청. PR 이 채 안 끝났는데 새 항목 들어오기도 함 — 분할 PR 로 흡수.

### 1.4 자주 놓치는 것 (사용자 시야 밖)

- **URL 대소문자 민감도** — GitHub Pages 는 `Career-manager` 대문자. 소문자는 404.
- **머지 ≠ 라이브** — PR squash merge → CI → Pages 배포까지 2-4분. 머지 직후 URL 안 바뀜.
- **로그인 게이트 너머** — 비로그인 사용자에게 dashboard 가 안 보임. 데모 모드 / fake-login 으로 항상 우회로 마련.
- **자동 저장 vs 명시 저장** — localStorage 자동 저장만으로는 "저장됐다" 체감 X. 명시 저장 버튼 + 상태 토스트 항상 필요.
- **개발자 jargon** — Sprint 번호 / spec 파일 링크 / "S20 합류 예정" 같은 표현이 사용자 페이지에 새어나가면 거슬려 함.

---

## 2. 워크플로 표준 — 다음 세션이 따라야 할 절차

### 2.1 묶음 요청 들어왔을 때

1. 항목 수 세기. **5 이상이면 자동 분할 + 사용자에게 PR 분할안 한 줄로 확인**.
2. 각 항목에 PR 라벨 (PR-A, PR-B …) 매겨 사용자가 어느 묶음에 있는지 추적 가능하게.
3. 한 PR 당 4 항목 이하 권장. 같은 파일 손대는 항목은 한 PR 로 묶기.

### 2.2 PR 작업 흐름 (확인된 안전 순서)

```
git checkout main && git pull origin main       # 항상 fresh
git checkout -b feat/<topic>
<수정>
pnpm --filter web build                          # 로컬 검증
pnpm -r typecheck
git add <필요 파일들>                            # 'git add .' X
git commit -m "<conventional>"
git push -u origin <branch>
mcp__github__create_pull_request                 # draft: 처음엔 true
```

### 2.3 라이브 URL 회신 요청 → 3단 폴링

사용자가 "URL 줘 / 라이브 확인 / 테스트할 수 있게" 라고 했을 때 절대 빠뜨리지 말 것:

1. **CI green 폴링**: 백그라운드 bash 로 PR 의 check-runs 가 모두 success 될 때까지 sleep loop.
2. **Merge** (CI 통과 후): `mcp__github__merge_pull_request` (squash).
3. **Pages 배포 폴링**: 새 JS 청크 안에 PR 의 unique string 이 들어갈 때까지 폴링.
   - `curl <page>` 만으로는 부족 — SSG static HTML 만 가져옴.
   - JS chunk 도 fetch 해서 grep. 예: `curl pages | grep -oE 'chunks/app/<route>/page-[a-z0-9]+\.js' | head -1 | xargs ... grep "고유한 새 문구"`.

### 2.4 정적 export (`output: "export"`) 호환성 체크리스트

작업하기 전에 항상 확인:

- `useSearchParams` 사용 → 부모를 `<Suspense fallback={...}>` 로 감싸기. 안 그러면 빌드 실패.
- 동적 라우트 (`[slug]`) → `export function generateStaticParams()` 필수. 빈 배열도 안 됨.
- `export const dynamicParams = false` 추가 → 빌드 시점에 fixed paths 만 생성.
- `/api/*` route → `export const dynamic = "force-static"` 명시.
- next/image 는 `unoptimized: true` 이미 next.config.ts 에 설정됨.
- `basePath` = `/Career-manager` (env `NEXT_BASE_PATH` 로 주입). next/link 가 자동 prefix.

### 2.5 Conflict 회피

매 PR 머지 후 다음 PR 시작 시:

```
git checkout main && git pull origin main && git checkout -b feat/<next>
```

→ "이전 branch 위에 또 branch" 패턴 금지. PR #36 → #37 충돌, PR #38 → #39 충돌 모두 이 원인.

### 2.6 fix-now 분리 정책

작업 도중 발견한 작은 fix (typo / lint / 누락 alt 등) 는 본 PR 에 묶지 말고 별도 commit · 별도 PR 로 분리. audit PR 처럼 docs-only PR 이면 코드 변경 절대 X.

### 2.7 라이브에 노출되면 안 되는 것

| 항목 | 어디로 가야 | 사용자 페이지에 X |
|---|---|---|
| Sprint 번호 ("S?+", "S18", "S20") | spec/내부 README | ✅ |
| spec 파일 링크 (`docs/specs/...md`) | spec 자체에만 | ✅ |
| "발행 정책 / publishing pipeline" 같은 운영 정보 | spec 에만 | ✅ |
| TODO / FIXME / 모듈명 / 함수명 | 코드에만 | ✅ |
| GitHub Pages basePath 대소문자 안내 | Q&A 에 두지 말고 README | ✅ |
| 데모 모드 동작 원리 | Q&A 에 두지 말기 (혼동) | ✅ |

---

## 3. 시행착오 & 결론 (Lessons)

### 3.1 PR base 잘못 → cherry-pick 6연발

- **상황**: 초반 audit PR 들이 main 이 아니라 다른 feature branch 를 base 로 들어감.
- **결과**: 1차 머지 모두 잘못된 base. 이후 6 squash 를 fresh branch 로 cherry-pick.
- **교훈**: PR 만들기 전에 base 가 main 인지 항상 명시 확인. `mcp__github__create_pull_request` 호출 시 `base: "main"` 누락 X.

### 3.2 GitHub Pages 환경 보호 룰

- **상황**: `actions/deploy-pages` 가 환경 보호로 main 만 deploy 허용. workflow_dispatch 시도해도 막힘.
- **교훈**: PR 브랜치에서 Pages 미리보기 불가. main merge 만이 유일 경로. (Vercel preview 연결은 별도 의사결정 필요.)

### 3.3 useSearchParams Suspense 누락 → 빌드 실패

- **상황**: `?demo=1` 추가하며 `useSearchParams()` 를 page.tsx 최상단에서 직접 사용.
- **결과**: 빌드 시 "should be wrapped in a suspense boundary".
- **교훈**: 정적 export 환경에서는 useSearchParams 쓰는 컴포넌트를 항상 `<Suspense>` 로 감싸기. page.tsx 자체에 Suspense 두기.

### 3.4 동적 라우트 + generateStaticParams 빈 배열 금지

- **상황**: `[stage]/page.tsx` 를 catch-all placeholder 로 두려고 했음.
- **결과**: 빈 generateStaticParams 는 정적 export 에서 에러.
- **교훈**: 한 번이라도 prerender 할 수 없으면 라우트 자체 삭제. 또는 모든 slug 를 명시.

### 3.5 next/font/local + Pretendard

- **상황**: `pretendard` npm 패키지의 woff2 경로가 pnpm flat layout 때문에 발견 안 됨.
- **결과**: `apps/web/app/fonts/` 로 woff2 직접 복사 → 해결.
- **교훈**: next/font/local + pnpm 조합은 항상 woff2 를 앱 디렉토리에. node_modules 경로 의존 X.

### 3.6 WebFetch SHA 환각

- **상황**: `actions/deploy-pages@<sha>` 핀할 SHA 를 WebFetch 로 가져옴.
- **결과**: 환각 SHA. 워크플로 실패 ("Unable to resolve action").
- **교훈**: GitHub Action SHA 는 `gh api repos/owner/repo/tags` 또는 GitHub UI 로만 확인. 그게 없으면 `@v4` 등 태그 핀 + TODO 코멘트.

### 3.7 Card 컴포넌트 style prop 없음 → 색상은 Tailwind 만

- **상황**: 동적 색상 주려고 `<Card style={{borderColor: ...}}>` 시도.
- **결과**: Card 의 TypeScript 타입에 style prop 없음 → 빌드 실패.
- **교훈**: Card 색상은 className 으로만. 예: `className="border-l-stage-salary-700"`.

### 3.8 TS strict + noUncheckedIndexedAccess

- **상황**: `ramp[i]` 결과를 `Shade` 로 사용 → undefined 에러.
- **교훈**: 인덱스 접근은 항상 `?? "500"` 같은 fallback. `ramp.at(i) ?? "500"` 도 가능.

### 3.9 사용자 분할 선호

- **상황**: 9건 요청을 한 PR 로 시도하다 너무 큼.
- **사용자 발언**: "너무 많으면 나눠서 해".
- **교훈**: 5+ 항목 무조건 분할. 사용자에게 PR-A/B/C/D 매핑 한 줄로 알리고 진행.

### 3.10 PR squash merge 후 후속 PR 충돌

- **상황**: PR #36 squash merge → 같은 base 위 PR #37 add/add 충돌 (Dashboard.tsx, MarketingLanding.tsx, page.tsx).
- **결과**: 로컬에서 conflict resolve → `git checkout --ours` → 다시 push.
- **교훈**: 매 PR 끝나면 무조건 `git checkout main && git pull` 후 다음 PR.

### 3.11 Pages 배포 폴링 마커는 JS 청크에서

- **상황**: `curl pages | grep "비로그인 미리보기"` 했는데 안 잡힘.
- **원인**: SSG 정적 HTML 에 그 문구 없음. JS chunk 에만 있음.
- **교훈**: Pages 배포 확인 폴링은 (1) HTML 에서 chunk 경로 추출 → (2) 그 chunk 도 fetch → (3) 거기에 unique string grep.

```bash
until curl -sL "$URL" | grep -oE '_next/static/chunks/app/<route>/page-[a-z0-9]+\.js' | head -1 \
  | xargs -I {} curl -s "$BASE/{}" | grep -q "<NEW_STRING_ONLY_IN_THIS_PR>"; do sleep 15; done
```

### 3.12 STT 입력 = 의미 추론

- **상황**: 사용자가 "농협 웹페이지" / "리멤버" / "링크데이" 같은 STT 오타를 자주 보냄.
- **교훈**: 문맥으로 의도 추론. 되묻지 말고 진행. 한 번만 짧게 의도 확인하고 답변.

### 3.13 자동 저장만으로는 부족 — 명시 저장 버튼

- **상황**: 리멤버 / LinkedIn 페이지가 onChange 마다 localStorage 저장.
- **사용자 발언**: "저장하는 버튼이 안 보이네. 저장하는 버튼 만들자."
- **교훈**: 폼 페이지는 자동 저장이 있어도 상단에 **명시 저장 버튼 + 마지막 저장 시각 표시**. 명시 저장 누르면 토스트로 확인.

### 3.14 다국어 = 별도 슬롯

- **상황**: LinkedIn 페이지에 "한국어 / 영문 둘 다 작성하고 싶다" 요청.
- **교훈**: 단일 모델 + lang 토글 X. `{ ko: Profile, en: Profile }` 식 별도 슬롯으로 저장.

### 3.15 spec 노출 거부 — 개발 메타는 사용자 페이지에 X

- **상황**: /blog 에 "발행 정책 (매일 5AM AI 발행)" 카드 노출.
- **사용자 발언**: "발행 정책을 직접적으로 표현하지 마. 사용자들에게 서비스되는 곳에 우리의 개발 과정이 드러날 필요는 없어."
- **교훈**: spec 은 `docs/specs/*.md` 에만. 사용자 페이지에는 사용자 가치만.

### 3.16 라이브 URL 회신 = 3단 폴링

- **상황**: 사용자가 "URL 줘 다른 사람한테 보여줄꺼야" 요청.
- **교훈**: ① CI green 폴링 → ② merge → ③ Pages 배포 폴링 (JS bundle grep) 다 끝나야 URL drop.

### 3.17 데모 모드 = 비로그인 demo dashboard 라우팅

- **상황**: 마케팅 랜딩에서 로그인 버튼 누르면 다음 페이지로 못 감 (Supabase 미설정).
- **해결**: `isAuthConfigured()` 가 false 면 로그인/회원가입 버튼이 `/?demo=1` 로 라우팅.
- **교훈**: 데모 가능한 모든 곳은 fake-login 우회로 마련. 사용자가 "다른 사람한테 보여줄 거" 라 했으니 외부 공유 시점에 깨지면 안 됨.

### 3.18 사용자 페이지 = 자기 가치 그대로

- **상황**: Q&A 에 "데모 모드 동작 원리 / 404 해결" 같은 운영 정보 포함.
- **교훈**: 운영 정보는 README / Q&A 가 아닌 별도 운영 문서. Q&A 는 사용자가 서비스를 쓰면서 가질 의문만.

---

## 4. Quick Reference — 다음 세션이 바로 쓸 것

### 4.1 첫 입장 시

1. `pwd` = `/home/user/Career-manager` 확인.
2. `git status && git branch --show-current` — main 인지 확인. 아니면 `git checkout main && git pull`.
3. `.claude/instincts/*.md` 4개 + 본 LESSONS_LEARNED.md 읽고 시작.
4. CLAUDE.md 의 verification commands 표 참고.

### 4.2 새 요청 받으면

1. 항목 개수 세기.
2. 5+ 면 PR 분할안 한 줄로 사용자에게 제시 후 진행.
3. spec / 운영 메타 노출 여부 자가 검열.
4. 작업 시작 = `git checkout main && git pull && git checkout -b feat/<topic>`.

### 4.3 PR 만들고 머지까지

```
pnpm --filter web build           # 빌드 통과
pnpm -r typecheck                  # 타입 통과
git add <명시적 파일들>
git commit -m "<conventional>"
git push -u origin <branch>
mcp__github__create_pull_request(base="main", draft=true|false)
# CI green 폴링 (백그라운드)
mcp__github__merge_pull_request(merge_method="squash")
# Pages 배포 폴링 (JS chunk grep, 백그라운드)
# 사용자에게 라이브 URL drop
```

### 4.4 정적 export 함정 체크리스트

- [ ] useSearchParams → Suspense
- [ ] [slug] → generateStaticParams + dynamicParams=false
- [ ] /api/* → dynamic = "force-static"
- [ ] basePath = /Career-manager (next-link 자동 prefix)
- [ ] OAuth callback URL = `${origin}/Career-manager/auth/callback/`

### 4.5 자주 쓰는 unique strings (Pages 폴링 마커 후보)

- 새 PR 만들 때 본 PR 에만 들어가는 한국어 phrase 하나 골라 commit 메시지에 적어두기 → 폴링 마커로 재사용.

### 4.6 Q&A / 사용자 페이지 작성 톤

- 단정한 한국어 존댓말.
- 광고성 표현 X ("저희가 최고").
- Sprint 번호 / spec 링크 / "S?+" X.
- 답변은 1-3 문단. 길면 bullet 로 쪼개기.

### 4.7 디자인 룰 (DESIGN.md v2)

- Surface 색상은 `palette.resume` 의 무채색만.
- 의미 색만 다른 hue: danger `salary.s700`, success `career.s700`, info `interviewCoaching.s700`.
- 이모지 X, Inter 폰트 X (한글 Pretendard).
- 한 화면 fit (스크롤 없이) 가 사용자 기본 기대.

---

## 5. 도구별 함정 한 줄 요약

| 도구 | 함정 | 해결 |
|---|---|---|
| **Static export** | useSearchParams 그냥 쓰면 빌드 실패 | `<Suspense>` 로 감싸기 |
| **Static export** | 동적 라우트 무조건 generateStaticParams | 빈 배열도 안 됨 |
| **GitHub Pages** | URL 대소문자 sensitive | `Career-manager` (C 대문자) |
| **GitHub Actions** | WebFetch 가 SHA 환각 | `gh api tags` 로 확인 |
| **Pages 배포 확인** | curl HTML grep 으로는 마커 못 찾음 | JS chunk fetch 후 grep |
| **PR conflict** | base 가 main 아니면 후속 PR 충돌 | 매 PR 후 `git checkout main && pull` |
| **next/font/local** | pnpm flat layout 으로 woff2 경로 못 찾음 | 앱 디렉토리에 직접 복사 |
| **TS strict** | `noUncheckedIndexedAccess` 로 index access undefined | `?? fallback` 명시 |
| **Card 컴포넌트** | style prop 없음 | className Tailwind 만 |
| **MCP github** | wiki API 없음 | LESSONS_LEARNED.md 로 우회 |
| **로컬 git proxy** | wiki repo 접근 차단 | 동일 |

---

## 6. 변경 로그

- 2026-04-30: 첫 작성. 9건 → 4 PR 분할 (PR-A merged 시점) + 7건 추가 묶음 받는 시점 분석.

## 7. 작성 원칙 (이 문서를 갱신할 때)

- 같은 실수가 두 번 반복되면 §3 에 항목 추가.
- 새 도구 함정 발견 시 §5 표에 한 줄.
- 사용자 발언에 "이거 또 틀렸어", "저번에도 그랬어" 등 → `simon-instincts` 호출 + 본 문서 즉시 append.
- 사용자가 새 선호를 보이면 §1.2 표 갱신.
