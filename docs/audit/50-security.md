# Phase 5 — 보안 (Security) Audit

**Skill**: `security-orchestrator` (5-stage)
**Date**: 2026-04-29
**Scope**: Sprint 1 scaffold (`supabase/migrations/0001_init.sql`, CI, web/package.json, schema)

## Executive summary

- **Composite security score**: 5.5 / 10 — appropriate for S1 scaffold; **NOT prod-ready**
- **Top blockers**:
  1. **No RLS policies on any of 6 tables** (`project`, `document`, `document_version`, `document_snapshot`, `tasks`, `memories`) — explicitly deferred to S2 by migration header comment, but cross-user reads/writes are wide open the moment Auth ships
  2. **`content_hash` is client-trusted** — column has `not null` constraint but no server-side trigger; a malicious client can write `body=X, content_hash=hash(Y)` and corrupt audit/version integrity
  3. **No JSONB body size cap** anywhere (DB or app) — single document can balloon storage and `idx_document_body` GIN index
- **All severity counts**: 3 blockers · 5 majors · 4 minors

---

## Stage 1 — security-checklist

### RLS gap matrix

Migration `0001_init.sql` (lines 1–177) creates the schema with `user_id uuid not null` ownership columns but **zero `enable row level security` / `create policy` statements**. Every table is open to anyone with an authenticated Supabase JWT.

| Table | RLS today | Needed policy (S2) | Adversarial query (must fail post-fix) |
|---|---|---|---|
| `project` | none | `auth.uid() = user_id` for select/insert/update/delete | `select * from project where user_id <> auth.uid()` |
| `document` | none | `auth.uid() = user_id` (all verbs) | `select body from document where user_id <> auth.uid()` |
| `document_version` | none | join via `document` ownership: `exists (select 1 from document d where d.id = document_id and d.user_id = auth.uid())` | `select body from document_version where document_id in (select id from document)` (cross-tenant) |
| `document_snapshot` | none | `auth.uid() = user_id` | `select payload from document_snapshot where user_id <> auth.uid()` |
| `tasks` | none | `auth.uid() = user_id` | `update tasks set status='done' where user_id <> auth.uid()` |
| `memories` | none | `auth.uid() = user_id`; **also** `privacy_level = 'local_only'` rows must never be sent to LLM context (app-layer) | `select content from memories where privacy_level='local_only' and user_id <> auth.uid()` |
| `project_atom_link` | none | join via `project.user_id` AND `document.user_id` | cross-link a victim's atom into attacker's project |

**Subscription tampering**: N/A — no subscription/role columns yet.
**Rate limiting**: none — flagged for S2+ when Auth + first API route lands. Recommended: dual-layer (per-user `auth.uid()` + per-IP) using Supabase Edge Functions or Upstash.
**Budget caps (LLM)**: N/A until S6. Forward-warn: per-user daily token cap + per-app monthly hard cap before any LLM key is used.

---

## Stage 2 — authz-designer

**Today**: pure single-owner model. Every row carries `user_id`; no sharing primitives exist.

**Trajectory** (the spec mentions `project_atom_link` and `document_share` futures):
- **RBAC** alone is insufficient — career docs will be shared per-document with mentors/recruiters, not per-role.
- **ReBAC** (relationship-based) fits: `document_share(document_id, grantee_id, role, expires_at)` with roles `viewer`/`commenter`/`editor`.
- **Recommended hybrid (S5+)**: RBAC for org-level (future workspace), ReBAC for per-document grants. Add `authz_audit_log(actor, action, target, ts)` from day 1 of sharing.
- **IDOR vector to watch**: `project_atom_link(project_id, atom_id)` already permits cross-references. Once sharing lands, validating that the grantor owns BOTH endpoints is mandatory.

DDL deferred — out of S1 scope. Note in migration header now so S5 author doesn't reinvent.

---

## Stage 3 — paid-api-guard (forward-looking, S18 payment integration)

No paid APIs wired yet. Apply this 6-layer checklist as the gate before merging any payment code:

1. **Network boundary** — payment provider webhooks only via dedicated edge route; deny non-provider IPs; HTTPS-only.
2. **Signing & idempotency** — verify HMAC per provider (Toss/Stripe); persist `idempotency_key` per request; reject replays.
3. **Abuse detection** — per-user request budget; alert on > N failed payment attempts/hour.
4. **Payment hardening** — never trust client-supplied amount; recompute server-side; lock on `subscription_state` row before mutation.
5. **Key-leak response** — keys in Supabase Vault or platform secret manager only; rotation runbook; SDK client never sees server keys.
6. **Observability** — structured log every webhook + outbound call; dashboards for success/failure/latency before launch.

---

## Stage 4 — CSO (infrastructure)

