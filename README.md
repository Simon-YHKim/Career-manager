# Career Manager

한국·영미권 통합 커리어 플랫폼. Native Android 앱 + Next.js Web을 단일 모노레포에서 운영합니다.

이 저장소는 26-스프린트 마스터 플랜의 **Sprint 1 — 토대 구축** 단계입니다.

## Layout

```
apps/
  web/                Next.js 15 (App Router) + Tailwind v4
  android/            Kotlin + Jetpack Compose (Material 3)
packages/
  design-tokens/      12-stage Okabe-Ito 기반 색상 토큰 + Tailwind preset
  schema/             공유 Zod 스키마 (Document, CareerProfile)
supabase/
  migrations/         document / version / project / tasks / memories DDL
.github/workflows/    CI (Node 매트릭스 + Android assembleDebug)
```

## Prerequisites

- Node.js ≥ 20
- pnpm ≥ 10 (`corepack enable && corepack prepare pnpm@10.33.2 --activate`)
- JDK 17 (Android 빌드)
- Android SDK API 35 (`ANDROID_HOME` 설정 필요, 로컬 Android 빌드 시)

## Setup

```bash
pnpm install
```

## Common commands

```bash
# Web
pnpm --filter web dev          # Next.js dev (http://localhost:3000)
pnpm --filter web build

# Packages
pnpm --filter @career/design-tokens build
pnpm --filter @career/design-tokens test    # WCAG contrast tests
pnpm --filter @career/schema test

# Workspace-wide
pnpm -r typecheck
pnpm -r build
pnpm -r test

# Android (apps/android/)
./gradlew :app:assembleDebug
./gradlew :app:lint
```

## Verification

랜딩 페이지(Web)와 첫 화면(Android)이 동일한 12-stage 색상 카드를 렌더하면 토큰 동기화가 정상입니다.

전체 verification 명령 표 → [CLAUDE.md → Verification commands](./CLAUDE.md#verification-commands).

## Troubleshooting

- **`pnpm -r typecheck` 가 실패**한다 → fresh clone에서는 `pnpm --filter "./packages/*" build` 를 먼저 실행해야 합니다. `apps/web` 가 `@career/schema` · `@career/design-tokens` 의 `dist/*.d.ts` 를 import 하기 때문.
- **pnpm 버전이 9.x** 로 잡힌다 → `corepack enable && corepack prepare pnpm@10.33.2 --activate`. `package.json` 의 `packageManager` 필드가 source of truth.
- **Android Gradle 첫 빌드가 5-8분** 걸립니다. 이후 빌드는 캐시 덕에 2분 이내. CI 도 동일.
- **Tailwind v4 + shadcn/ui** — shadcn CLI 는 사용하지 않습니다. 컴포넌트는 `apps/web/components/` 에 직접 작성.

## Out of scope (다음 스프린트)

- OAuth (S2-S3): Google / Apple / Kakao / Naver / LinkedIn / Email Magic Link
- Document editor + Yjs CRDT (S9)
- 7대 기능 LLM 워크플로우 (S6-S16)
- Astro 블로그 (S17)
- 결제 (S18)
- 할 일 코칭 / 플래너 / 캘린더 (S20-S23)
- 메모리 시스템 (S24-S25)

## Branch

이번 작업은 `claude/android-web-app-Kmvku`에서 진행합니다.
