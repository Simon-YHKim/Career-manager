import { stages, stageLabels, type StageKey, type Shade } from "@career/design-tokens";

type QuickAccessDef = {
  stageKey: StageKey;
  title: string;
  tagline: string;
  description: string;
};

const quickAccess: readonly QuickAccessDef[] = [
  {
    stageKey: "todo",
    title: "할 일",
    tagline: "채용 일정 + 취업 준비 리마인더",
    description:
      "지원한 공고의 마감·면접·결과 발표 일정을 한 곳에서. 캘린더 · 리마인더 · 알람으로 놓치지 않게 관리합니다.",
  },
  {
    stageKey: "blog",
    title: "블로그",
    tagline: "취업에 도움되는 글",
    description:
      "이력서 · 자소서 · 면접 · 협상까지 — 실전 사례와 가이드를 읽으며 다음 단계를 준비합니다.",
  },
];

type CategoryDef = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  /** Stage whose 5-shade palette is reused as the category's hue. */
  anchor: StageKey;
  /** Stages in journey order — earliest first, deepest shade last. */
  stages: readonly StageKey[];
};

const categories: readonly CategoryDef[] = [
  {
    id: "foundation",
    title: "기반",
    subtitle: "Foundation",
    description: "자기 자신을 정리하는 단계 — 커리어 프로필 · 경험 정리 · 누적 메모리.",
    anchor: "experience",
    stages: ["profile", "experience", "memory"],
  },
  {
    id: "artifacts",
    title: "자료",
    subtitle: "Artifacts",
    description: "지원에 사용하는 문서들 — 이력서부터 포트폴리오까지.",
    anchor: "career",
    stages: ["resume", "career", "essay", "portfolio"],
  },
  {
    id: "interview",
    title: "면접",
    subtitle: "Interview",
    description: "코칭 → 평가 → 협상까지, 면접 사이클 전체.",
    anchor: "interviewCoaching",
    stages: ["interviewCoaching", "interviewEvaluation", "salary"],
  },
];

/**
 * Map "i-th stage of N within a category" to a shade. Lighter to darker.
 * Constrained to N ∈ {2, 3, 4} which covers the current 12-stage taxonomy.
 */
const SHADE_RAMP: Record<2 | 3 | 4, readonly Shade[]> = {
  2: ["500", "900"],
  3: ["100", "500", "900"],
  4: ["100", "500", "700", "900"],
};

const GRID_CLASSES: Record<2 | 3 | 4, string> = {
  2: "grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-3",
  4: "grid-cols-2 lg:grid-cols-4",
};

function CategoryCard({
  stageKey,
  anchor,
  shade,
}: {
  stageKey: StageKey;
  anchor: StageKey;
  shade: Shade;
}) {
  const palette = stages[anchor];
  const label = stageLabels[stageKey];
  const isLight = shade === "50" || shade === "100";
  return (
    <div
      className="flex h-28 flex-col justify-between rounded-xl border border-black/10 p-4"
      style={{
        backgroundColor: palette[shade],
        color: isLight ? palette["900"] : palette["50"],
      }}
    >
      <p className="font-mono text-[10px] uppercase tracking-widest opacity-70">
        {stageKey}
      </p>
      <div>
        <p className="text-base font-semibold leading-tight">{label.ko}</p>
        <p className="text-[11px] opacity-70">{label.en}</p>
      </div>
    </div>
  );
}

function QuickAccessCard({ def }: { def: QuickAccessDef }) {
  const palette = stages[def.stageKey];
  return (
    <a
      href={`#${def.stageKey}`}
      className="group flex h-full flex-col gap-3 rounded-2xl border border-black/10 bg-white p-5 transition hover:border-black/30 motion-reduce:transition-none"
    >
      <div className="flex items-baseline justify-between gap-3">
        <h3
          className="text-lg font-semibold tracking-tight"
          style={{ color: palette["900"] }}
        >
          {def.title}
        </h3>
        <span
          className="rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest"
          style={{
            backgroundColor: palette["100"],
            color: palette["900"],
          }}
        >
          {def.tagline}
        </span>
      </div>
      <p className="text-sm leading-relaxed text-stage-resume-700">
        {def.description}
      </p>
      <div
        className="mt-auto h-1 w-full rounded-full"
        style={{ backgroundColor: palette["500"] }}
        aria-hidden="true"
      />
    </a>
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
        const ramp = SHADE_RAMP[n];
        const accent = stages[cat.anchor]["700"];
        return (
          <section key={cat.id} id={cat.id} className="mb-10">
            <header className="mb-4 flex items-baseline gap-3">
              <h2 className="text-xl font-semibold tracking-tight">
                {cat.title}
              </h2>
              <span
                className="font-mono text-[11px] uppercase tracking-widest"
                style={{ color: accent }}
              >
                {cat.subtitle}
              </span>
            </header>
            <p className="mb-4 max-w-2xl text-sm text-stage-resume-700">
              {cat.description}
            </p>
            <div className={`grid gap-3 ${GRID_CLASSES[n]}`}>
              {cat.stages.map((stageKey, i) => {
                // ramp.length === cat.stages.length by construction → safe index.
                const shade = ramp[i] ?? "500";
                return (
                  <CategoryCard
                    key={stageKey}
                    stageKey={stageKey}
                    anchor={cat.anchor}
                    shade={shade}
                  />
                );
              })}
            </div>
          </section>
        );
      })}

      <footer className="mt-16 border-t border-black/10 pt-6 font-mono text-xs uppercase tracking-widest text-stage-resume-700">
        Next.js 15 · Tailwind v4 · Pretendard · @career/design-tokens
      </footer>
    </main>
  );
}
