# Tool Quirks — 하네스·CLI 함정 모음

> **목적**: Claude Code, Cursor, Codex, Opencode 등 각 에이전트 하네스와 주변 CLI 도구의 알려진 함정을 누적한다.
> **갱신 규칙**: 같은 함정에 두 번 걸리면 이 파일에 기록.

---

## Claude Code

### 2026-04-12 — Plan 파일에 시크릿 substring 포함 금지
- **상황**: 플랜 파일에 "시크릿 누출 검사" 의 grep 패턴을 그대로 기록했는데, 패턴 자체가 실제 API 키의 prefix 였음
- **증상**: `grep -r AQ.Ab8RN6... ~/.claude/` 로 자체 검증 실행 → 플랜 파일 자신이 LEAK 판정
- **회피법**: 검증용 grep 패턴은 placeholder 사용 (`AQ\.[A-Za-z0-9_-]{20,}` 같은 정규식만)
- **근본 해결**: 검증 스크립트는 패턴을 arg 로 받아 플랜 본문에 값이 남지 않도록

### 2026-04-12 — Gstack skill 은 SKILL.md 만으로는 작동 안 함
- **상황**: Gstack 레포 clone 후 skill 디렉토리(`SKILL.md`)만 복사
- **증상**: 스킬 자체는 YAML 파싱 OK, description 에 노출되지만, 실행하면 `~/.claude/skills/gstack/bin/gstack-*` 를 찾아 호출 → 파일 없음 → `|| true` 로 silent degradation, 핵심 기능(learnings·telemetry·config) 미작동
- **회피법**: Gstack 레포 전체를 `~/.claude/skills/gstack/` 에 복사 + `bun install`
- **근본 해결**: Gstack 공식 설치 스크립트 사용 (있을 경우). 현재는 수동 복사 + bun install 로 해결

- **Plan 모드**: 편집 불가. 계획 파일 하나만 쓸 수 있음. ExitPlanMode 로만 탈출
- **`--dangerously-skip-permissions`**: 사용 금지. `/permissions` allowlist 사용
- **병렬 세션**: 반드시 `git worktree`로 격리. 동일 브랜치 병렬 작업 금지
- **CLAUDE.md 체크인**: 팀 git에 포함, PR 마다 갱신
- **Stop hook**: `~/.claude/stop-hook-git-check.sh` — 커밋 누락 감지용. 우회 금지
- **Skill 트리거**: description의 키워드가 발동 조건. 한국어·영어 병기 권장
- **컨텍스트 자동 압축**: 긴 세션에서 초기 메시지가 요약됨 — 중요한 메타데이터는 답변 본문에 재명시

## Cursor / Cline

- Agent 모드: 파일 단위 diff 리뷰. 큰 edit 은 여러 턴으로 쪼개야 적용률 높음

## OpenAI Codex CLI

- `codex review` / `codex challenge` — Gstack `/codex` 스킬이 래핑
- 세션 연속성: `--session-id` 로 유지

## Git

### 2026-04-13 — `git clone` 이 GitHub default branch 를 복제, main 아님
- **상황**: 레포를 public 으로 전환하고 main 에 푸시 했는데, 외부에서 `git clone https://github.com/<user>/<repo>` 하면 옛 base commit 만 나옴
- **증상**: `git log` 에 1 개 commit 만. 최근 작업 내용이 안 보임
- **원인**: GitHub default branch 가 아직 main 이 아님. `git clone` 은 서버의 default branch 를 복제
- **회피법**: hook 스크립트는 `git clone --depth 1 --branch main` 으로 명시
- **근본 해결**: GitHub `Settings → Branches → Default branch` → `main` 으로 전환, 옛 브랜치 삭제

- `--no-verify`: 사용 금지 (pre-commit hook 우회). 사용자 명시 허가 시에만
- `git reset --hard`, `git clean -f`, force push — confirm 없이 금지
- `git worktree` 종료 시 `git worktree remove` 필수 (고아 브랜치 방지)
- Conventional Commits: `feat/fix/docs/chore/refactor/test/perf/ci/build/style` 외 금지
- **원격 브랜치 삭제 차단**: Claude Code 웹 sandbox 의 로컬 git proxy 는 `git push origin --delete <branch>` 를 HTTP 403 으로 막음. 원격 브랜치 정리는 GitHub UI 로만 가능

## Node / npm / pnpm

- `npm install` vs `npm ci`: CI 에서는 `ci` 필수 (lockfile 존중)
- 글로벌 설치 피함: npx 우선
- Node 22 LTS — `--experimental-vm-modules` 관련 플래그 변경 주의

## Supabase

- `service_role` 키: **서버 전용**. 클라이언트 번들에 노출 금지
- RLS: `ENABLE` 만으로는 부족 — `FORCE ROW LEVEL SECURITY` 도 적용해야 테이블 owner 우회 차단
- migrations 순서 충돌: 동시 작업 시 타임스탬프 prefix 충돌 주의

## Playwright / Puppeteer

- 한국어 폰트 렌더링: 이미지 비교 테스트 시 OS 기본 폰트 차이로 false-negative
- `waitForSelector` 보다 `waitForLoadState('networkidle')` 선호

---

## 템플릿

