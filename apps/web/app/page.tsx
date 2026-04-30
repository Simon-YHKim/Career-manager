import Link from "next/link";
import {
  MOCK_APPS,
  MOCK_TASKS,
  daysUntil,
  statusLabel,
  type Application,
  type Task,
} from "@/lib/mock-applications";
import { categories, quickAccess, stageSlug } from "@/lib/stages-config";
import { Calendar } from "@/components/Calendar";

function todayLabel(): string {
  const d = new Date();
  return `${d.getFullYear()}.${`${d.getMonth() + 1}`.padStart(2, "0")}.${`${d.getDate()}`.padStart(2, "0")}`;
}

function topByDeadline(apps: readonly Application[], n: number): readonly Application[] {
  return [...apps].sort((a, b) => daysUntil(a.deadline) - daysUntil(b.deadline)).slice(0, n);
}

function topTasks(tasks: readonly Task[], n: number): readonly Task[] {
  return [...tasks].sort((a, b) => daysUntil(a.due) - daysUntil(b.due)).slice(0, n);
}

function buildMarkers() {
  const out: Record<string, "deadline" | "task" | "both"> = {};
  MOCK_APPS.forEach((a) => {
    out[a.deadline] = "deadline";
  });
  MOCK_TASKS.forEach((t) => {
    out[t.due] = out[t.due] === "deadline" ? "both" : "task";
  });
  return out;
}

export default function Home() {
  const top3Apps = topByDeadline(MOCK_APPS, 3);
  const top3Tasks = topTasks(MOCK_TASKS, 3);
  const markers = buildMarkers();

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-6">
      {/* Top: Today panel + Calendar */}
      <section className="grid gap-6 md:grid-cols-[1fr_2fr]">
        {/* Left — today + d-day + tasks */}
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border border-stage-resume-100 bg-white p-4">
            <p className="font-mono text-[11px] uppercase tracking-widest text-stage-resume-500">
              오늘
            </p>
            <p className="mt-1 font-mono text-2xl font-semibold tracking-tight text-stage-resume-900">
              {todayLabel()}
            </p>
          </div>

          <DDayPanel apps={top3Apps} />
          <TasksPanel tasks={top3Tasks} />
        </div>

        {/* Right — calendar */}
        <Calendar markers={markers} />
      </section>

      {/* Bottom: category nav buttons */}
      <section aria-label="카테고리" className="grid gap-3 sm:grid-cols-2 md:grid-cols-5">
        {[
          { slug: stageSlug.todo, label: "할 일", subtitle: "Todo" },
          { slug: stageSlug.blog, label: "블로그", subtitle: "Blog" },
          ...categories.map((c) => ({
            slug: `#${c.id}`,
            label: c.title,
            subtitle: c.subtitle,
          })),
        ].map((nav, i) => {
          const isHash = nav.slug.startsWith("#");
          return (
            <Link
              key={i}
              href={isHash ? `/${nav.slug}` : `/${nav.slug}`}
              className="flex h-20 flex-col justify-between rounded-xl border border-stage-resume-100 bg-white p-3 transition-colors hover:border-stage-resume-700 motion-reduce:transition-none"
            >
              <p className="font-mono text-[10px] uppercase tracking-widest text-stage-resume-500">
                {nav.subtitle}
              </p>
              <p className="text-base font-semibold text-stage-resume-900">{nav.label}</p>
            </Link>
          );
        })}
      </section>

      {/* Hidden anchor sections — clicking category buttons that hash-link
          to #foundation etc. will jump to legacy detail pages. Keep
          anchors so existing AppHeader links resolve. */}
      <div id="foundation" />
      <div id="artifacts" />
      <div id="interview" />

      {/* Quick-access shortcut block — secondary, no scroll on desktop */}
      <section aria-label="빠른 접근 설명" className="grid gap-3 sm:grid-cols-2">
        {quickAccess.map((qa) => (
          <Link
            key={qa.stageKey}
            href={`/${stageSlug[qa.stageKey]}`}
            className="rounded-xl border border-stage-resume-100 bg-white p-3 transition-colors hover:border-stage-resume-700 motion-reduce:transition-none"
          >
            <p className="text-sm font-semibold text-stage-resume-900">{qa.title}</p>
            <p className="mt-0.5 line-clamp-1 text-xs text-stage-resume-700">
              {qa.description}
            </p>
          </Link>
        ))}
      </section>
    </main>
  );
}

function DDayPanel({ apps }: { apps: readonly Application[] }) {
  return (
    <div className="rounded-2xl border border-stage-resume-100 bg-white p-4">
      <header className="mb-3 flex items-baseline justify-between">
        <p className="font-mono text-[11px] uppercase tracking-widest text-stage-resume-500">
          D-day Top 3
        </p>
        <Link
          href="/todo"
          className="font-mono text-[10px] uppercase tracking-widest text-stage-resume-700 hover:text-stage-resume-900"
        >
          전체 →
        </Link>
      </header>
      <ul className="space-y-2">
        {apps.map((a) => {
          const days = daysUntil(a.deadline);
          const urgent = days <= 3;
          return (
            <li key={a.id}>
              <Link
                href="/todo"
                className="flex items-center justify-between gap-3 rounded-md px-2 py-2 text-sm transition-colors hover:bg-stage-resume-50 motion-reduce:transition-none"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-stage-resume-900">
                    {a.company}
                  </p>
                  <p className="truncate text-xs text-stage-resume-700">
                    {a.role} · {statusLabel[a.status]}
                  </p>
                </div>
                <span
                  className={`shrink-0 font-mono text-base font-semibold ${
                    urgent ? "text-stage-salary-700" : "text-stage-resume-900"
                  }`}
                >
                  D{days >= 0 ? "-" : "+"}
                  {Math.abs(days)}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function TasksPanel({ tasks }: { tasks: readonly Task[] }) {
  return (
    <div className="rounded-2xl border border-stage-resume-100 bg-white p-4">
      <header className="mb-3 flex items-baseline justify-between">
        <p className="font-mono text-[11px] uppercase tracking-widest text-stage-resume-500">
          해야 할 일 Top 3
        </p>
        <Link
          href="/todo"
          className="font-mono text-[10px] uppercase tracking-widest text-stage-resume-700 hover:text-stage-resume-900"
        >
          전체 →
        </Link>
      </header>
      <ul className="space-y-2">
        {tasks.map((t) => {
          const days = daysUntil(t.due);
          return (
            <li key={t.id}>
              <Link
                href={`/${t.sourceSlug}`}
                className="flex items-center justify-between gap-3 rounded-md px-2 py-2 text-sm transition-colors hover:bg-stage-resume-50 motion-reduce:transition-none"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-stage-resume-900">
                    {t.title}
                  </p>
                  <p className="truncate text-xs text-stage-resume-700">
                    {t.sourceLabel}
                  </p>
                </div>
                <span className="shrink-0 font-mono text-xs text-stage-resume-700">
                  {days === 0 ? "오늘" : days > 0 ? `+${days}일` : `${days}일`}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
