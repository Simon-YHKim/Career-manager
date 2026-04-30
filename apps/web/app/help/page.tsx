"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Card } from "@/components/ui";
import {
  helpCategories,
  helpEntries,
  type HelpCategoryId,
  type HelpEntry,
} from "@/lib/help-qa";

type Filter = "all" | HelpCategoryId;

function matches(entry: HelpEntry, q: string): boolean {
  if (!q) return true;
  const needle = q.toLowerCase();
  return (
    entry.q.toLowerCase().includes(needle) ||
    entry.a.toLowerCase().includes(needle)
  );
}

export default function HelpPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const counts = useMemo(() => {
    const out: Record<Filter, number> = { all: helpEntries.length } as Record<
      Filter,
      number
    >;
    helpCategories.forEach((c) => {
      out[c.id] = helpEntries.filter((e) => e.category === c.id).length;
    });
    return out;
  }, []);

  const filtered = useMemo(() => {
    return helpEntries.filter((e) => {
      if (filter !== "all" && e.category !== filter) return false;
      return matches(e, query.trim());
    });
  }, [filter, query]);

  const grouped = useMemo(() => {
    const out: Record<HelpCategoryId, HelpEntry[]> = {} as Record<
      HelpCategoryId,
      HelpEntry[]
    >;
    filtered.forEach((e) => {
      (out[e.category] ??= []).push(e);
    });
    return out;
  }, [filtered]);

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <Breadcrumb category={null} current="Q&A · 사용 안내" />
      <header className="mt-6 border-l-2 border-stage-resume-900 pl-4">
        <p className="font-mono text-[11px] uppercase tracking-widest text-stage-resume-700">
          help · q&amp;a
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">
          Q&amp;A · 사용 안내
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-stage-resume-700">
          서비스 이용 중 떠오를 만한 질문 {helpEntries.length}개를 카테고리별로 정리했습니다.
          검색으로도 찾아보세요. 새 질문이 필요하면 GitHub Issue 로 알려주세요.
        </p>
      </header>

      <section className="mt-8 space-y-3">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="질문이나 키워드로 검색 (예: '로그인', '연봉', '리멤버')"
          className="w-full rounded-md border border-stage-resume-100 bg-white px-4 py-3 text-sm transition-colors focus-visible:border-stage-resume-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stage-resume-700"
          aria-label="Q&A 검색"
        />
      </section>

      <section
        className="mt-4 flex flex-wrap gap-2"
        role="group"
        aria-label="카테고리 필터"
      >
        {(
          [{ id: "all", title: "전체" } as { id: Filter; title: string }] as {
            id: Filter;
            title: string;
          }[]
        )
          .concat(
            helpCategories.map((c) => ({ id: c.id as Filter, title: c.title })),
          )
          .map((c) => {
            const active = filter === c.id;
            const count = counts[c.id] ?? 0;
            return (
              <button
                key={c.id}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(c.id)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors motion-reduce:transition-none ${
                  active
                    ? "border-stage-resume-900 bg-stage-resume-900 text-white"
                    : "border-stage-resume-100 text-stage-resume-700 hover:border-stage-resume-700"
                }`}
              >
                {c.title}
                <span className="ml-1.5 font-mono text-[10px] opacity-70">
                  {count}
                </span>
              </button>
            );
          })}
      </section>

      <section className="mt-6 space-y-6">
        {filtered.length === 0 ? (
          <Card>
            <p className="text-sm text-stage-resume-700">
              일치하는 질문이 없습니다. 다른 키워드로 검색해 보세요.
            </p>
          </Card>
        ) : (
          helpCategories.map((cat) => {
            const entries = grouped[cat.id] ?? [];
            if (entries.length === 0) return null;
            return (
              <section
                key={cat.id}
                aria-labelledby={`cat-${cat.id}`}
                className="space-y-3"
              >
                <header className="flex items-baseline justify-between gap-2 border-b border-stage-resume-100 pb-2">
                  <h2
                    id={`cat-${cat.id}`}
                    className="text-base font-semibold text-stage-resume-900"
                  >
                    {cat.title}
                  </h2>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-stage-resume-500">
                    {cat.subtitle} · {entries.length}
                  </p>
                </header>
                {entries.map((qa) => (
                  <details
                    key={qa.id}
                    className="group rounded-xl border border-stage-resume-100 bg-white p-4 open:border-stage-resume-700"
                  >
                    <summary className="cursor-pointer list-none text-base font-semibold text-stage-resume-900 marker:hidden">
                      <span className="mr-1.5 font-mono text-stage-resume-500 group-open:rotate-90 inline-block transition-transform motion-reduce:transition-none">
                        ›
                      </span>
                      {qa.q}
                    </summary>
                    <p className="mt-2 text-sm leading-relaxed text-stage-resume-700">
                      {qa.a}
                    </p>
                    {qa.href && (
                      <Link
                        href={qa.href}
                        className="mt-2 inline-block font-mono text-[10px] uppercase tracking-widest text-stage-resume-700 underline-offset-4 hover:underline hover:text-stage-resume-900"
                      >
                        ↗ 관련 페이지로 이동
                      </Link>
                    )}
                  </details>
                ))}
              </section>
            );
          })
        )}
      </section>

      <p className="mt-10 text-center font-mono text-[11px] uppercase tracking-widest text-stage-resume-700">
        S?: 마크다운 기반 CMS 분리 + 사용자 직접 질문 등록
      </p>
    </main>
  );
}