```
### <tool> — <한 줄 제목>
- **상황**: 언제 발생
- **증상**: 겉으로 드러나는 모습
- **원인**: 실제 원인
- **회피법**: 즉시 적용 가능한 우회
- **근본 해결**: 있다면
```

---

## Next.js 15 정적 export (`output: "export"`)

### useSearchParams 는 Suspense 안에서만
- **상황**: 정적 export 빌드 시 `useSearchParams()` 를 쓴 컴포넌트가 Suspense 없이 노출
- **증상**: 빌드 실패 — "should be wrapped in a suspense boundary"
- **회피법**: 사용 컴포넌트를 `<Suspense fallback={...}>` 로 감싸기. page.tsx 가 진입점이면 page 자체에 Suspense.
- **근본 해결**: useSearchParams 호출 위치는 항상 클라이언트 hydration 단계 → 정적 export 가 prerender 못 함 → Suspense 강제

### 동적 라우트 [slug] → generateStaticParams 필수
- **상황**: `app/blog/[slug]/page.tsx` 를 정적 export 하려고 함
- **증상**: 빈 generateStaticParams 도 에러. catch-all placeholder 만 두는 패턴 불가.
- **회피법**: 한 번이라도 prerender 할 수 있는 slug 목록 명시. `dynamicParams = false` 로 빌드 시점 고정.
- **근본 해결**: 라우트 자체 삭제 또는 정적 라우트로 변환

### /api/* 정적 export 호환
- **상황**: API route 가 있는 채로 `output: "export"` 빌드
- **증상**: dynamic = "auto" 면 빌드 실패
- **회피법**: `export const dynamic = "force-static"` 명시. handler 안에서 외부 호출 X (빌드 시점에 한 번만 실행됨).

### basePath 와 OAuth callback
- **상황**: GitHub Pages 의 basePath `/Career-manager`. OAuth provider 가 callback URL 검증.
- **증상**: redirect mismatch
- **회피법**: callback URL 은 `${window.location.origin}/Career-manager/auth/callback/` 로 명시. trailing slash 중요.

---

## next/font/local + pnpm flat layout

### woff2 경로 못 찾음
- **상황**: `pretendard` npm 패키지 설치 후 `next/font/local` 로 woff2 참조
- **증상**: pnpm 의 flat layout 때문에 `node_modules/pretendard/...` 경로가 일정하지 않음 → 빌드 실패
- **회피법**: woff2 를 직접 `apps/<app>/app/fonts/` 로 복사하고 `src` 를 상대 경로로 지정
- **근본 해결**: next/font/local + pnpm 조합은 woff2 를 앱 디렉토리에 두는 게 안정적

---

## GitHub Pages 배포 폴링

### curl HTML grep 만으로는 마커 못 찾음
- **상황**: PR 머지 후 라이브 확인 폴링. `curl pages | grep "<new string>"` false 만 반환.
- **증상**: HTML 에는 그 문구 없음. JS chunk 에만 있음.
- **회피법**: 두 단계 grep
  ```bash
  until curl -sL "$URL" \
    | grep -oE '_next/static/chunks/app/<route>/page-[a-z0-9]+\.js' \
    | head -1 \
    | xargs -I {} curl -s "$BASE/{}" \
    | grep -q "<NEW_UNIQUE_STRING_ONLY_IN_THIS_PR>"; do sleep 15; done
  ```
- **근본 해결**: SSG 정적 HTML 은 prerender 결과만 가짐. 동적 텍스트는 JS bundle 안.

### URL 대소문자 sensitive
- **상황**: `simon-yhkim.github.io/career-manager/` 로 접속 → 404
- **증상**: GitHub Pages 는 repo name 의 대소문자 그대로
- **회피법**: 사용자에게 URL 알릴 때 `Career-manager` (C 대문자) 임을 명시

### 환경 보호 룰
- **상황**: `actions/deploy-pages` 가 main 만 deploy 허용으로 설정
- **회피법**: PR 브랜치에서 Pages 미리보기 불가. 첫 설정 시 사용자에게 main 추가 안내 필요.

---

## GitHub MCP 한계

### wiki API 없음
- **상황**: GitHub wiki 에 글을 자동으로 누적하려고 함
- **증상**: github MCP 에 wiki 관련 tool 없음. `<repo>.wiki.git` git push 도 로컬 git proxy 가 거부.
- **회피법**: 레포 내 `LESSONS_LEARNED.md` 로 우회. 사용자가 수동으로 Wiki 로 복사하거나 그대로 둠.

### deploy_pages action SHA 환각
- **상황**: WebFetch 로 `actions/deploy-pages@<sha>` SHA 가져오기 시도
- **증상**: 환각 SHA. 워크플로 실패 ("Unable to resolve action").
- **회피법**: SHA 핀은 `gh api repos/owner/repo/tags` 또는 GitHub UI 로만. WebFetch 신뢰 X. 그게 없으면 `@v4` 태그 핀 + TODO 코멘트.

---

## TypeScript strict 옵션

### noUncheckedIndexedAccess
- **상황**: `arr[i]` 결과를 non-undefined 로 사용
- **증상**: `Object is possibly 'undefined'` 에러
- **회피법**: 항상 fallback. `arr[i] ?? "default"` 또는 `arr.at(i) ?? "default"`.
