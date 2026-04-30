"use client";

import { useMemo, useState } from "react";
import { stageLabels, stageTagline } from "@/lib/stages-config";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Button, Card, Tag } from "@/components/ui";
import {
  articles,
  categoryFilters,
  categoryLabel,
  type CategoryFilter,
} from "@/lib/blog-articles";

const PAGE_SIZE = 4;

export default function BlogPage() {
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (category === "all") return articles;
    return articles.filter((a) => a.category === category);
  }, [category]);

  const visible = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = visible.length < filtered.length;

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <Breadcrumb category={null} current={stageLabels.blog.ko} />

      <header className="mt-6 border-l-2 border-stage-resume-900 pl-4">
        <p className="font-mono text-[11px] uppercase tracking-widest text-stage-resume-700">
          blog · {stageLabels.blog.en}
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">
          {stageLabels.blog.ko}
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-stage-resume-700">
          {stageTagline.blog}
        </p>
      </header>

      <div
        className="mt-8 flex flex-wrap gap-2"
        role="group"
        aria-label="카테고리 필터"
      >
        {categoryFilters.map((c) => {
          const active = category === c;
          return (
            <button
              key={c}
              type="button"
              aria-pressed={active}
              onClick={() => {
                setCategory(c);
                setPage(1);
              }}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors motion-reduce:transition-none ${
                active
                  ? "border-stage-resume-900 bg-stage-resume-900 text-white"
                  : "border-stage-resume-100 text-stage-resume-700 hover:border-stage-resume-700"
              }`}
            >
              {categoryLabel[c]}
            </button>
          );
        })}
      </div>

      <section className="mt-6 grid gap-4 sm:grid-cols-2">
        {visible.map((article) => (
          <Card
            key={article.slug}
            interactive
            href={`/blog/${article.slug}`}
            className="flex h-full flex-col gap-3"
          >
            <div className="flex items-baseline justify-between gap-2">
              <Tag>{categoryLabel[article.category]}</Tag>
              <span className="font-mono text-[10px] text-stage-resume-700">
                {article.readMinutes}분 · {article.publishedAt}
              </span>
            </div>
            <h2 className="text-base font-semibold leading-snug text-stage-resume-900">
              {article.title}
            </h2>
            <p className="text-sm leading-relaxed text-stage-resume-700">
              {article.excerpt}
            </p>
          </Card>
        ))}
        {visible.length === 0 && (
          <Card className="sm:col-span-2">
            <p className="text-sm text-stage-resume-700">
              해당 카테고리에는 아직 글이 없습니다.
            </p>
          </Card>
        )}
      </section>

      {hasMore && (
        <div className="mt-8 flex justify-center">
          <Button variant="ghost" onClick={() => setPage((p) => p + 1)}>
            더 보기
          </Button>
        </div>
      )}
    </main>
  );
}
