"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Calendar } from "@/components/Calendar";
import {
  daysUntil,
  MOCK_APPS,
  statusLabel,
  type Application,
} from "@/lib/mock-applications";
import {
  MOCK_PERSONAL_TASKS,
  type PersonalTask,
} from "@/lib/personal-tasks";
import {
  phaseSpec,
  type Phase,
} from "@/lib/application-flow";
import { categories, stageSlug } from "@/lib/stages-config";

type AppCheckMap = Record<string, Record<string, boolean>>;

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

/**
 * Dashboard — shown to authenticated users. Designed to fit a desktop
 * viewport without scrolling (md: layout). On mobile it stacks naturally.
 *
 * Composition:
 *   ┌─ 4 quick buttons (Q&A · 블로그 · 리멤버 · LinkedIn) ─┐
 *   ├─ Left: D-day list (click → inline app checklist)  | Right: Calendar
 *   ├─ Left: 내 할 일 (개인 task)                         |
 *   └─ Bottom: 3 category links (기반 · 자료 · 면접)
 */
export function Dashboard() {
  const top3Apps = useMemo(
    () =>
      [...MOCK_APPS]
        .sort((a, b) => daysUntil(a.deadline) - daysUntil(b.deadline))
        .slice(0, 3),
    [],
  );

  const [expandedApp, setExpandedApp] = useState<string | null>(null);
  const [appChecks, setAppChecks] = useState<AppCheckMap>({});
  const [taskDone, setTaskDone] = useState<Record<string, boolean>>({});

  function toggleAppCheck(appId: string, key: string) {
    setAppChecks((prev) => ({
      ...prev,
      [appId]: {
        ...(prev[appId] ?? {}),
        [key]: !(prev[appId]?.[key] ?? false),
      },
    }));
  }

  const calendarMarkers = useMemo(() => {
    const out: Record<string, "deadline" | "task" | "both"> = {};
    MOCK_APPS.forEach((a) => {
      out[a.deadline] = "deadline";
    });
    MOCK_PERSONAL_TASKS.forEach((t) => {
      out[t.due] = out[t.due] === "deadline" ? "both" : "task";
    });
    return out;
  }, []);

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-4">
      <QuickButtons />

      <section className="grid gap-4 md:grid-cols-[1fr_1.4fr]">
        <div className="flex flex-col gap-4">
          <DDayPanel
            apps={top3Apps}
            expanded={expandedApp}
            onExpand={setExpandedApp}
            checks={appChecks}
            onToggle={toggleAppCheck}
          />
          <PersonalTasksPanel
            tasks={MOCK_PERSONAL_TASKS}
            done={taskDone}
            onToggle={(id) =>
              setTaskDone((prev) => ({ ...prev, [id]: !prev[id] }))
            }
          />
        </div>

        <Calendar markers={calendarMarkers} />
      </section>

      <section
        aria-label="카테고리"
        className="grid gap-3 sm:grid-cols-3"
      >
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/#${cat.id}`}
            className="flex h-16 flex-col justify-between rounded-xl border border-stage-resume-100 bg-white p-3 transition-colors hover:border-stage-resume-700 motion-reduce:transition-none"
          >
            <p className="font-mono text-[10px] uppercase tracking-widest text-stage-resume-500">
              {cat.subtitle}
            </p>
            <p className="text-base font-semibold text-stage-resume-900">
              {cat.title}
            </p>
          </Link>
        ))}
      </section>

      {/* Anchor targets for /#foundation etc. */}
      <div id="foundation" />
      <div id="artifacts" />
      <div id="interview" />
    </main>
  );
}

function QuickButtons() {
  const items: readonly { href: string; label: string; sub: string }[] = [
    { href: "/help", label: "Q&A", sub: "사용 안내" },
    { href: `/${stageSlug.blog}`, label: "블로그", sub: "Blog" },
    { href: "/profile/export/remember", label: "리멤버", sub: "Remember" },
    { href: "/profile/export/linkedin", label: "LinkedIn", sub: "Profile" },
  ];

  return (
    <section
      aria-label="개인 메뉴"
      className="grid grid-cols-2 gap-3 sm:grid-cols-4"
    >
      {items.map((it) => (
        <Link
          key={it.href}
          href={it.href}
          className="flex h-14 flex-col justify-center rounded-xl border border-stage-resume-100 bg-white px-3 transition-colors hover:border-stage-resume-700 motion-reduce:transition-none"
        >
          <p className="font-mono text-[10px] uppercase tracking-widest text-stage-resume-500">
            {it.sub}
          </p>
          <p className="text-sm font-semibold text-stage-resume-900">
            {it.label}
          </p>
        </Link>
      ))}
    </section>
  );
}

