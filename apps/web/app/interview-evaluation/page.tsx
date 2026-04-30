"use client";

import { useToast, Button, Card, Tag } from "@/components/ui";
import { StageHero } from "@/components/StageHero";

type EvalSession = {
  id: string;
  target: string;
  score: number; // 0-100
  strengths: readonly string[];
  weaknesses: readonly string[];
  date: string;
};

const SEED: readonly EvalSession[] = [
  {
    id: "ie1",
    target: "토스 · Backend · 2차 시스템 디자인",
    score: 78,
    strengths: ["scaling 사례 풍부", "trade-off 명시"],
    weaknesses: ["fail-over 케이스 부족", "비용 추정 모호"],
    date: "2026-04-25",
  },
  {
    id: "ie2",
    target: "네이버 · Frontend · 1차 기술",
    score: 64,
    strengths: ["코드 리뷰 관점 명확"],
    weaknesses: ["성능 측정 도구 언급 부재", "가설 검증 절차 불명"],
    date: "2026-04-19",
  },
];

function ScoreBar({ score }: { score: number }) {
  // Monotone: shade ramp by score tier — palette stays neutral.
  const tier = score >= 80 ? "high" : score >= 60 ? "mid" : "low";
  const fillClass =
    tier === "high"
      ? "bg-stage-resume-900"
      : tier === "mid"
        ? "bg-stage-resume-500"
        : "bg-stage-resume-100";
  return (
    <div className="space-y-1">
      <div className="flex items-baseline justify-between">
        <span className="font-mono text-[11px] uppercase tracking-widest text-stage-resume-700">
          종합 점수
        </span>
        <span className="font-mono text-2xl font-semibold text-stage-resume-900">
          {score}
          <span className="text-sm text-stage-resume-700">/100</span>
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-stage-resume-100">
        <div
          className={`h-full transition-[width] motion-reduce:transition-none ${fillClass}`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

export default function InterviewEvaluationPage() {
  const { show } = useToast();

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <StageHero
        stageKey="interviewEvaluation"
        action={
          <Button
            variant="primary"
            onClick={() => show({ kind: "info", message: "S12 에서 평가 채점기 + 통계 wiring." })}
          >
            + 평가 시작
          </Button>
        }
      />

      <section className="mt-8 space-y-4">
        <p className="text-xs font-medium uppercase tracking-widest text-stage-resume-700">
          평가된 세션 ({SEED.length})
        </p>
        {SEED.map((s) => (
          <Card key={s.id} interactive href="#" className="space-y-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-base font-semibold leading-tight">{s.target}</p>
              <Tag>{s.date}</Tag>
            </div>
            <ScoreBar score={s.score} />
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-stage-resume-700">
                  강점
                </p>
                <ul className="mt-1 ml-4 list-disc space-y-0.5 text-sm text-stage-resume-900 marker:text-stage-resume-700">
                  {s.strengths.map((x, i) => (
                    <li key={i}>{x}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-stage-resume-700">
                  개선
                </p>
                <ul className="mt-1 ml-4 list-disc space-y-0.5 text-sm text-stage-resume-900 marker:text-stage-resume-700">
                  {s.weaknesses.map((x, i) => (
                    <li key={i}>{x}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        ))}
      </section>

      <p className="mt-10 text-center font-mono text-[11px] uppercase tracking-widest text-stage-resume-700">
        S12 에서 LLM 답변 평가 + rubric 기반 점수 산출 + 시계열 추이
      </p>
    </main>
  );
}