- **Secrets archaeology**: `git ls-files` shows **no `.env*` tracked**, no `secret`/`key`/`password`/`token` files. Clean. **However** there is **no `.env.example`** — devs will guess variable names, which leaks structure via PR comments and creates copy-paste-real-secret risk. **Add `apps/web/.env.example`** listing `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and any future server keys with placeholder values.
- **Supply chain (CI)** — `.github/workflows/ci.yml` uses:
  - `actions/checkout@v4`, `actions/setup-java@v4`, `android-actions/setup-android@v3` — **all pinned by floating tag, not SHA**. Medium risk: a tag retag/compromise injects code into our build. **Pin to commit SHAs** before first prod deploy.
  - `corepack prepare pnpm@9.12.3 --activate` — explicit pnpm version, good. Lockfile install (`--frozen-lockfile`), good.
- **CI permissions** — workflow has **no `permissions:` block**. By default `GITHUB_TOKEN` inherits the repo's permissive default (often `contents: write`, `pull-requests: write`). **Add `permissions: contents: read` at workflow level**, escalate per-job only when needed.
- **LLM/AI (forward S6 warning)** — every prompt-bound output must be Zod-validated on return; treat LLM output as untrusted. Plan for prompt-injection defense via system-prompt isolation + output schema enforcement (master plan calls this Format Lock + Anti-Inflation + Truth-First).
- **Skill supply chain** — repo vendors SimonK-stack from a public GitHub repo into `.claude/`; the `SessionStart` hook executes shell at every Claude Code session. Treat `.claude/hooks/*.sh` as production code: review on bump, pin upstream commit, never `curl | sh` from inside hooks.
- **`schema_version` validation** — `packages/schema/src/document.ts` only requires `min(1)` on `schema_version`. Add an enum or `z.string().regex(/^\d+\.\d+\.\d+$/)` so a malformed value can't bypass downstream version-routed parsers.

---

## Stage 5 — codex challenge (5 adversarial scenarios)

| # | Attack | Today's outcome | Mitigation owner |
|---|---|---|---|
| 1 | Cross-user document read: authenticated user A queries B's `document.body` directly | **Exposed** — no RLS | S2 RLS (Stage 1 matrix) |
| 2 | JSONB body overflow: client posts a 50 MB `body` to crash storage / blow up GIN index | **Exposed** — no app cap, no DB CHECK | App-side cap (e.g., 256 KB) **and** DB `check (octet_length(body::text) < 262144)` |
| 3 | `content_hash` tampering: client sends `body=X, content_hash=hash(Y)` to corrupt audit chain | **Exposed** — `content_hash` is client-set, no trigger | DB trigger: `content_hash := encode(digest(body::text, 'sha256'), 'hex')` on insert/update |
| 4 | `user_id` enumeration: A inserts a row with `user_id = B's uuid` to plant evidence | **Exposed** — column is unconstrained `not null uuid` | S2 RLS `with check (auth.uid() = user_id)` on insert/update |
| 5 | JWT forgery / session replay | **Mitigated** — Supabase Auth verifies JWT signature server-side using project JWT secret; rotation supported | None new; document JWT-secret rotation runbook before prod |

---

## Severity-sorted issue list

### Blockers (must fix before prod / before S2 ship)
1. **No RLS policies** on all 6 tables — single-user multi-tenant data store with no isolation. (Stage 1)
2. **`content_hash` client-trusted** — break document/version integrity by mismatching body↔hash. (Stage 5 #3)
3. **JSONB body has no size cap** — denial-of-storage and GIN-index pathology. (Stage 5 #2)

### Majors
1. **`.env.example` missing** — DX + security gap; drives ad-hoc env-var sharing in PR comments/Slack.
2. **GitHub Actions pinned by tag, not SHA** — supply-chain compromise vector.
3. **`GITHUB_TOKEN` permissions not locked down** — workflow inherits repo defaults; add `permissions: contents: read`.
4. **`document.deleted_at` exists but no schema-level "exclude soft-deleted" view** — every query must remember `where deleted_at is null`; easy to leak deleted docs.
5. **`memories.privacy_level = 'local_only'` is column-only** — no enforcement that LLM context-builder excludes them; needs an app-layer guard test.

### Minors
1. `schema_version` accepts any non-empty string — tighten to semver regex.
2. `tasks.dependencies uuid[]` lacks FK enforcement — orphan IDs possible.
3. `project_atom_link` allows cross-owner links once sharing lands — validate ownership of both endpoints.
4. No `updated_at` trigger — column exists but only DEFAULT; updates won't refresh it.

---

## Decision queue

- [ ] Confirm single-user vs multi-tenant trajectory before S2 RLS design (sharing model: ReBAC `document_share`?)
- [ ] Pick payment provider before S18 (Toss for KR / Stripe for US) — locks the paid-api-guard checklist
- [ ] Pin GitHub Actions to SHAs when first prod deploy lands
- [ ] Decide whether to sign Supabase migrations (advanced; defer until team > 3)
- [ ] Add `apps/web/.env.example` in next PR (cheap; do now)
- [ ] Add DB CHECK + trigger for `content_hash` recompute in S2 migration (cheap; do with RLS)
