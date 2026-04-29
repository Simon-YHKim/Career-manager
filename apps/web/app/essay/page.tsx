"use client";

import { useState } from "react";
import { useToast, Button, Card, Tag } from "@/components/ui";
import { StageHero } from "@/components/StageHero";

type Essay = {
  id: string;
  company: string;
  status: "draft" | "submitted" | "outdated";
  questions: number;
  totalChars: number;
  updated: string;
};

const SEED: readonly Essay[] = [
  {
    id: "e1",
    company: "토스",
    status: "submitted",
    questions: 3,
    totalChars: 4200,
    updated: "2026-04-20",
  },
  {
    id: "e2",
    company: "네이버",
    status: "draft",
    questions: 4,
    totalChars: 2800,
    updated: "2026-04-26",
  },
  {
    id: "e3",
    company: "카카오 (지난 시즌)",
    status: "outdated",
    questions: 5,
    totalChars: 5100,
    updated: "2025-09-12",
  },
];

const statusLabel: Record<Essay["status"], string> = {
  draft: "작성 중",
  submitted: "제출",
  outdated: "예전",
};

export default function EssayPage() {
  const { show } = useToast();
  const [filter, setFilter] = useState<Essay["status"] | "all">("all");

  const visible = filter === "all" ? SEED : SEED.filter((e) => e.status === filter);
  const filters: readonly (Essay["status"] | "all")[] = [
    "all",
    "draft",
    "submitted",
    "outdated",
  ];
  const filterLabel: Record<(typeof filters)[number], string> = {
    all: "전체",
    draft: "작성 중",
    submitted: "제출",
    outdated: "예전",
  };

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <StageHero
        stageKey="essay"
        action={
          <Button
            variant="primary"
            onClick={() =>
              show({ kind: "info", message: "S7 에서 JD reframe + LLM 작성으로 연결됩니다." })
            }
          >
            + 자소서 시작
          </Button>
        }
      />

      <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="상태 필터">
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            aria-pressed={filter === f}
            onClick={() => setFilter(f)}
            className="rounded-full border border-stage-essay-100 px-3 py-1 text-xs font-medium transition-colors motion-reduce:transition-none data-[active=true]:bg-stage-essay-500 data-[active=true]:text-stage-essay-50"
            data-active={filter === f}
          >
            {filterLabel[f]}
          </button>
        ))}
      </div>

      <section className="mt-6 space-y-3">
        {visible.map((e) => (
          <Card key={e.id} interactive href="#" className="space-y-2">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-base font-semibold leading-tight">{e.company}</p>
              <Tag stage="essay">{statusLabel[e.status]}</Tag>
            </div>
            <p className="font-mono text-[11px] text-stage-resume-700">
              {e.questions} 문항 · {e.totalChars.toLocaleString()}자 · 수정 {e.updated}
            </p>
          </Card>
        ))}
        {visible.length === 0 && (
          <Card>
            <p className="text-sm text-stage-resume-700">
              해당 상태의 자소서가 없습니다.
            </p>
          </Card>
        )}
      </section>

      <p className="mt-10 text-center font-mono text-[11px] uppercase tracking-widest text-stage-resume-700">
        S7 에서 JD 분석 + experience_atom matching + LLM reframe 으로 자동 작성
      </p>
    </main>
  );
}
