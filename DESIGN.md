# DESIGN.md

Source of truth for Career Manager's visual system. Aspires to a quiet,
confident product feel — Korean career professional × Western expansion.
Not playful, not corporate-grey, not generic admin-template.

## Brand identity

- **Audience**: 한국 + 영미권 커리어 전환·확장을 동시에 하는 개인 (신입/경력/이직/유학·해외 취업).
- **Tone**: 차분 · 단호 · 데이터 기반. AI 가 만든 흔적 없이 사람이 정리한 것처럼.
- **Anti-tone**: 가벼움 · 과장 · 이모지 장식 · "AI" 강조.

## Typography

| Slot | Family | Weight axis | Korean primary |
|---|---|---|---|
| sans (default) | **Pretendard Variable** (self-hosted via `next/font/local`) | 45-920 | ✅ |
| mono | `ui-monospace, SFMono-Regular, Menlo, Consolas, monospace` | — | — |

**Forbidden**:
- ❌ **Inter** — AI-generated 티의 가장 흔한 신호. 한국어 글리프 부재.
- ❌ **Noto Sans CJK** — 한국어 + 영문 사이 weight balance 가 맞지 않음.

Implementation: `apps/web/app/fonts/index.ts` exposes `pretendard` (used by `<html>` `<body>`). Tailwind: `font-sans` resolves to `var(--font-pretendard)` via `apps/web/tailwind.config.ts`.

### Type scale

| Token | Size | Line | Use |
|---|---|---|---|
| display | 48 | 56 | landing hero, primary heading |
| h1 | 32 | 40 | page title |
| h2 | 24 | 32 | section title |
| h3 | 20 | 28 | subsection |
| body | 16 | 24 | default paragraph |
| small | 14 | 20 | caption / label |
| micro | 12 | 16 | meta / timestamp |

Tailwind: `text-3xl/10` → 30/40, `text-2xl/8` → 24/32 등 기본값 활용. 별도 `theme.fontSize` 확장은 보류.

## Color system

### Source of truth

`packages/design-tokens/src/stages.ts` — **12 stages × 5 shades** (50/100/500/700/900) = 60 colors. Okabe-Ito 기반 (색맹 안전).

12 stages (each maps to a UX surface — derived from `DocumentType`):
- `profile` · `experience` · `career` · `essay` · `resume` · `portfolio`
- `interviewCoaching` · `interviewEvaluation` · `salary` · `todo` · `memory` · `blog`

### Cross-platform sync

- Web: `import { stages } from "@career/design-tokens"` (single source).
- Android: manual mirror at `apps/android/app/src/main/kotlin/io/career/manager/ui/theme/Color.kt`. **MUST stay in sync — change `stages.ts` and `Color.kt` in the same PR**. Codegen 도입은 후속 sprint.

### Usage rules (AI Slop 방지)

1. **One stage per page.** UI 한 화면에서는 단일 stage 만 accent 로 사용. 12 stage 를 grid 로 나열하는 곳은 디자인 검증용 페이지 단 한 곳뿐.
2. **3-color rule.** 한 화면 색상: text + bg + accent (= 1 stage 의 한 shade). 그 이상 금지.
3. **No multi-stage rainbows.** 다른 stage 끼리 시각적 인접 배치 금지 (예외: nav switcher 자체의 indicator).
4. **Pure black/white 금지.** `#000000` · `#ffffff` 직접 사용 금지. 토큰의 `palette["50"]` (paper) / `palette["900"]` (ink) 사용.
5. **WCAG**: 본문은 `palette["900"]` on `palette["50"]` (대비 확보, `packages/design-tokens/src/contrast.test.ts` 가 검증).

### Shade semantic

| Shade | Use |
|---|---|
| 50 | bg paper · subtle hover |
| 100 | bg fill (chip · tag · disabled bg) |
| 500 | brand accent · primary CTA bg |
| 700 | secondary surface · pressed state |
| 900 | text on light bg · icon stroke |

## Spacing & layout

- **Grid**: 4px base (Tailwind 기본). 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 가 표준 gap·padding.
- **Container**: `max-w-2xl` (text 위주) · `max-w-5xl` (대시보드) · `max-w-7xl` (랜딩).
- **Border radius**: `rounded-md` (6) · `rounded-lg` (8) · `rounded-xl` (12) · `rounded-2xl` (16). 32+ 금지 (cartoon 느낌).

## Motion

- **Easing**: `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out-quint) for entry / `cubic-bezier(0.4, 0, 0.2, 1)` (ease-in-out-quad) for state. **No bounce, no elastic.**
- **Duration**: 150ms (micro · hover · focus) / 250ms (medium · drawer · modal) / 400ms (page · route).
- **`prefers-reduced-motion: reduce`**: 모든 transition 을 0ms 또는 `transition: none` 으로. 필수.

## Component primitives (S2+ 도입 시 가이드)

| Component | Variants | Notes |
|---|---|---|
| Button | primary · ghost · destructive | `palette["500"]` bg / `palette["50"]` text. focus ring `palette["700"]` 2px outset. |
| Card | default · interactive | `border border-stage-<stage>-100 bg-stage-<stage>-50`. shadow 사용 자제. |
| Field | text · textarea · select | label 위. error 는 dedicated `salary` stage red 가 아닌 system red 별도 token (TBD). |
| Tag / Chip | filled · outline | `bg-stage-<stage>-100 text-stage-<stage>-900`. |
| Toast | success · error · info | aria-live="polite". 4s auto-dismiss. |
| Skeleton | line · block | `animate-pulse bg-neutral-200`. |

shadcn/ui CLI 는 사용하지 않음 — 컴포넌트는 `apps/web/components/<Name>.tsx` 에 직접 작성.

## Accessibility

- **WCAG AA** 필수. `palette["900"]` on `palette["50"]` 4.5:1 이상 (이미 `contrast.test.ts` 가 검증).
- **Focus**: ring 2px solid `palette["700"]`, 2px offset, 절대 제거 금지.
- **Keyboard**: Tab order 자연스럽게. `tabindex` 양수 사용 금지.
- **Screen reader**: 모든 interactive element 에 명시적 label 또는 `aria-label`.
- **Reduced motion**: 위 motion 섹션 참조.

## AI Slop 방지 체크리스트

PR 머지 전 이 5개를 self-check:

- [ ] **Inter 사용 여부** — 0건이어야 함.
- [ ] **`#000` / `#fff` 직접 사용** — 0건. `palette["900"]` / `palette["50"]` 만.
- [ ] **이모지 아이콘** — 0건. lucide-react 또는 자체 SVG 만.
- [ ] **4가지 이상 multi-color** — 한 화면에서 stage 가 1개로 제한되는지.
- [ ] **bounce / elastic easing** — 0건.

## Out of scope (이후 sprint)

- Light/dark theme — 현재 light only. dark token 은 `palette["900"]` 을 bg 로 swap 하는 방식 검토 (S5+).
- Component library 패키지화 — `apps/web/components/` 에 직접 작성. `@career/ui` 분리는 components 6+ 확보 후 (S5+).
- TS → Kotlin 토큰 codegen — 현재 manual mirror. Style Dictionary 또는 자체 스크립트 (S?).
- Motion library — 현재 CSS transition 만. Framer Motion 도입은 첫 화면 transition 이 필요해질 때 (S6+).
