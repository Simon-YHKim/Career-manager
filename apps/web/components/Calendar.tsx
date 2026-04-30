"use client";

import { useMemo } from "react";
import { toISODate } from "@/lib/mock-applications";
import { cn } from "@/lib/utils";

type Marker = "deadline" | "task" | "both";

type Props = {
  /** Reference month — uses year + month, day ignored. Defaults to today. */
  month?: Date;
  /** Map of YYYY-MM-DD → marker kind. */
  markers?: Record<string, Marker>;
  className?: string;
};

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"] as const;

export function Calendar({ month: refMonth, markers = {}, className }: Props) {
  const today = new Date();
  const ref = refMonth ?? today;

  const grid = useMemo(() => {
    const year = ref.getFullYear();
    const m = ref.getMonth();
    // Start from the Sunday of the week that contains the 1st.
    const first = new Date(year, m, 1);
    const start = new Date(first);
    start.setDate(1 - first.getDay());
    // 6 weeks × 7 days = 42 cells covers any month.
    const cells: { date: Date; iso: string; inMonth: boolean }[] = [];
    for (let i = 0; i < 42; i += 1) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      cells.push({
        date: d,
        iso: toISODate(d),
        inMonth: d.getMonth() === m,
      });
    }
    return cells;
  }, [ref]);

  const todayIso = toISODate(today);
  const monthLabel = `${ref.getFullYear()}.${`${ref.getMonth() + 1}`.padStart(2, "0")}`;

  return (
    <section
      aria-label="이번 달 캘린더"
      className={cn(
        "rounded-2xl border border-stage-resume-100 bg-white p-4",
        className,
      )}
    >
      <header className="mb-3 flex items-baseline justify-between">
        <p className="font-mono text-2xl font-semibold tracking-tight text-stage-resume-900">
          {monthLabel}
        </p>
        <p className="font-mono text-[11px] uppercase tracking-widest text-stage-resume-500">
          ● 마감 ○ 할 일
        </p>
      </header>
      <div className="grid grid-cols-7 gap-px text-center text-[11px]">
        {WEEKDAYS.map((w, i) => (
          <div
            key={w}
            className={cn(
              "py-1 font-mono uppercase tracking-widest",
              i === 0
                ? "text-stage-salary-700"
                : "text-stage-resume-500",
            )}
          >
            {w}
          </div>
        ))}
        {grid.map(({ date, iso, inMonth }) => {
          const marker = markers[iso];
          const isToday = iso === todayIso;
          const isSunday = date.getDay() === 0;
          return (
            <div
              key={iso}
              aria-current={isToday ? "date" : undefined}
              className={cn(
                "relative flex aspect-square items-start justify-end p-1.5",
                isToday && "rounded-md bg-stage-resume-900 text-white",
                !isToday && !inMonth && "text-stage-resume-100",
                !isToday && inMonth && isSunday && "text-stage-salary-700",
                !isToday && inMonth && !isSunday && "text-stage-resume-700",
              )}
            >
              <span className="font-mono text-xs leading-none">
                {date.getDate()}
              </span>
              {marker && (
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute bottom-1 left-1 h-1 w-1 rounded-full",
                    marker === "deadline"
                      ? "bg-stage-salary-700"
                      : marker === "task"
                        ? "border border-stage-resume-700"
                        : "bg-stage-resume-900",
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
