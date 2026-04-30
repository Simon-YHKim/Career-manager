import Link from "next/link";
import { stageLabels, type StageKey } from "@career/design-tokens";
import {
  categories,
  GRID_CLASSES,
  quickAccess,
  stageSlug,
  type QuickAccessDef,
} from "@/lib/stages-config";

function CategoryCard({ stageKey }: { stageKey: StageKey }) {
  const label = stageLabels[stageKey];
  return (
    <Link
      href={`/${stageSlug[stageKey]}`}
      className="flex h-28 flex-col justify-between rounded-xl border border-stage-resume-100 bg-white p-4 transition-colors hover:border-stage-resume-700 motion-reduce:transition-none"
    >
      <p className="font-mono text-[10px] uppercase tracking-widest text-stage-resume-500">
        {stageKey}
      </p>
      <div>
        <p className="text-base font-semibold leading-tight text-stage-resume-900">
          {label.ko}
        </p>
        <p className="text-[11px] text-stage-resume-700">{label.en}</p>
      </div>
    </Link>
  );
}

function QuickAccessCard({ def }: { def: QuickAccessDef }) {
  return (
    <Link
      href={`/${stageSlug[def.stageKey]}`}
      className="group flex h-full flex-col gap-3 rounded-2xl border border-stage-resume-100 bg-white p-5 transition-colors hover:border-stage-resume-700 motion-reduce:transition-none"
    >
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-lg font-semibold tracking-tight text-stage-resume-900">
          {def.title}
        </h3>
        <span className="rounded-full border border-stage-resume-100 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-stage-resume-700">
          {def.tagline}
        </span>
      </div>
      <p className="text-sm leading-relaxed text-stage-resume-700">
        {def.description}
      </p>
    </Link>
  );
}

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <header className="mb-10">
        <p className="mb-2 font-mono text-xs uppercase tracking-widest text-stage-resume-700">
          Sprint 1 · Foundation
        </p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Career Manager
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-stage-resume-700 sm:text-base">
          한국·영미권 통합 커리어 플랫폼. 빠른 접근 두 기능을 위에,
          사용자 여정을 3 단계로 묶어 정리했습니다.
        </p>
      </header>

      <section className="mb-12" aria-label="Quick access">
        <div className="grid gap-4 sm:grid-cols-2">
          {quickAccess.map((qa) => (
            <QuickAccessCard key={qa.stageKey} def={qa} />
          ))}
        </div>
      </section>

      {categories.map((cat) => {
        const n = cat.stages.length as 2 | 3 | 4;
        return (
          <section key={cat.id} id={cat.id} className="mb-10">
            <header className="mb-4 flex items-baseline gap-3">
              <h2 className="text-xl font-semibold tracking-tight text-stage-resume-900">
                {cat.title}
              </h2>
              <span className="font-mono text-[11px] uppercase tracking-widest text-stage-resume-500">
                {cat.subtitle}
              </span>
            </header>
            <p className="mb-4 max-w-2xl text-sm text-stage-resume-700">
              {cat.description}
            </p>
            <div className={`grid gap-3 ${GRID_CLASSES[n]}`}>
              {cat.stages.map((stageKey) => (
                <CategoryCard key={stageKey} stageKey={stageKey} />
              ))}
            </div>
          </section>
        );
      })}

      <footer className="mt-16 border-t border-stage-resume-100 pt-6 font-mono text-xs uppercase tracking-widest text-stage-resume-500">
        Next.js 15 · Tailwind v4 · Pretendard · @career/design-tokens
      </footer>
    </main>
  );
}
