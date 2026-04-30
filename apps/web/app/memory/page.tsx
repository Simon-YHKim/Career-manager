"use client";

import { useMemo, useState } from "react";
import { Card, Tag } from "@/components/ui";
import { StageHero } from "@/components/StageHero";

type MemorySource =
  | "interview"
  | "coaching"
  | "experience"
  | "essay"
  | "negotiation"
  | "note";

type Memory = {
  id: string;
  text: string;
  source: MemorySource;
  /** Where it came from — usually company/role/topic. */
  origin: string;
  date: string;
};

const sourceLabel: Record<MemorySource, string> = {
  interview: "면접",
  coaching: "코칭",
  experience: "경험",
  essay: "자소서",
  negotiation: "협상",
  note: "메모",
};

/**
 * Mock memories spanning the surfaces — each row simulates an embedding
 * from a different feature. S24 will replace this with a vector search
 * over the actual `memory` table on Supabase + pgvector.
 */
const SEED: readonly Memory[] = [
  {
    id: "m1",
    text: "Redis 캐싱 + read replica 도입으로 결제 트랜잭션 처리량 5x 개선 (peak 200 → 1000 RPS), 평균 latency 40ms → 12ms.",
    source: "experience",
    origin: "토스 · Backend",
    date: "2024-08-12",
  },
  {
    id: "m2",
    text: "면접에서 trade-off 설명할 때 '왜 이걸 안 골랐는지' 까지 포함해야 깊이가 드러난다 — 코칭 피드백.",
    source: "coaching",
    origin: "토스 1차 기술 코칭",
    date: "2026-04-26",
  },
  {
    id: "m3",
    text: "협상에서 carry-over 보너스 + 사이닝 보너스를 base 와 분리해서 협상 가능. base 는 향후 인상의 기준이라 더 중요.",
    source: "negotiation",
    origin: "토스 협상 (2024)",
    date: "2024-12-10",
  },
  {
    id: "m4",
    text: "본인이 약점이라고 생각하는 것을 미리 정리하지 않은 상태로 면접 들어가면 즉흥 답변이 어색해진다.",
    source: "interview",
    origin: "회고 · 네이버 1차",
    date: "2026-04-19",
  },
  {
    id: "m5",
    text: "Yjs CRDT 환경에서 동시 편집 100명 안정 처리 — Hocuspocus + Postgres backend 조합.",
    source: "experience",
    origin: "OSS Realtime Editor",
    date: "2024-11-02",
  },
  {
    id: "m6",
    text: "자소서 '왜 우리 회사' 답변에서 회사의 최근 product launch 를 인용하면 ATS·사람 모두 좋게 본다.",
    source: "essay",
    origin: "자소서 회고",
    date: "2026-04-22",
  },
  {
    id: "m7",
    text: "원격 근무 선호 — 출근 강제 시 1년 안에 떠날 가능성 큼. salary 보다 우선순위.",
    source: "note",
    origin: "self-note",
    date: "2026-04-01",
  },
];


export default function MemoryPage() {
  const [query, setQuery] = useState("");
  const [activeSources, setActiveSources] = useState<readonly MemorySource[]>([]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SEED.filter((m) => {
      const sourceOk =
        activeSources.length === 0 || activeSources.includes(m.source);
      if (!sourceOk) return false;
      if (!q) return true;
      return (
        m.text.toLowerCase().includes(q) ||
        m.origin.toLowerCase().includes(q) ||
        sourceLabel[m.source].toLowerCase().includes(q)
      );
    });
  }, [query, activeSources]);

  function toggleSource(s: MemorySource) {
    setActiveSources((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <StageHero stageKey="memory" />

      <section className="mt-8 space-y-3">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="기억을 검색하세요. (예: '협상', 'redis', '면접')"
          className="w-full rounded-md border border-stage-resume-100 bg-white px-4 py-3 text-sm transition-colors focus-visible:border-stage-resume-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stage-resume-700"
          aria-label="메모리 검색"
        />
        <p className="font-mono text-[10px] uppercase tracking-widest text-stage-resume-700">
          현재는 substring 매칭. S24 에서 pgvector 기반 의미 검색으로 교체.
        </p>
      </section>

      <section className="mt-6 flex flex-wrap gap-2" role="group" aria-label="출처 필터">
        {(Object.keys(sourceLabel) as MemorySource[]).map((s) => {
          const active = activeSources.includes(s);
          return (
            <button
              key={s}
              type="button"
              aria-pressed={active}
              onClick={() => toggleSource(s)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors motion-reduce:transition-none ${
                active
                  ? "border-stage-resume-900 bg-stage-resume-900 text-white"
                  : "border-stage-resume-100 text-stage-resume-700 hover:border-stage-resume-700"
              }`}
            >
              {sourceLabel[s]}
            </button>
          );
        })}
      </section>

      <section className="mt-6 space-y-3">
        <p className="text-xs font-medium uppercase tracking-widest text-stage-resume-700">
          {filtered.length === SEED.length
            ? `누적 기억 (${SEED.length})`
            : `필터 결과 (${filtered.length} / ${SEED.length})`}
        </p>
        {filtered.length === 0 ? (
          <Card>
            <p className="text-sm text-stage-resume-700">
              일치하는 기억이 없습니다. 다른 키워드로 검색해 보세요.
            </p>
          </Card>
        ) : (
          filtered.map((m) => (
            <Card key={m.id} className="space-y-2">
              <p className="text-sm leading-relaxed text-stage-resume-900">
                {m.text}
              </p>
              <div className="flex flex-wrap items-baseline gap-2">
                <Tag>{sourceLabel[m.source]}</Tag>
                <span className="font-mono text-[11px] text-stage-resume-700">
                  {m.origin} · {m.date}
                </span>
              </div>
            </Card>
          ))
        )}
      </section>

      <p className="mt-10 text-center font-mono text-[11px] uppercase tracking-widest text-stage-resume-700">
        S24 에서 pgvector 1536-dim · HNSW 인덱스 · 의미 검색으로 교체
        <br />
        (전략 doc:{" "}
        <a
          href="https://github.com/Simon-YHKim/Career-manager/blob/main/docs/research/2026-04-29-pgvector-and-embeddings.md"
          className="underline"
        >
          docs/research/2026-04-29-pgvector-and-embeddings.md
        </a>
        )
      </p>
    </main>
  );
}
