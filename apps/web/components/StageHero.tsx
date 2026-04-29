import { stages, type StageKey } from "@career/design-tokens";
import { categoryOf, stageLabels, stageTagline } from "@/lib/stages-config";
import { Breadcrumb } from "@/components/Breadcrumb";
import type { ReactNode } from "react";

/**
 * Reusable header for dedicated stage pages — anchors color from the
 * containing category, places breadcrumb above, optional action slot
 * on the right.
 */
export function StageHero({
  stageKey,
  action,
}: {
  stageKey: StageKey;
  action?: ReactNode;
}) {
  const cat = categoryOf(stageKey);
  const palette = stages[cat?.anchor ?? stageKey];
  const label = stageLabels[stageKey];

  return (
    <>
      <Breadcrumb category={cat} current={label.ko} />
      <header
        className="mt-6 flex flex-col gap-4 border-l-4 pl-4 sm:flex-row sm:items-start sm:justify-between sm:border-l-0 sm:pl-0"
        style={{ borderColor: palette["500"] }}
      >
        <div>
          <p
            className="font-mono text-[11px] uppercase tracking-widest"
            style={{ color: palette["700"] }}
          >
            {stageKey} · {label.en}
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">
            {label.ko}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-stage-resume-700">
            {stageTagline[stageKey]}
          </p>
        </div>
        {action}
      </header>
    </>
  );
}
