"use client";

import { useMemo, useState } from "react";
import { stages } from "@career/design-tokens";
import { stageLabels, stageTagline } from "@/lib/stages-config";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Button, Card, Tag } from "@/components/ui";

type ApplicationStatus = "draft" | "applied" | "interview" | "evaluation" | "result";

type Application = {
  id: string;
  company: string;
  role: string;
  /** ISO date string of the next critical deadline. */
  deadline: string;
  status: ApplicationStatus;
  notes?: string;
};

const statusLabel: Record<ApplicationStatus, string> = {
  draft: "지원 준비",
  applied: "서류 제출",
  interview: "면접",
  evaluation: "평가 대기",
  result: "결과 대기",
};

/** Mock data — replaces with Supabase query in S20. */
const MOCK_APPS: readonly Application[] = [
  {
    id: "a1",
    company: "토스",
    role: "Backend Engineer",
    deadline: addDaysISO(2),
    status: "interview",
    notes: "면접 준비 — coaching 모드 활용",
  },
  {
    id: "a2",
    company: "네이버",
    role: "Frontend Engineer",
    deadline: addDaysISO(5),
    status: "applied",
  },
  {
    id: "a3",
    company: "카카오",
    role: "Platform Engineer",
    deadline: addDaysISO(10),
    status: "draft",
    notes: "자소서 초안 필요",
  },
  {
    id: "a4",
    company: "당근",
    role: "Infra Engineer",
    deadline: addDaysISO(20),
    status: "draft",
  },
];

function addDaysISO(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

function daysUntil(iso: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(iso);
  target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

type TabKey = "today" | "week" | "all";

const tabs: readonly { key: TabKey; label: string }[] = [
  { key: "today", label: "오늘" },
  { key: "week", label: "이번 주" },
  { key: "all", label: "전체" },
];

export default function TodoPage() {
  const palette = stages.todo;
  const [tab, setTab] = useState<TabKey>("week");

  const filtered = useMemo(() => {
    return MOCK_APPS.filter((a) => {
      const days = daysUntil(a.deadline);
      if (tab === "today") return days === 0;
      if (tab === "week") return days >= 0 && days <= 7;
      return true;
    }).sort((a, b) => daysUntil(a.deadline) - daysUntil(b.deadline));
  }, [tab]);

  const counts = useMemo(() => {
    const today = MOCK_APPS.filter((a) => daysUntil(a.deadline) === 0).length;
    const week = MOCK_APPS.filter((a) => {
      const d = daysUntil(a.deadline);
      return d >= 0 && d <= 7;
    }).length;
    return { today, week, all: MOCK_APPS.length };
  }, []);

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <Breadcrumb category={null} current={stageLabels.todo.ko} />

      <header
        className="mt-6 flex flex-col gap-4 border-l-4 pl-4 sm:flex-row sm:items-center sm:justify-between sm:border-l-0 sm:pl-0"
        style={{ borderColor: palette["500"] }}
      >
        <div>
          <p className="font-mono text-[11px] uppercase tracking-widest" style={{ color: palette["700"] }}>
            todo · {stageLabels.todo.en}
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">
            {stageLabels.todo.ko}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-stage-resume-700">
            {stageTagline.todo}
          </p>
        </div>
        <Button variant="primary">
          + 채용 공고 추가
        </Button>
      </header>

      <div role="tablist" aria-label="기간 필터" className="mt-8 flex gap-2 border-b border-black/10">
        {tabs.map((t) => {
          const active = tab === t.key;
          const count = counts[t.key];
          return (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setTab(t.key)}
              className="-mb-px border-b-2 px-4 py-2 text-sm font-medium transition-colors motion-reduce:transition-none"
              style={{
                borderColor: active ? palette["700"] : "transparent",
                color: active ? palette["900"] : undefined,
              }}
            >
              {t.label}
              <span className="ml-1.5 font-mono text-[10px] opacity-70">{count}</span>
            </button>
          );
        })}
      </div>

      <section className="mt-6 space-y-3">
        {filtered.length === 0 ? (
          <Card>
            <p className="text-sm text-stage-resume-700">
              {tab === "today" && "오늘 마감인 공고가 없습니다."}
              {tab === "week" && "이번 주 마감 공고가 없습니다."}
              {tab === "all" && "등록된 공고가 없습니다. + 버튼으로 추가해 보세요."}
            </p>
          </Card>
        ) : (
          filtered.map((app) => {
            const days = daysUntil(app.deadline);
            const urgent = days <= 3;
            return (
              <Card key={app.id} interactive href="#">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-base font-semibold leading-tight">
                        {app.company} · {app.role}
                      </p>
                      <Tag stage="todo">{statusLabel[app.status]}</Tag>
                    </div>
                    {app.notes && (
                      <p className="mt-1 text-sm text-stage-resume-700">{app.notes}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p
                      className="font-mono text-xs uppercase tracking-widest"
                      style={{ color: urgent ? palette["900"] : palette["700"] }}
                    >
                      {urgent ? "마감 임박" : "마감"}
                    </p>
                    <p
                      className="mt-0.5 text-lg font-semibold"
                      style={{ color: urgent ? palette["900"] : "inherit" }}
                    >
                      D{days >= 0 ? "-" : "+"}{Math.abs(days)}
                    </p>
                    <p className="font-mono text-[10px] text-stage-resume-700">
                      {app.deadline}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </section>

      <p className="mt-10 text-center font-mono text-[11px] uppercase tracking-widest text-stage-resume-700">
        S20 에서 Supabase + 캘린더 동기화 + 알람으로 연결됩니다
      </p>
    </main>
  );
}
