"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Modal } from "@/components/ui/Modal";
import { Button, Tag } from "@/components/ui";
import {
  phaseLabel,
  phaseSpec,
  type ApplicationDetail,
  type Phase,
} from "@/lib/application-flow";
import {
  daysUntil,
  toISODate,
  type Application,
} from "@/lib/mock-applications";

type Props = {
  app: Application | null;
  detail: ApplicationDetail | null;
  open: boolean;
  onClose: () => void;
  onAdvance: (next: Phase, date: string) => void;
  onToggleCheck: (key: string) => void;
};

export function ApplicationDetailModal({
  app,
  detail,
  open,
  onClose,
  onAdvance,
  onToggleCheck,
}: Props) {
  const [advanceDate, setAdvanceDate] = useState<string>(toISODate(new Date()));

  const spec = useMemo(() => {
    if (!detail) return null;
    return phaseSpec[detail.currentPhase];
  }, [detail]);

  if (!app || !detail || !spec) return null;

  const days = daysUntil(app.deadline);
  const urgent = days <= 3;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`${app.company} · ${app.role}`}
      description={`현재 단계: ${phaseLabel[detail.currentPhase]}`}
      className="max-w-xl"
    >
      <div className="space-y-5">
        {/* Meta strip */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <Tag>{phaseLabel[detail.currentPhase]}</Tag>
          {app.postingUrl && (
            <a
              href={app.postingUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-stage-resume-100 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-stage-resume-700 hover:border-stage-resume-700 hover:text-stage-resume-900"
            >
              ↗ 공고 링크
            </a>
          )}
          <span
            className={`font-mono text-xs ${
              urgent ? "text-stage-salary-700" : "text-stage-resume-700"
            }`}
          >
            마감 {urgent && "임박 "}D{days >= 0 ? "-" : "+"}
            {Math.abs(days)} ({app.deadline})
          </span>
        </div>

        {/* Checklist for current phase */}
        <section>
          <p className="mb-2 font-mono text-[11px] uppercase tracking-widest text-stage-resume-500">
            {phaseLabel[detail.currentPhase]} 체크리스트
          </p>
          <ul className="space-y-1.5">
            {spec.checklist.map((item, i) => {
              const key = `${detail.currentPhase}:${i}`;
              const done = detail.checked[key] ?? false;
              return (
                <li
                  key={key}
                  className="flex items-start gap-2 rounded-md p-2 hover:bg-stage-resume-50"
                >
                  <input
                    type="checkbox"
                    id={key}
                    checked={done}
                    onChange={() => onToggleCheck(key)}
                    className="mt-1 h-4 w-4 cursor-pointer accent-stage-resume-900"
                  />
                  <label
                    htmlFor={key}
                    className={`flex-1 cursor-pointer text-sm ${
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
        </section>

        {/* Advance to next phase */}
        {spec.next.length > 0 && (
          <section className="rounded-lg border border-stage-resume-100 bg-stage-resume-50 p-3">
            <p className="font-mono text-[11px] uppercase tracking-widest text-stage-resume-500">
              다음 단계
            </p>
            <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-end">
              <label className="flex flex-col gap-1 text-xs">
                <span className="font-medium text-stage-resume-900">발생일</span>
                <input
                  type="date"
                  value={advanceDate}
                  onChange={(e) => setAdvanceDate(e.target.value)}
                  className="rounded-md border border-stage-resume-100 bg-white px-3 py-1.5 text-sm focus-visible:border-stage-resume-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stage-resume-700"
                />
              </label>
              <div className="flex flex-wrap gap-2 sm:ml-auto">
                {spec.next.map((next) => (
                  <Button
                    key={next}
                    variant={next === "rejected" ? "destructive" : "primary"}
                    size="sm"
                    onClick={() => onAdvance(next, advanceDate)}
                  >
                    → {phaseLabel[next]}
                  </Button>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* History */}
        <section>
          <p className="mb-2 font-mono text-[11px] uppercase tracking-widest text-stage-resume-500">
            진행 기록
          </p>
          <ol className="space-y-1.5 text-sm">
            {detail.milestones.map((m, i) => (
              <li
                key={i}
                className="flex items-baseline justify-between gap-2 border-l-2 border-stage-resume-100 pl-3"
              >
                <span className="text-stage-resume-900">{phaseLabel[m.phase]}</span>
                <span className="font-mono text-xs text-stage-resume-700">
                  {m.enteredAt}
                </span>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </Modal>
  );
}
