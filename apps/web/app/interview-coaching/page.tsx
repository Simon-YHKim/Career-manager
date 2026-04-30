"use client";

import { useToast, Button, Card, Tag } from "@/components/ui";
import { StageHero } from "@/components/StageHero";

type CoachingSession = {
  id: string;
  target: string;
  questionCount: number;
  /** Top 1-2 line feedback summary from LLM. */
  summary: string;
  date: string;
};

const SEED: readonly CoachingSession[] = [
  {
    id: "ic1",
    target: "토스 · Backend Engineer · 1차 기술",
    questionCount: 8,
    summary:
      "기술적 깊이는 강하지만 의사결정 trade-off 설명이 짧음. STAR 의 R(esult)을 정량화하기.",
    date: "2026-04-26",
  },
  {
    id: "ic2",
    target: "네이버 · Frontend · 컬처핏",
    questionCount: 6,
    summary:
      "협업 경험 어휘가 동어 반복. '커뮤니케이션' → '구체적인 동기화 패턴' 으로 치환 권장.",
    date: "2026-04-22",
  },
];

export default function InterviewCoachingPage() {
  const { show } = useToast();
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <StageHero
        stageKey="interviewCoaching"
        action={
          <Button
            variant="primary"
            onClick={() => show({ kind: "info", message: "S11 에서 LLM 코칭 wiring." })}
          >
            + 새 코칭 세션
          </Button>
        }
      />

      <section className="mt-8 space-y-3">
        <p className="text-xs font-medium uppercase tracking-widest text-stage-resume-700">
          이전 코칭 세션 ({SEED.length})
        </p>
        {SEED.map((s) => (
          <Card key={s.id} interactive href="#" className="space-y-3">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-base font-semibold leading-tight">{s.target}</p>
              <Tag>{s.questionCount} 문항</Tag>
            </div>
            <p className="text-sm leading-relaxed text-stage-resume-700">
              {s.summary}
            </p>
            <p className="font-mono text-[11px] text-stage-resume-700">{s.date}</p>
          </Card>
        ))}
      </section>

      <p className="mt-10 text-center font-mono text-[11px] uppercase tracking-widest text-stage-resume-700">
        S11 에서 JD + experience_atom 기반 질문 생성 + 답변 피드백 LLM
      </p>
    </main>
  );
}
