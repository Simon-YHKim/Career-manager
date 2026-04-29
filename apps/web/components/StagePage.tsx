import { stages, type StageKey } from "@career/design-tokens";
import {
  categoryOf,
  positionInCategory,
  SHADE_RAMP,
  stageLabels,
  stageSprint,
  stageTagline,
} from "@/lib/stages-config";
import { Breadcrumb } from "@/components/Breadcrumb";

/**
 * Shared per-stage page renderer. Hits 12 routes via app/[stage]/page.tsx
 * with `generateStaticParams`. Each stage shows:
 *  - breadcrumb
 *  - hero (label · title · tagline · sprint badge)
 *  - placeholder body explaining what will land in S? sprint
 *
 * Body content is intentionally minimal — features fill it in as they ship.
 */
export function StagePage({ stageKey }: { stageKey: StageKey }) {
  const label = stageLabels[stageKey];
  const tagline = stageTagline[stageKey];
  const sprint = stageSprint[stageKey];
  const cat = categoryOf(stageKey);

  // Pick the visual hue: anchor's category color if in a category;
  // otherwise (quick-access stages) use the stage's own palette.
  const anchor = cat?.anchor ?? stageKey;
  const palette = stages[anchor];

  // Within-category position → shade for the hero accent; quick-access
  // stages always use 500.
  let accentShade: keyof typeof palette = "500";
  if (cat) {
    const pos = positionInCategory(stageKey);
    const ramp = SHADE_RAMP[cat.stages.length as 2 | 3 | 4];
    accentShade = ramp[pos] ?? "500";
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <Breadcrumb category={cat} current={label.ko} />

      <header className="mt-6 border-l-4 pl-4" style={{ borderColor: palette[accentShade] }}>
        <p className="font-mono text-[11px] uppercase tracking-widest" style={{ color: palette["700"] }}>
          {stageKey} · {label.en}
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">
          {label.ko}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-stage-resume-700 sm:text-base">
          {tagline}
        </p>
      </header>

      <section className="mt-10 rounded-2xl border border-dashed border-black/15 bg-white p-6">
        <p className="font-mono text-[11px] uppercase tracking-widest text-stage-resume-700">
          Sprint placeholder
        </p>
        <p className="mt-2 text-sm leading-relaxed text-stage-resume-900">
          이 화면은 <span className="font-semibold">{sprint}</span> 에서
          기능이 들어올 자리입니다. 현재는 라우트와 시각 토큰만 잡혀
          있어, 사용자 여정 전체 모양을 미리 확인할 수 있습니다.
        </p>
      </section>

      <footer className="mt-12 font-mono text-xs uppercase tracking-widest text-stage-resume-700">
        ↩ <a href="/" className="underline-offset-4 hover:underline">Home</a>
      </footer>
    </main>
  );
}
