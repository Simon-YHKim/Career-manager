<!--
Career Manager PR template. Keep PRs small (≤ 400 lines diff) and focused.
See CONTRIBUTING.md for branch / commit conventions.
-->

## Summary

<!-- 1-3 sentences: what changed and why. -->

## What changed

<!-- Bullet list of concrete changes. File paths welcome. -->
-
-

## Test plan

<!-- How to verify. Mark `[x]` for what you've already verified locally. -->
- [ ] CI green (Node typecheck · build · test + Android lint · assembleDebug)
- [ ] Manual / browser verification (if applicable)
- [ ]

## Blast radius

<!-- What does this touch? What could break? -->
- Touches:
- Reverting this PR: <safe / requires X>

## AI Slop self-check (UI changes only — delete if N/A)

- [ ] No Inter font
- [ ] No `#000000` / `#ffffff` direct hex
- [ ] No emoji icons (use lucide-react or SVG)
- [ ] Single stage per page (no multi-color rainbows)
- [ ] No bounce / elastic easing

## Sync

<!-- Drop if irrelevant. -->
- [ ] Web ↔ Android color tokens stay in sync (`stages.ts` ↔ `Color.kt`)
- [ ] Supabase migrations are append-only (no edits to existing migrations)
- [ ] No `.env*` committed (only `.env.example`)
- [ ] CHANGELOG `[Unreleased]` section updated (for user-visible changes)
