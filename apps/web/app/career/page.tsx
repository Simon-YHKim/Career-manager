"use client";

import { useToast, Button, Card, Tag } from "@/components/ui";
import { StageHero } from "@/components/StageHero";

type CareerEntry = {
  id: string;
  role: string;
  company: string;
  period: string;
  preview: string;
  wordCount: number;
};

const SEED: readonly CareerEntry[] = [
  {
    id: "c1",
    role: "Backend Engineer",
    company: "토스",
    period: "2023.03 - 2024.12",
    preview:
      "결제 트랜잭션 시스템의 처리량을 5배 개선했습니다. 기존 200 RPS 에서 1000 RPS 까지 안정적으로 처리하기 위해 Redis 캐싱 + read replica 도입, 장애 대응 runbook 작성 등을 진행했고...",
    wordCount: 720,
  },
  {
    id: "c2",
    role: "Open Source Contributor",
    company: "Vercel · Next.js",
    period: "2024.05 - present",
    preview:
      "Next.js App Router 의 useSearchParams 메모이제이션 버그를 발견하고 #52341 PR 로 수정했습니다. next/font/local 의 자동 subsetting 알고리즘 개선 작업도 함께 진행 중...",
    wordCount: 540,
  },
];

export default function CareerPage() {
  const { show } = useToast();

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <StageHero
        stageKey="career"
        action={
          <Button
            variant="primary"
            onClick={() =>
              show({ kind: "info", message: "S6 에서 experience_atom 기반 자동 글쓰기 connect." })
            }
          >
            + 경력기술서 추가
          </Button>
        }
      />

      <section className="mt-8 space-y-3">
        <p className="text-xs font-medium uppercase tracking-widest text-stage-resume-700">
          작성된 경력기술서 ({SEED.length})
        </p>
        {SEED.map((c) => (
          <Card key={c.id} interactive href="#" className="space-y-3">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div>
                <p className="text-base font-semibold leading-tight">{c.role}</p>
                <p className="font-mono text-[11px] text-stage-resume-700">
                  {c.company} · {c.period}
                </p>
              </div>
              <Tag>{c.wordCount} 단어</Tag>
            </div>
            <p className="line-clamp-3 text-sm leading-relaxed text-stage-resume-700">
              {c.preview}
            </p>
          </Card>
        ))}
      </section>

      <p className="mt-10 text-center font-mono text-[11px] uppercase tracking-widest text-stage-resume-700">
        S6 에서 experience atom → 깊이 있는 풀어쓰기 + LLM 자동 작성으로 연결
      </p>
    </main>
  );
}
