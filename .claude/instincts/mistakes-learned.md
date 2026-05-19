# Claude 실수 학습 로그

> **목적**: Claude가 세션 중 저지른 실수를 누적 기록한다. 새 세션은 이 파일을 먼저 읽고 같은 실수를 반복하지 않도록 한다.
> **갱신 규칙**: 사용자 지적 → 즉시 append. 날짜 / 증상 / 원인 / 예방책 4필드 필수.
> **관리**: `/retro` 에서 주 1회 리뷰. 유효하지 않은 항목은 보존하되 `~~취소선~~` 처리 후 이유 기록.

---

## 실수 목록

### 2026-04-16 — 디자인 작업에서 사용자 선택권 건너뜀
- **증상**: 랜딩페이지 수정 시 레퍼런스 추천/방향성 확인 없이 바로 코드 작성. 사용자가 디자인 방향을 잡을 기회를 주지 않음
- **원인**: 디자인 철학에 "레퍼런스에서 시작 → 사용자가 방향 잡기 → 사용자가 갈피 못 잡을 때만 AI 주도"라고 명시했는데, 효율을 위해 무시하고 단독 진행
- **예방책**: 디자인 작업 시 반드시 아래 순서를 따를 것:
  1. 레퍼런스 사이트 3-5개 추천 (Dribbble/Awwwards/유사 제품)
  2. 사용자에게 "이 방향이 좋다" 또는 "다른 방향" 선택지 제공
  3. 사용자가 "알아서 해" 또는 결정 못할 때만 AI 주도
  4. 폰트도 Google Fonts에서 선택지 제공, AI는 추천만
- **출처**: 랜딩페이지 Phase 3 세션

---

## 템플릿

```
### YYYY-MM-DD — <한 줄 제목>
- **증상**: 무엇이 잘못됐나
- **원인**: 왜 그렇게 됐나 (근본 원인, 피상적 원인 금지)
- **예방책**: 다음에 같은 상황에서 해야 할 것
- **출처**: <세션 ID / 프로젝트명 / 파일>
```

---

## 로그

### 2026-04-12 — Skill 설치 시 SKILL.md 만 복사하고 runtime 누락
- **증상**: Gstack skill 36개 SKILL.md 를 복사했는데, 각 skill 이 참조하는 `bin/gstack-*` 헬퍼 스크립트가 없음 → 스킬 발동은 되지만 텔레메트리·learnings·config 기능 silent failure
- **원인**: 스킬 = 마크다운이라고만 생각해서 런타임 의존을 놓침. Gstack 은 `bin/`, `scripts/`, `package.json` 을 포함한 풀 트리가 런타임
- **예방책**: skill 설치 시 항상 (1) SKILL.md 내부에서 외부 경로 grep → `~/.claude/skills/<name>/bin`, `scripts/`, `lib/` 참조 여부 확인 (2) `package.json` 있으면 의존성 설치 (3) 설치 후 스모크 테스트로 실제 bin 호출
- **출처**: simon-stack v1 설치 세션

### 2026-04-12 — 검증 grep 패턴에 실제 시크릿 substring 포함
- **증상**: Plan 파일에 "키 누출 검사" 의 grep 명령을 예시로 적어뒀는데, 패턴에 실제 키 prefix 문자열이 들어가 파일 자체가 검증에 걸림
- **원인**: 검증 로직 = 데이터 가 헷갈림. 스크립트가 아닌 설명 문서에 패턴을 그대로 적으면 해당 문서가 "유출 문서" 가 됨
- **예방책**: 검증 패턴은 정규식만 (`AQ\.[A-Za-z0-9_-]{20,}`) 혹은 shell 변수로만 표현. 절대 리터럴 prefix 기록 금지
- **출처**: simon-stack v1 plan 파일

### 2026-04-30 — PR base 가 main 이 아닌 채로 squash merge → cherry-pick 6회 발생
- **증상**: 초반 PR 들이 다른 feature branch 를 base 로 두고 만들어져 그 위로 후속 PR 이 줄줄이 잘못 쌓임
- **원인**: `mcp__github__create_pull_request` 호출 시 `base` 누락 / 자동 추정 → 직전 활성 브랜치로 잡힘
- **예방책**: PR 만들기 전 항상 `git checkout main && git pull origin main && git checkout -b feat/<topic>` 후 생성. 생성 호출 시 `base: "main"` 명시.
- **출처**: Career-manager · PR #4-#7 cherry-pick → PR #13