function DDayPanel({
  apps,
  expanded,
  onExpand,
  checks,
  onToggle,
}: {
  apps: readonly Application[];
  expanded: string | null;
  onExpand: (id: string | null) => void;
  checks: AppCheckMap;
  onToggle: (appId: string, key: string) => void;
}) {
  return (
    <div className="rounded-2xl border border-stage-resume-100 bg-white p-4">
      <header className="mb-2 flex items-baseline justify-between">
        <p className="font-mono text-[11px] uppercase tracking-widest text-stage-resume-500">
          D-day · 채용 공고
        </p>
        <Link
          href="/todo"
          className="font-mono text-[10px] uppercase tracking-widest text-stage-resume-700 hover:text-stage-resume-900"
        >
          전체 →
        </Link>
      </header>
      <ul className="divide-y divide-stage-resume-100">
        {apps.map((a) => {
          const days = daysUntil(a.deadline);
          const urgent = days <= 3;
          const isOpen = expanded === a.id;
          const phase = STATUS_TO_PHASE[a.status];
          const checklist = phaseSpec[phase].checklist;
          const appChecks = checks[a.id] ?? {};
          return (
            <li key={a.id}>
              <button
                type="button"
                onClick={() => onExpand(isOpen ? null : a.id)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-3 py-2 text-left text-sm hover:bg-stage-resume-50"
              >
                <span className="min-w-0 flex-1 truncate font-medium text-stage-resume-900">
                  {a.company} · {a.role}
                </span>
                <span
                  className={`shrink-0 font-mono text-base font-semibold ${
                    urgent ? "text-stage-salary-700" : "text-stage-resume-900"
                  }`}
                >
                  D{days >= 0 ? "-" : "+"}
                  {Math.abs(days)}
                </span>
              </button>

              {isOpen && (
                <div className="pb-3 pl-1 pr-1">
                  <p className="mb-1.5 font-mono text-[10px] uppercase tracking-widest text-stage-resume-500">
                    {statusLabel[a.status]} · 체크리스트
                  </p>
                  <ul className="space-y-1">
                    {checklist.map((item, i) => {
                      const key = `${phase}:${i}`;
                      const done = appChecks[key] ?? false;
                      return (
                        <li
                          key={key}
                          className="flex items-start gap-2 text-sm"
                        >
                          <input
                            type="checkbox"
                            id={`${a.id}-${key}`}
                            checked={done}
                            onChange={() => onToggle(a.id, key)}
                            className="mt-1 h-4 w-4 cursor-pointer accent-stage-resume-900"
                          />
                          <label
                            htmlFor={`${a.id}-${key}`}
                            className={`flex-1 cursor-pointer ${
                              done
                                ? "text-stage-resume-500 line-through"
                                : "text-stage-resume-900"
                            }`}
                          >
                            {item.title}
                            {item.href && (
                              <Link
                                href={item.href}
                                onClick={(e) => e.stopPropagation()}
                                className="ml-2 font-mono text-[10px] uppercase tracking-widest text-stage-resume-700 underline-offset-4 hover:underline"
                              >
                                ↗ 이동
                              </Link>
                            )}
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                  <Link
                    href="/todo"
                    className="mt-2 inline-block font-mono text-[10px] uppercase tracking-widest text-stage-resume-700 underline-offset-4 hover:underline hover:text-stage-resume-900"
                  >
                    상세 · 단계 진행 →
                  </Link>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function PersonalTasksPanel({
  tasks,
  done,
  onToggle,
}: {
  tasks: readonly PersonalTask[];
  done: Record<string, boolean>;
  onToggle: (id: string) => void;
}) {
  return (
    <div className="rounded-2xl border border-stage-resume-100 bg-white p-4">
      <header className="mb-2 flex items-baseline justify-between">
        <p className="font-mono text-[11px] uppercase tracking-widest text-stage-resume-500">
          내 할 일 · 공고와 무관
        </p>
        <span className="font-mono text-[10px] uppercase tracking-widest text-stage-resume-700">
          {tasks.length}
        </span>
      </header>
      <ul className="space-y-1">
        {tasks.map((t) => {
          const days = daysUntil(t.due);
          const isDone = done[t.id] ?? t.done ?? false;
          return (
            <li key={t.id} className="flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                id={`pt-${t.id}`}
                checked={isDone}
                onChange={() => onToggle(t.id)}
                className="mt-1 h-4 w-4 cursor-pointer accent-stage-resume-900"
              />
              <label
                htmlFor={`pt-${t.id}`}
                className={`flex-1 cursor-pointer ${
                  isDone
                    ? "text-stage-resume-500 line-through"
                    : "text-stage-resume-900"
                }`}
              >
                {t.title}
                {t.href && (
                  <Link
                    href={t.href}
                    onClick={(e) => e.stopPropagation()}
                    className="ml-2 font-mono text-[10px] uppercase tracking-widest text-stage-resume-700 underline-offset-4 hover:underline"
                  >
                    ↗
                  </Link>
                )}
              </label>
              <span className="shrink-0 font-mono text-[11px] text-stage-resume-700">
                {days === 0 ? "오늘" : days > 0 ? `+${days}d` : `${days}d`}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
