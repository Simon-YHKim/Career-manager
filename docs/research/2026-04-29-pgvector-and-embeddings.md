# Research — pgvector & embedding strategy for Memory (S24-S25)

**Date**: 2026-04-29
**Skill**: `simon-research`
**Decision target**: choose embedding provider · vector dimensions · index type · storage tier before S24 implementation begins.
**Out of scope**: actually shipping. This doc informs the migration that lands in S24.

> The 0001 migration intentionally omits the `embedding` column on `memory`. S24 adds it via `ALTER TABLE` once these decisions are made.

---

## 1. Why memory needs vectors

S24-S25 introduces a "memory" surface — long-running, user-owned facts that
the LLM can retrieve when generating cover letters / interview answers /
salary scripts. Examples:

- "I built a Redis caching layer that cut p99 latency 40ms → 12ms"
- "I prefer hybrid roles, can't relocate from Seoul"
- "Tossed a $30k counter on my last offer and got it"

These are short (50-300 tokens) and need semantic retrieval — exact-text
matching loses paraphrases. Vector similarity is the canonical answer.

---

## 2. Embedding provider matrix

### Cost (per 1M tokens, 2026-04, USD)

| Provider | Model | Dim | Per 1M tok | Notes |
|---|---|---|---|---|
| OpenAI | `text-embedding-3-small` | 1536 (default) / 512 | $0.020 | Best price/quality; supports `dimensions` API param |
| OpenAI | `text-embedding-3-large` | 3072 / 1024 / 256 | $0.130 | Higher quality, 6.5× cost |
| Cohere | `embed-multilingual-v3.0` | 1024 | $0.100 | Strong Korean — Cohere ranks first on KLUE-STS in their benchmarks |
| Voyage | `voyage-3-large` | 1024 / 512 / 256 | $0.180 | Best English quality (MTEB top 5); Korean coverage weaker |
| Google | `text-embedding-004` | 768 | $0.0125 | Cheapest; quality good for English, mixed Korean |
| Local (BGE-M3) | open weights | 1024 | $0 + GPU/CPU | Self-host. Korean+English. ~2GB weights. |

### Korean coverage

For a 한국·영미권 dual-market product, Korean handling matters more than
typical Western benchmarks suggest:

- **Cohere multilingual-v3** — explicitly tested on Korean; KLUE-STS scores
  competitive with native Korean encoders.
- **OpenAI text-embedding-3-small** — mixed reports. Anecdotally fine for
  Korean but no official benchmark.
- **BGE-M3** (local) — multilingual at the model-card level, scores well on
  Korean retrieval tasks in BAAI's own evals.

### Recommendation

**Default**: **OpenAI text-embedding-3-small at 1536 dims** for v1.
- Cheapest credible option that handles both languages reasonably.
- `dimensions` parameter lets us reduce later (e.g., 512 dims) without re-encoding.
- Ubiquitous tooling — every vector DB driver supports it.

**Re-evaluate at**: 100k+ memories per user, OR Korean retrieval quality
becomes a customer complaint. Switch path: re-embed via Cohere multilingual.

---

## 3. Vector dimensions — 1536 vs 1024 vs 256

