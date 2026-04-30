"use client";

import { useMemo, useState } from "react";
import { stageLabels, stageTagline } from "@/lib/stages-config";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Button, Card, Tag } from "@/components/ui";

type BlogCategory =
  | "all"
  | "resume"
  | "essay"
  | "interview"
  | "salary"
  | "career-change"
  | "market"
  | "tools";

type Article = {
  id: string;
  title: string;
  category: Exclude<BlogCategory, "all">;
  excerpt: string;
  readMinutes: number;
  publishedAt: string;
};

const categoryLabel: Record<BlogCategory, string> = {
  all: "전체",
  resume: "이력서",
  essay: "자소서",
  interview: "면접",
  salary: "협상",
  "career-change": "이직",
  market: "시장 동향",
  tools: "자기 정리",
};

/** Mock data — replaces with CMS / Astro feed in S17. */
const MOCK_ARTICLES: readonly Article[] = [
  {
    id: "1",
    title: "이력서 한 페이지에 들어가야 하는 7가지",
    category: "resume",
    excerpt:
      "스크리닝 단계에서 채용담당자가 평균 7초를 보는 이력서. 7초 안에 통과시키려면 어떤 정보가 어떤 순서로 있어야 할지 정리했습니다.",
    readMinutes: 6,
    publishedAt: "2026-04-22",
  },
  {
    id: "2",
    title: "자소서를 STAR로 쓰면 안 되는 이유",
    category: "essay",
    excerpt:
      "STAR(Situation-Task-Action-Result)는 면접 답변 프레임이지 자소서 프레임이 아닙니다. 자소서에 더 적합한 두 가지 구조를 비교합니다.",
    readMinutes: 8,
    publishedAt: "2026-04-19",
  },
  {
    id: "3",
    title: "면접관이 던지는 압박 질문 5가지와 그 본질",
    category: "interview",
    excerpt:
      "왜 우리 회사인가요? · 약점이 무엇인가요? · 5년 후 모습은? — 진짜로 무엇을 묻고 있는지를 분해해야 답이 나옵니다.",
    readMinutes: 10,
    publishedAt: "2026-04-15",
  },
  {
    id: "4",
    title: "한국에서 협상 못 한다고 손해보는 평균 금액",
    category: "salary",
    excerpt:
      "오퍼 받았을 때 그대로 사인하시나요? 데이터로 본 협상 가능 폭과 한국 시장에서 통하는 협상 스크립트.",
    readMinutes: 7,
    publishedAt: "2026-04-10",
  },
  {
    id: "5",
    title: "한국 → 영미권 이직, 1년 전부터 준비할 4가지",
    category: "career-change",
    excerpt:
      "비자 · 영문 이력서 · 네트워킹 · 영어 인터뷰. 시간을 거꾸로 돌려 1년 전 나에게 줬으면 좋았을 체크리스트.",
    readMinutes: 12,
    publishedAt: "2026-04-05",
  },
  {
    id: "6",
    title: "포트폴리오에 코드 GitHub 링크 vs 자체 사이트, 무엇이 더 좋은가",
    category: "resume",
    excerpt:
      "엔지니어링 · 디자인 · 데이터 직군별로 채용담당자가 실제로 클릭하는 비율을 비교한 데이터.",
    readMinutes: 5,
    publishedAt: "2026-04-01",
  },
];

const categoryFilters: readonly BlogCategory[] = [
  "all",
  "resume",
  "essay",
  "interview",
  "salary",
  "career-change",
  "market",
  "tools",
];

const PAGE_SIZE = 4;

export default function BlogPage() {
  const [category, setCategory] = useState<BlogCategory>("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (category === "all") return MOCK_ARTICLES;
    return MOCK_ARTICLES.filter((a) => a.category === category);
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

      <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="카테고리 필터">
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
          <Card key={article.id} interactive href="#" className="flex h-full flex-col gap-3">
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

      <section
        aria-label="발행 정책"
        className="mt-12 rounded-2xl border border-stage-resume-100 bg-white p-5"
      >
        <p className="font-mono text-[11px] uppercase tracking-widest text-stage-resume-500">
          발행 정책 · publishing
        </p>
        <h2 className="mt-1 text-lg font-semibold text-stage-resume-900">
          매주 월요일 새벽 5시, 매일 새벽 5시 (KST)
        </h2>
        <ul className="mt-3 space-y-1.5 text-sm leading-relaxed text-stage-resume-700">
          <li>
            • 매일 05:00 — 카테고리 1개에 대해 AI가 웹 정보를 모아 본문 1편을 발행합니다.
          </li>
          <li>
            • 매주 월 05:00 — 한 주 발행물 요약 + 시장 동향 한 줄.
          </li>
          <li>
            • 중복 차단 — 임베딩 기반으로 최근 글과 비슷한 주제는 건너뜁니다.
          </li>
          <li>
            • 포화 시 — 채용 시장 뉴스 (정부 정책 · 글로벌 레이오프 · 시장 보고서) 모드로 전환.
          </li>
        </ul>
        <p className="mt-3 font-mono text-[10px] uppercase tracking-widest text-stage-resume-500">
          상세 spec: docs/specs/blog-content-pipeline.md (S17 · S25 합류 시 활성화)
        </p>
      </section>

      <p className="mt-10 text-center font-mono text-[11px] uppercase tracking-widest text-stage-resume-700">
        S17 Astro · S24 pgvector · S25 Cron 으로 점진 활성화
      </p>
    </main>
  );
}
