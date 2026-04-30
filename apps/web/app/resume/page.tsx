"use client";

import { useToast, Button, Card, Tag } from "@/components/ui";
import { StageHero } from "@/components/StageHero";

type Resume = {
  id: string;
  /** Company / role this version is tuned for. */
  target: string;
  status: "draft" | "ready" | "submitted";
  updated: string; // YYYY-MM-DD
  pages: number;
};

const statusLabel: Record<Resume["status"], string> = {
  draft: "초안",
  ready: "완성",
  submitted: "제출",
};

const SEED: readonly Resume[] = [
  {
    id: "r1",
    target: "토스 · Backend Engineer",
    status: "submitted",
    updated: "2026-04-25",
    pages: 1,
  },
  {
    id: "r2",
    target: "네이버 · Frontend Engineer",
    status: "ready",
    updated: "2026-04-22",
    pages: 1,
  },
  {
    id: "r3",
    target: "(공통) 한 페이지 요약본",
    status: "draft",
    updated: "2026-04-18",
    pages: 1,
  },
];

export default function ResumePage() {
  const { show } = useToast();

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <StageHero
        stageKey="resume"
        action={
          <Button
            variant="primary"
            onClick={() => show({ kind: "info", message: "S6 에서 LLM 기반 ATS-tuned 생성으로 연결됩니다." })}
          >
            + 새 이력서
          </Button>
        }
      />

      <section className="mt-8 space-y-3">
        <p className="text-xs font-medium uppercase tracking-widest text-stage-resume-700">
          이력서 버전 ({SEED.length})
        </p>
        {SEED.map((r) => (
          <Card key={r.id} interactive href="#" className="space-y-2">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-base font-semibold leading-tight">{r.target}</p>
              <Tag>{statusLabel[r.status]}</Tag>
            </div>
            <p className="font-mono text-[11px] text-stage-resume-700">
              마지막 수정 {r.updated} · {r.pages} 페이지
            </p>
          </Card>
        ))}
      </section>

      <p className="mt-10 text-center font-mono text-[11px] uppercase tracking-widest text-stage-resume-700">
        S6 에서 experience_atom + JD → ATS-tuned 이력서로 자동 생성
      </p>
    </main>
  );
}
