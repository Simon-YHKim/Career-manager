"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { stageLabels, stageTagline } from "@/lib/stages-config";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Button, Card, Tag, useToast } from "@/components/ui";
import {
  daysUntil,
  MOCK_APPS,
  toISODate,
  type Application,
} from "@/lib/mock-applications";
import {
  phaseLabel,
  type ApplicationDetail,
  type Phase,
} from "@/lib/application-flow";
import { ApplicationDetailModal } from "@/components/ApplicationDetailModal";
import { JobAddModal } from "@/components/JobAddModal";

type TabKey = "today" | "week" | "all";

const tabs: readonly { key: TabKey; label: string }[] = [
  { key: "today", label: "오늘" },
  { key: "week", label: "이번 주" },
  { key: "all", label: "전체" },
];

const STATUS_TO_PHASE: Record<Application["status"], Phase> = {
  draft: "draft",
  applied: "applied",
  screening: "applied",
  interview: "interview_1",
  evaluation: "interview_1",
  result: "interview_1_passed",
  offered: "offered",
  accepted: "accepted",
  rejected: "rejected",
};

function seedDetails(apps: readonly Application[]): Record<string, ApplicationDetail> {
  const today = toISODate(new Date());
  const out: Record<string, ApplicationDetail> = {};
  apps.forEach((a) => {
    const phase = STATUS_TO_PHASE[a.status];
    out[a.id] = {
      id: a.id,
      currentPhase: phase,
      milestones: [{ phase, enteredAt: today }],
      checked: {},
    };
  });
  return out;
}

export default function TodoPage() {
  const { show } = useToast();
  const [tab, setTab] = useState<TabKey>("week");
  const [apps, setApps] = useState<Application[]>([...MOCK_APPS]);
  const [details, setDetails] = useState<Record<string, ApplicationDetail>>(() =>
    seedDetails(MOCK_APPS),
  );
  const [openDetailFor, setOpenDetailFor] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const filtered = useMemo(() => {
    return apps
      .filter((a) => {
        const days = daysUntil(a.deadline);
        if (tab === "today") return days === 0;
        if (tab === "week") return days >= 0 && days <= 7;
        return true;
      })
      .sort((a, b) => daysUntil(a.deadline) - daysUntil(b.deadline));
  }, [tab, apps]);

  const counts = useMemo(() => {
    const today = apps.filter((a) => daysUntil(a.deadline) === 0).length;
    const week = apps.filter((a) => {
      const d = daysUntil(a.deadline);
      return d >= 0 && d <= 7;
    }).length;
    return { today, week, all: apps.length };
  }, [apps]);

  const activeApp = openDetailFor ? apps.find((a) => a.id === openDetailFor) ?? null : null;
  const activeDetail = openDetailFor ? details[openDetailFor] ?? null : null;

  function handleAdvance(id: string, next: Phase, date: string) {
    setDetails((prev) => {
      const cur = prev[id];
      if (!cur) return prev;
      return {
        ...prev,
        [id]: {
          ...cur,
          currentPhase: next,
          milestones: [...cur.milestones, { phase: next, enteredAt: date }],
        },
      };
    });
    show({
      kind: "info",
      message: `${phaseLabel[next]} 로 진행됨 — 새 체크리스트가 펼쳐졌습니다.`,
    });
  }

  function handleToggle(id: string, key: string) {
    setDetails((prev) => {
      const cur = prev[id];
      if (!cur) return prev;
      return {
        ...prev,
        [id]: {
          ...cur,
          checked: { ...cur.checked, [key]: !cur.checked[key] },
        },
      };
    });
  }

  function handleAdd(app: Application) {
    setApps((prev) => [app, ...prev]);
    setDetails((prev) => ({
      ...prev,
      [app.id]: {
        id: app.id,
        currentPhase: "draft",
        milestones: [{ phase: "draft", enteredAt: toISODate(new Date()) }],
        checked: {},
      },
    }));
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <Breadcrumb category={null} current={stageLabels.todo.ko} />

      <header className="mt-6 flex flex-col gap-4 border-l-2 border-stage-resume-900 pl-4 sm:flex-row sm:items-center sm:justify-between sm:border-l-0 sm:pl-0">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-widest text-stage-resume-700">
            todo · {stageLabels.todo.en}
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">
            {stageLabels.todo.ko}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-stage-resume-700">
            {stageTagline.todo}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/jobs/search"
            className="inline-flex h-10 items-center rounded-md border border-stage-resume-100 bg-white px-4 text-sm font-medium text-stage-resume-900 hover:border-stage-resume-700"
          >
            검색으로 추가
          </Link>
          <Button variant="primary" onClick={() => setAddOpen(true)}>
            + 채용 공고 추가
          </Button>
        </div>
      </header>

      <div
        role="tablist"
        aria-label="기간 필터"
        className="mt-8 flex gap-2 border-b border-stage-resume-100"
      >
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
              className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium transition-colors motion-reduce:transition-none ${
                active
                  ? "border-stage-resume-900 text-stage-resume-900"
                  : "border-transparent text-stage-resume-700 hover:text-stage-resume-900"
              }`}
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
              {tab === "all" &&
                "등록된 공고가 없습니다. + 채용 공고 추가 또는 검색으로 추가."}
            </p>
          </Card>
        ) : (
          filtered.map((app) => {
            const days = daysUntil(app.deadline);
            const urgent = days <= 3;
            const detail = details[app.id];
            return (
              <Card
                key={app.id}
                interactive
                onClick={() => setOpenDetailFor(app.id)}
                className={
                  urgent ? "border-l-2 border-l-stage-salary-700" : undefined
                }
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-base font-semibold leading-tight">
                        {app.company} · {app.role}
                      </p>
                      <Tag>{detail ? phaseLabel[detail.currentPhase] : "-"}</Tag>
                    </div>
                    {app.notes && (
                      <p className="mt-1 text-sm text-stage-resume-700">
                        {app.notes}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-mono text-xs uppercase tracking-widest ${
                        urgent ? "text-stage-salary-700" : "text-stage-resume-700"
                      }`}
                    >
                      {urgent ? "마감 임박" : "마감"}
                    </p>
                    <p
                      className={`mt-0.5 text-lg font-semibold ${
                        urgent ? "text-stage-salary-700" : ""
                      }`}
                    >
                      D{days >= 0 ? "-" : "+"}
                      {Math.abs(days)}
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

      <ApplicationDetailModal
        app={activeApp}
        detail={activeDetail}
        open={openDetailFor !== null}
        onClose={() => setOpenDetailFor(null)}
        onAdvance={(next, date) => {
          if (openDetailFor) handleAdvance(openDetailFor, next, date);
        }}
        onToggleCheck={(key) => {
          if (openDetailFor) handleToggle(openDetailFor, key);
        }}
      />

      <JobAddModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onAdd={handleAdd}
      />
    </main>
  );
}

