"use client";

import { useToast, Button, Card, Tag } from "@/components/ui";
import { StageHero } from "@/components/StageHero";
import { stages } from "@career/design-tokens";

type Negotiation = {
  id: string;
  company: string;
  offerKrw: number;
  counterKrw: number;
  finalKrw: number | null;
  status: "in-progress" | "accepted" | "declined";
  date: string;
};

type MarketRow = {
  role: string;
  bandLow: number;
  bandHigh: number;
  median: number;
  source: string;
};

const SEED_MARKET: readonly MarketRow[] = [
  {
    role: "Backend · 5년차 · 서울",
    bandLow: 7800,
    bandHigh: 11200,
    median: 9200,
    source: "잡코리아 + 원티드 분포 (2026-Q1)",
  },
  {
    role: "Frontend · 3년차 · 서울",
    bandLow: 6200,
    bandHigh: 9000,
    median: 7400,
    source: "잡코리아 + 원티드 분포 (2026-Q1)",
  },
  {
    role: "Platform · 7년차 · 영미권 원격",
    bandLow: 16000,
    bandHigh: 28000,
    median: 21000,
    source: "Levels.fyi + Glassdoor (2026-Q1)",
  },
];

const SEED_NEGOTIATIONS: readonly Negotiation[] = [
  {
    id: "n1",
    company: "토스",
    offerKrw: 8800,
    counterKrw: 9600,
    finalKrw: 9300,
    status: "accepted",
    date: "2024-12-18",
  },
  {
    id: "n2",
    company: "네이버",
    offerKrw: 8200,
    counterKrw: 9000,
    finalKrw: null,
    status: "in-progress",
    date: "2026-04-26",
  },
];

const statusLabel: Record<Negotiation["status"], string> = {
  "in-progress": "진행 중",
  accepted: "수락",
  declined: "거절",
};

function fmtKrw(amount: number): string {
  // amount given in 만원
  return `${amount.toLocaleString()}만`;
}

function MarketBar({ row }: { row: MarketRow }) {
  const palette = stages.salary;
  const range = row.bandHigh - row.bandLow;
  const medianPos = ((row.median - row.bandLow) / range) * 100;
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between">
        <p className="text-sm font-medium">{row.role}</p>
        <p className="font-mono text-xs text-stage-resume-700">
          {fmtKrw(row.bandLow)} – {fmtKrw(row.bandHigh)} · 중간값 {fmtKrw(row.median)}
        </p>
      </div>
      <div className="relative h-2 w-full rounded-full" style={{ backgroundColor: palette["100"] }}>
        <div
          className="absolute top-0 h-2 w-px"
          style={{ left: `${medianPos}%`, backgroundColor: palette["900"] }}
          aria-hidden="true"
        />
      </div>
      <p className="font-mono text-[10px] text-stage-resume-700">{row.source}</p>
    </div>
  );
}

export default function SalaryPage() {
  const { show } = useToast();

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <StageHero
        stageKey="salary"
        action={
          <Button
            variant="primary"
            onClick={() => show({ kind: "info", message: "S13 에서 협상 스크립트 + 시장 데이터 fetch wiring." })}
          >
            + 협상 시뮬레이션
          </Button>
        }
      />

      <section className="mt-8 space-y-4">
        <p className="text-xs font-medium uppercase tracking-widest text-stage-resume-700">
          시장 데이터 (참고용)
        </p>
        <Card className="space-y-5">
          {SEED_MARKET.map((row) => (
            <MarketBar key={row.role} row={row} />
          ))}
        </Card>
        <p className="font-mono text-[10px] uppercase tracking-widest text-stage-resume-700">
          mock — S13 에서 실시간 fetch + 직무·연차·지역 필터로 교체
        </p>
      </section>

      <section className="mt-10 space-y-3">
        <p className="text-xs font-medium uppercase tracking-widest text-stage-resume-700">
          내 협상 기록 ({SEED_NEGOTIATIONS.length})
        </p>
        {SEED_NEGOTIATIONS.map((n) => (
          <Card key={n.id} interactive href="#" className="space-y-3">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-base font-semibold leading-tight">{n.company}</p>
              <Tag stage="salary">{statusLabel[n.status]}</Tag>
            </div>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-stage-resume-700">
                  Offer
                </p>
                <p className="font-mono text-base">{fmtKrw(n.offerKrw)}</p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-stage-resume-700">
                  Counter
                </p>
                <p className="font-mono text-base">{fmtKrw(n.counterKrw)}</p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-stage-resume-700">
                  Final
                </p>
                <p className="font-mono text-base">{n.finalKrw ? fmtKrw(n.finalKrw) : "—"}</p>
              </div>
            </div>
            <p className="font-mono text-[10px] text-stage-resume-700">{n.date}</p>
          </Card>
        ))}
      </section>

      <p className="mt-10 text-center font-mono text-[11px] uppercase tracking-widest text-stage-resume-700">
        S13 에서 시장 데이터 + 협상 스크립트 LLM + 시뮬레이션 룸
      </p>
    </main>
  );
}
