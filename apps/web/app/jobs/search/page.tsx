"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Button, Card, Tag, useToast } from "@/components/ui";

/** Mock posting — proxies the shape returned by 잡코리아 / 원티드 / Linkedin scrapers. */
type Posting = {
  id: string;
  source: "wanted" | "jumpit" | "saramin" | "linkedin";
  company: string;
  role: string;
  location: string;
  /** ISO date. */
  deadline: string;
  url: string;
  /** Tags extracted from the JD (S-future). */
  keywords: readonly string[];
};

const sourceLabel: Record<Posting["source"], string> = {
  wanted: "원티드",
  jumpit: "점핏",
  saramin: "사람인",
  linkedin: "LinkedIn",
};

/**
 * Mock corpus — replaces with real scrapers in S?? (likely a Cron-driven
 * Edge Function that polls 5 sources nightly and stores into the
 * `posting` Supabase table).
 */
const CORPUS: readonly Posting[] = [
  {
    id: "p1",
    source: "wanted",
    company: "토스",
    role: "Backend Engineer (Payments)",
    location: "서울",
    deadline: "2026-05-15",
    url: "https://wanted.co.kr/wd/0",
    keywords: ["Kotlin", "Spring", "Kafka", "결제"],
  },
  {
    id: "p2",
    source: "wanted",
    company: "토스",
    role: "Frontend Engineer (Investment)",
    location: "서울",
    deadline: "2026-05-20",
    url: "https://wanted.co.kr/wd/1",
    keywords: ["React", "Next.js", "차트"],
  },
  {
    id: "p3",
    source: "jumpit",
    company: "당근",
    role: "Platform Engineer",
    location: "서울 (하이브리드)",
    deadline: "2026-05-10",
    url: "https://jumpit.saramin.co.kr/0",
    keywords: ["Kubernetes", "Go", "관측성"],
  },
  {
    id: "p4",
    source: "saramin",
    company: "네이버",
    role: "Senior Frontend Engineer",
    location: "분당",
    deadline: "2026-05-08",
    url: "https://saramin.co.kr/0",
    keywords: ["React", "성능 최적화"],
  },
  {
    id: "p5",
    source: "linkedin",
    company: "Coinbase",
    role: "Software Engineer (APAC remote)",
    location: "원격 (APAC)",
    deadline: "2026-05-30",
    url: "https://linkedin.com/jobs/0",
    keywords: ["Go", "Distributed", "원격"],
  },
  {
    id: "p6",
    source: "wanted",
    company: "당근",
    role: "Infra Engineer",
    location: "서울",
    deadline: "2026-05-22",
    url: "https://wanted.co.kr/wd/2",
    keywords: ["Terraform", "AWS", "Observability"],
  },
];

const sources: readonly Posting["source"][] = [
  "wanted",
  "jumpit",
  "saramin",
  "linkedin",
];

export default function JobSearchPage() {
  const { show } = useToast();
  const [query, setQuery] = useState("");
  const [activeSources, setActiveSources] = useState<readonly Posting["source"][]>([]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CORPUS.filter((p) => {
      const sourceOk =
        activeSources.length === 0 || activeSources.includes(p.source);
      if (!sourceOk) return false;
      if (!q) return true;
      return [
        p.company,
        p.role,
        p.location,
        ...p.keywords,
      ].some((field) => field.toLowerCase().includes(q));
    });
  }, [query, activeSources]);

  function toggleSource(s: Posting["source"]) {
    setActiveSources((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
    );
  }

  function handleAdd(p: Posting) {
    // S?+: write to Supabase via /todo store. Today, just toast and bounce.
    show({
      kind: "success",
      message: `${p.company} · ${p.role} → /todo 에 추가 (mock).`,
    });
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <Breadcrumb category={null} current="채용 공고 검색" />

      <header className="mt-6 border-l-2 border-stage-resume-900 pl-4">
        <p className="font-mono text-[11px] uppercase tracking-widest text-stage-resume-700">
          jobs · search
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">
          채용 공고 검색
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-stage-resume-700">
          여러 채널의 공고를 한 곳에서 검색하고, 추가하면 곧장
          {" "}
          <Link href="/todo" className="underline-offset-4 hover:underline">
            할 일
          </Link>
          {" "}에 일정·체크리스트가 따라옵니다.
        </p>
      </header>

      <section className="mt-8 space-y-3">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="회사 · 직무 · 키워드로 검색 (예: 'Backend', '원격', '토스')"
          className="w-full rounded-md border border-stage-resume-100 bg-white px-4 py-3 text-sm transition-colors focus-visible:border-stage-resume-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stage-resume-700"
          aria-label="채용 공고 검색"
        />
        <p className="font-mono text-[10px] uppercase tracking-widest text-stage-resume-500">
          mock 데이터 — 실 scraper · 정렬은 후속 sprint
        </p>
      </section>

      <section className="mt-4 flex flex-wrap gap-2" role="group" aria-label="출처 필터">
        {sources.map((s) => {
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
          검색 결과 ({results.length})
        </p>
        {results.length === 0 ? (
          <Card>
            <p className="text-sm text-stage-resume-700">
              일치하는 공고가 없습니다. 다른 키워드로 검색해 보세요.
            </p>
          </Card>
        ) : (
          results.map((p) => (
            <Card key={p.id} className="space-y-3">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <p className="text-base font-semibold leading-tight">
                    {p.company} · {p.role}
                  </p>
                  <p className="font-mono text-[11px] text-stage-resume-700">
                    {p.location} · 마감 {p.deadline}
                  </p>
                </div>
                <Tag>{sourceLabel[p.source]}</Tag>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {p.keywords.map((k) => (
                  <span
                    key={k}
                    className="rounded-full border border-stage-resume-100 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-stage-resume-700"
                  >
                    {k}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between gap-2">
                <a
                  href={p.url}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-[11px] uppercase tracking-widest text-stage-resume-700 underline-offset-4 hover:underline hover:text-stage-resume-900"
                >
                  ↗ 원본 공고
                </a>
                <Button size="sm" onClick={() => handleAdd(p)}>
                  + /todo 에 추가
                </Button>
              </div>
            </Card>
          ))
        )}
      </section>

      <p className="mt-10 text-center font-mono text-[11px] uppercase tracking-widest text-stage-resume-700">
        S?: 5 source nightly scraper + Supabase posting 테이블 + 추천 정렬
      </p>
    </main>
  );
}
