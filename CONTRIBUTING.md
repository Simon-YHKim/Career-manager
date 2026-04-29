# Contributing

## Branch convention

| Pattern | Owner | Use |
|---|---|---|
| `feat/<topic>` | human | new feature |
| `fix/<topic>` | human or claude | bug fix · small operational fix |
| `chore/<topic>` | human or claude | tooling · deps · meta |
| `docs/<topic>` | human or claude | docs only |
| `refactor/<topic>` | human | structural change, behavior unchanged |
| `claude/<topic>-<id>` | claude | feature work driven by an LLM session |

All work goes through a **draft PR** first. Open early, mark "Ready for review"
when CI is green and you've self-reviewed the diff.

## Commit messages

Conventional Commits style:

```
type(scope): short summary

Optional body explaining the why (not the what — the diff shows what).

Optional footer (refs / breaking changes).
```

Types: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `perf`, `build`, `ci`.

Scope examples: `web`, `android`, `schema`, `design-tokens`, `supabase`, `deps`.

## PR review checklist

Before requesting review:

- [ ] CI green (Node typecheck/build/test + Android lint/assembleDebug)
- [ ] No `.env*` files committed (only `.env.example`)
- [ ] Web/Android color tokens stay in sync (see [CLAUDE.md](./CLAUDE.md))
- [ ] New Supabase migrations are append-only (don't edit existing migrations)
- [ ] Self-reviewed diff for AI Slop (Inter font, multi-color, decoration)

## Local dev quickstart

```bash
nvm use                        # Node 20 (see .nvmrc)
corepack enable
corepack prepare pnpm@10.33.2 --activate
pnpm install
pnpm --filter "./packages/*" build
pnpm --filter web dev          # http://localhost:3000
```

For Android: JDK 17, Android SDK 35, then `cd apps/android && ./gradlew :app:assembleDebug`.

## Verification loop

See [CLAUDE.md → Verification commands](./CLAUDE.md#verification-commands)
for the full table of commands you can run before declaring work done.

## Reporting issues

Issues, ideas, audit follow-ups → GitHub Issues. For sensitive security
findings (e.g. RLS bypass) email the maintainer instead — do not file publicly.