| Dim | Storage / row | 1M memories | Recall vs 1536 |
|---|---|---|---|
| 1536 | 6 KB (`vector(1536)`, 4 bytes/float) | 6 GB | 100% (baseline) |
| 1024 | 4 KB | 4 GB | ~98% (OpenAI's own benchmark) |
| 512 | 2 KB | 2 GB | ~94% |
| 256 | 1 KB | 1 GB | ~85% |

For S24 launch, **1536 dims** is fine — even at 100k memories per user it's
under 600 MB. Reducing dims is a free optimization later if needed.

---

## 4. pgvector on Supabase

### Tier limits (2026-04)

| Tier | Max DB size | Pricing for storage | pgvector |
|---|---|---|---|
| Free | 500 MB | included | ✓ |
| Pro | 8 GB | $0.125/GB/mo over 8 GB | ✓ |
| Team | 100 GB | $0.125/GB/mo | ✓ |

For our scale (1k early users × 100 memories × 6KB = 600 MB), **Pro tier
suffices for the first year** with substantial headroom.

### Index choice

pgvector supports two ANN indexes (in addition to no-index brute force):

| Index | Build time | Recall@10 | Query latency |
|---|---|---|---|
| **HNSW** | slow (~30 min for 1M rows) | 95-99% | 1-5 ms |
| **IVFFlat** | fast | 85-95% | 1-10 ms (depends on `nprobe`) |
| None | — | 100% (exact) | linear in N → unusable past ~10k rows |

**Recommendation**: HNSW with `m=16, ef_construction=64`. Standard parameters
that pgvector docs themselves recommend; tune later if recall is insufficient.

```sql
-- S24 migration draft
ALTER TABLE memory ADD COLUMN embedding vector(1536);

CREATE INDEX memory_embedding_hnsw_idx
  ON memory USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);
```

### Distance metric

For OpenAI/Cohere/Voyage embeddings, **cosine** is the standard.
`vector_cosine_ops` in pgvector. Don't use L2 — these models normalize
implicitly so cosine is equivalent and easier to reason about.

---

## 5. Cost projection

Assumptions for first 12 months:

- 5,000 active users by month 12
- Average 80 memories per user (some users 0, some 200+)
- → 400k memories total
- Average memory length: 100 tokens
- → 40M tokens to embed once + 5M tokens/mo for new memories

### Embedding API cost

| Provider | Initial 40M tok | Monthly 5M tok | Annual recurring |
|---|---|---|---|
| OpenAI 3-small | $0.80 | $0.10 | $1.20/yr |
| Cohere | $4.00 | $0.50 | $6.00/yr |
| Voyage 3-large | $7.20 | $0.90 | $10.80/yr |

OpenAI 3-small is **trivially cheap** at our scale — embedding cost is
not a meaningful constraint until 10M+ memories.

### Storage on Supabase

400k memories × 6 KB embedding = 2.4 GB. Under Pro tier 8 GB limit.

### Query cost

Reads on Supabase Pro: **unlimited at the included CPU/IO**. Real
constraint is concurrent connections (60 on Pro) — should be fine; vector
queries are bursty per user, not continuous.

**Total estimated annual cost for Memory infrastructure**: ~$300/yr
(Supabase Pro $25/mo) + ~$2/yr (embeddings) = **~$302/yr** for the first
year. Negligible.

---

## 6. Implementation skeleton (S24)

### Migration

```sql
-- supabase/migrations/0024_memory_embeddings.sql
CREATE EXTENSION IF NOT EXISTS vector;

ALTER TABLE memory
  ADD COLUMN embedding vector(1536),
  ADD COLUMN embedding_model text NOT NULL DEFAULT 'text-embedding-3-small',
  ADD COLUMN embedding_version int NOT NULL DEFAULT 1;

CREATE INDEX memory_embedding_hnsw_idx
  ON memory USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);

-- RLS unchanged — relies on existing user_id policy from S2.
```

### Embedding worker (server-side)

```ts
// apps/web/lib/embeddings.ts (S24)
export async function embed(text: string): Promise<number[]> {
  const res = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });
  return res.data[0].embedding;
}
```

### Query

```sql
-- "Find 5 most relevant memories for query embedding $1"
SELECT id, body, 1 - (embedding <=> $1) AS similarity
FROM memory
WHERE user_id = auth.uid()
ORDER BY embedding <=> $1
LIMIT 5;
```

`<=>` is pgvector's cosine-distance operator. RLS via `auth.uid()` ensures
each user only retrieves their own memories.

### Re-embedding strategy

When (not if) we change models:

1. Add new column `embedding_v2 vector(N)`.
2. Background job re-embeds rows in batches; sets `embedding_version = 2`.
3. Query layer checks version flag and uses correct column.
4. Once 100% migrated, drop old column.

`embedding_model` + `embedding_version` columns are baked in from day one to
support this.

---

## 7. Open questions for the user

| # | Question | Default if not answered |
|---|---|---|
| 1 | OK to adopt OpenAI embedding API as default? Implies signing up for OpenAI billing. | Yes — cheapest credible path. |
| 2 | 1536 dims OK, or want to reduce for storage savings? | 1536 default. |
| 3 | Supabase Pro tier OK budget-wise (~$25/mo)? | Yes — free tier doesn't fit memory volume past ~80k rows. |
| 4 | Need exact-search fallback (no index) for legal/compliance? | No — HNSW recall is enough. |
| 5 | Cohere fallback for Korean if quality complaints arise? | Defer to actual feedback. |

---

## 8. Decision summary (recommended)

| Axis | Decision |
|---|---|
| Provider | **OpenAI `text-embedding-3-small`** |
| Dimensions | **1536** |
| Index | **HNSW** (`m=16, ef_construction=64`) |
| Distance | **Cosine** (`vector_cosine_ops`) |
| Tier | **Supabase Pro** ($25/mo) |
| Versioning | **`embedding_model` + `embedding_version` cols from S24** |
| Re-embed | **Lazy column-swap pattern when model changes** |

S24 implementer: this doc → S24 plan stage → migration + embed-worker
codepath. No infra change in this PR; the migration lands when S24 begins.

---

## 9. References

- [pgvector GitHub](https://github.com/pgvector/pgvector) — docs + index parameter recommendations
- [Supabase pgvector guide](https://supabase.com/docs/guides/ai/vector-columns)
- [OpenAI embeddings docs](https://platform.openai.com/docs/guides/embeddings)
- [Cohere Embed v3 multilingual](https://docs.cohere.com/docs/multilingual-language-models)
- [BAAI BGE-M3 model card](https://huggingface.co/BAAI/bge-m3)
- [MTEB leaderboard](https://huggingface.co/spaces/mteb/leaderboard) — for tracking provider quality over time
- [Supabase pricing](https://supabase.com/pricing) — tier limits
