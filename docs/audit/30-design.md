# Phase 3 — 디자인 (Design) Audit

**Skill**: `plan-design-review`
**Date**: 2026-04-29

## Summary
- Composite design score: **5.4/10**
- Top 3 issues:
  - **No DESIGN.md** — typography, spacing, motion, and brand voice live nowhere; landing page is a token-swatch demo with no product hierarchy.
  - **Pretendard not actually loaded** — `tailwind.config.ts` lists Pretendard in the `font-sans` stack but no `<link>`, `next/font`, or `@font-face` is declared in `layout.tsx` or `globals.css`. Korean users will fall back to Apple SD Gothic Neo / system; the stack also still shows generic neutral fonts (no Pretendard self-host or CDN).
  - **Cross-platform drift risk is hand-managed** — 60 hex literals are duplicated between `stages.ts` and `Color.kt` with no codegen, lint, or CI parity check. Working agreement says "must stay in sync" but nothing enforces it.

## Scorecard

| # | Dimension | Score | What would make it 10 |
|---|---|---|---|
| 1 | Color system | 6/10 | 12 hues × 5 shades is a lot; demote 5 (todo/memory/blog/2 interview variants) to neutral aliases or document semantic vs branded split. |
| 2 | Typography | 3/10 | Self-host Pretendard via `next/font/local` (or `next/font/google` for an English fallback like Geist/IBM Plex), declare type scale (12/14/16/20/24/32/48), set line-height + tracking tokens. |
| 3 | Spacing & layout | 6/10 | Codify a 4/8 grid token table; right now spacing is ad-hoc Tailwind utilities (`mb-10`, `py-12`, `gap-4`). |
| 4 | Motion | 1/10 | No motion primitives, no `prefers-reduced-motion` handling, no easing curves declared. Add `tokens/motion.ts` (durations 120/200/320, easing standard/emphasized) + media-query opt-out. |
| 5 | Cross-platform sync | 4/10 | Add codegen: `stages.ts` → `Color.kt` via a `pnpm tokens:gen` script, plus a CI check that diffs the generated file. |
| 6 | AI Slop resistance | 8/10 | Already emoji-free, monochrome shell, 1 accent per card. Lock it in DESIGN.md before someone adds Inter or rainbow gradients. |
| 7 | Accessibility | 7/10 | `contrast.ts` + tests exist (good), but no focus-ring tokens, no `:focus-visible` styling, swatch labels rely on bg color contrast only. Audit AA on each `s500` against white/`s900`. |
| 8 | Documentation | 2/10 | DESIGN.md absent. No component inventory, no token usage rules, no do/don't gallery. CLAUDE.md mentions "single source of truth" but doesn't link to a spec. |
| 9 | Information density | 3/10 | Landing is a swatch grid with one paragraph. Production needs hero, value prop (KR vs Western dual-market), 7-stage funnel preview, social proof slot. |
| 10 | Brand identity | 4/10 | "Korea + Western career platform" thesis is invisible in the UI. No KO/EN toggle, no flag/region motif, no typography pairing that signals bilingual product. |

## Per-dimension findings

### 1. Color system
60 hex values across 12 stages × 5 shades. Several stages (`memory` purple ≈ `profile` purple, `todo` orange ≈ `experience` orange, `interviewEvaluation` near-black ≈ `resume` slate) collide perceptually. *Severity: medium.* Recommendation: split into **brand** (7 stages) + **utility** (todo/memory/blog as neutral-tinted) and document the split. *Decided: report-only.*

### 2. Typography
`tailwind.config.ts:16-25` sets a font stack with Pretendard, but `layout.tsx` does not load the Pretendard webfont — it never reaches the browser. No `next/font`, no `<link rel="stylesheet">`, no `@font-face`. Inter is correctly absent. *Severity: high.* Recommendation: add `next/font/local` for Pretendard (subsetted KR+Latin), declare a type scale, set `font-feature-settings: "ss01"` for tabular numerals on resume/salary screens. *Decided: fix-now.*

### 3. Spacing & layout
No spacing tokens; raw Tailwind utility classes everywhere. Container `max-w-6xl` is fine for landing but unspecified elsewhere. *Severity: low.* Recommendation: extract `space.ts` with 4-px base, name semantic levels (`stack-xs/sm/md/lg/xl`). *Decided: report-only.*

### 4. Motion
Zero motion code exists. `prefers-reduced-motion` not referenced anywhere. *Severity: medium* (will become high once interactive screens land). Recommendation: ship `motion.ts` tokens + a `useReducedMotion` hook before S2 onboarding flow. *Decided: report-only* (pre-S2 flag).