### 2026-04-30 — useSearchParams 를 Suspense 없이 사용 → 정적 export 빌드 실패
- **증상**: `?demo=1` 처리 위해 page.tsx 최상단에 `useSearchParams()` 추가 → "should be wrapped in a suspense boundary"
- **원인**: 정적 export 환경에서 useSearchParams 는 클라이언트 hydration 필요 → Suspense boundary 강제
- **예방책**: useSearchParams 쓰는 컴포넌트는 항상 `<Suspense fallback={...}>` 로 감싸기. page.tsx 가 진입점이면 page 자체에 Suspense 두기
- **출처**: Career-manager · PR #37 demo mode

### 2026-04-30 — Pages 배포 확인 폴링이 HTML grep 만 봐서 안 잡힘
- **증상**: `curl <pages-url> | grep "<new-string>"` 으로 폴링했는데 새 PR 머지 후에도 false 만 반환
- **원인**: Next.js 정적 export 의 SSG HTML 에 그 문자열이 없고 JS chunk 에만 있음. curl 은 HTML 만 가져옴.
- **예방책**: Pages 배포 확인은 (1) HTML 에서 `_next/static/chunks/.../page-*.js` 추출 → (2) 그 chunk 도 fetch → (3) grep
- **출처**: Career-manager · PR #37, PR #39 배포 폴링

### 2026-04-30 — PR squash merge 후 후속 PR add/add 충돌
- **증상**: PR #36 머지 직후 PR #37 머지 시도 → add/add conflict (Dashboard.tsx, MarketingLanding.tsx, page.tsx)
- **원인**: 후속 PR 의 base 가 squash 전 base. squash merge 가 새 SHA 생성하면서 같은 파일이 양쪽에 추가됐다고 인식.
- **예방책**: 매 PR 머지 직후 `git checkout main && git pull origin main` 하고 다음 PR 시작. 이전 브랜치 위에 또 브랜치 X.
- **출처**: Career-manager · PR #36 → #37 conflict resolve

### 2026-04-30 — 사용자 페이지에 spec / Sprint 번호 노출 → 사용자 불쾌
- **증상**: /blog 에 "발행 정책 · docs/specs/blog-content-pipeline.md (S17 · S25 합류)" 카드 노출
- **사용자 발언**: "발행 정책을 직접적으로 표현하지 마. 사용자들에게 서비스되는 곳에 우리의 개발 과정이 드러날 필요는 없어."
- **예방책**: Sprint 번호 (S?+) · spec 링크 · "AI 발행 파이프라인" 등 운영 정보는 `docs/specs/*.md` 에만. 사용자 페이지에는 사용자 가치만.
- **출처**: Career-manager · PR #38 → #39 blog policy hide

### 2026-04-30 — 자동 저장만 두고 명시 저장 버튼 누락
- **증상**: 리멤버 / LinkedIn 페이지가 onChange 마다 localStorage 저장. UI 상단에 "자동 저장됨" 표시만.
- **사용자 발언**: "저장하는 버튼이 안 보이네. 저장하는 버튼 만들자."
- **예방책**: 폼 페이지는 자동 저장이 있어도 명시 저장 버튼 + 토스트 + 마지막 저장 시각 함께 노출. 사용자는 클릭으로 "저장됐다" 를 체감해야 안심.
- **출처**: Career-manager · 7-request 분기점

### 2026-04-30 — 9건 묶음 요청을 한 PR 로 시도
- **증상**: 사용자가 한 메시지에 9건 묶어 던졌고 한 PR 로 다 처리하려다 scope 폭주
- **사용자 발언**: "너무 많으면 나눠서 해"
- **예방책**: 5 이상의 독립 항목이면 자동 분할. 사용자에게 PR-A/B/C/D 매핑 한 줄로 제시 후 진행. 한 PR 4 항목 이하 권장.
- **출처**: Career-manager · 9-request 분할