### 5. Cross-platform sync
Hex values manually duplicated in `Color.kt:39-124`. No script, no test, no CI gate. Comment says "until codegen replaces this file in a later sprint" — that codegen is the single highest-leverage design infra investment. *Severity: high.* Recommendation: add a node script `scripts/gen-android-tokens.ts` that emits `Color.kt` from `stages.ts`, wire to `pnpm build` and CI diff check. *Decided: report-only* (post-S2 per CLAUDE.md).

### 6. AI Slop resistance
Page is monochrome bg, single-accent per card, no emoji, no gradients, no decorative SVG. Good baseline. *Severity: none.* Recommendation: codify in DESIGN.md "금지 목록" (Inter, pure-black, emoji nav, 4+ color, bounce easing) so future PRs can't regress. *Decided: fix-now (when DESIGN.md lands).*

### 7. Accessibility
`contrast.ts` + `contrast.test.ts` give a WCAG ratio utility — strong foundation, rarely seen this early. But: no focus-ring token, no `:focus-visible` styling on `StageCard`, swatch labels at `s50`/`s100` use hardcoded `#0b0f17` (~20:1, fine) but no test asserts each `s500` reaches AA against white text. `<html lang="ko">` set correctly. *Severity: medium.* Recommendation: add a token-vs-token contrast matrix test and a `focus-ring` token. *Decided: fix-now (focus-ring), report-only (matrix test).*

### 8. Documentation
No `DESIGN.md`, no component inventory, no Storybook, no usage examples beyond the live `StageCard`. CLAUDE.md "Working agreements" sets policy but the policy file doesn't exist. *Severity: high.* Recommendation: write `DESIGN.md` codifying tokens, type scale, motion, do/don't, AI-slop blocklist. *Decided: deferred to fix-now phase per task instructions.*

### 9. Information density
`page.tsx:6-35` is a Sprint-1 placeholder. No hero copy, no funnel visualization, no KR/EN value-prop split, no CTA. Acceptable for S1 but flagged for S2. *Severity: low (S1 scope).* Recommendation: design landing wireframe in S2 onboarding work. *Decided: report-only.*

### 10. Brand identity
The "한국·영미권 통합" thesis appears only as a sentence in the subtitle. No bilingual layout treatment, no region toggle, no visual differentiation between Korea-mode (e.g., 자소서, 연봉협상) and Western-mode (e.g., resume, cover letter) flows even though the stage labels carry both. *Severity: medium.* Recommendation: design a region/locale switcher pattern + bilingual typography pairing (Pretendard KR + Geist/Inter-replacement EN) before S2 stage screens. *Decided: report-only.*

## AI Slop check
- Inter font: ✓ (absent)
- Pure black bg: ✓ (uses `#0b0f17` tinted neutral — good)
- Emoji icons: ✓ (none)
- 4+ multi-color: ✓ on shell; ✗ on swatch grid (12 hues at once is intentional demo, not production)
- Bounce/elastic easing: ✓ (no motion declared)

## Recommended fixes

### fix-now
- [ ] Create `DESIGN.md` codifying: token usage, type scale, motion, focus-ring, AI-slop blocklist (deferred per phase instructions, but block the PR after this audit on it).
- [ ] Pin Pretendard via `next/font/local` in `apps/web/app/layout.tsx`; remove the stack-only declaration in `tailwind.config.ts` once the font is actually loaded.
- [ ] Add `--focus-ring` CSS variable in `globals.css` and apply `:focus-visible` outline to interactive elements (currently `StageCard` is non-interactive but onboarding will need it).
- [ ] Document the working-agreement Web↔Android sync rule with a hex parity script — even a `node scripts/check-token-parity.mjs` that greps both files and exits non-zero on drift, run in CI.

### report-only
- [ ] Web↔Android codegen (`scripts/gen-android-tokens.ts` → `Color.kt`) — schedule post-S2.
- [ ] Motion token file + `prefers-reduced-motion` guard — schedule with S2 onboarding.
- [ ] Brand/region toggle pattern (KR vs Western dual-market visual treatment) — schedule with S2 onboarding.
- [ ] Demote `todo`/`memory`/`blog` from branded stages to utility/neutral aliases (or document why they're branded equally).
- [ ] Storybook or component inventory page once 5+ components exist.

## Decision queue
- [ ] Should the 12-stage palette stay flat, or split into brand-7 + utility-5? (affects DESIGN.md structure)
- [ ] Pretendard self-host vs CDN vs `next/font/google` substitute — license + KR subset size tradeoff.
- [ ] Codegen direction: TS → Kotlin only, or shared JSON → both? (affects when iOS lands later.)
- [ ] Does "Western" half want a separate accent palette (e.g., warmer, less Material-y) or share the same Okabe-Ito tree?
