import { stages, stageLabels, type StageKey } from "@career/design-tokens";

type Props = {
  stageKey: StageKey;
};

/**
 * Renders one of the 12 stages as a swatch card. Used on the landing page
 * to verify Web ↔ Android token parity at a glance.
 */
export function StageCard({ stageKey }: Props) {
  const palette = stages[stageKey];
  const label = stageLabels[stageKey];
  return (
    <div className="overflow-hidden rounded-xl border border-black/10 shadow-sm">
      <div
        className="flex h-24 items-end p-3"
        style={{ backgroundColor: palette["500"] }}
      >
        <span
          className="rounded-md bg-white/85 px-2 py-1 text-xs font-medium"
          style={{ color: palette["900"] }}
        >
          {label.ko}
        </span>
      </div>
      <div className="flex">
        {(["50", "100", "500", "700", "900"] as const).map((shade) => (
          <div
            key={shade}
            className="flex h-10 flex-1 items-center justify-center text-[10px]"
            style={{
              backgroundColor: palette[shade],
              color: shade === "50" || shade === "100" ? "#0b0f17" : "#ffffff",
            }}
          >
            {shade}
          </div>
        ))}
      </div>
    </div>
  );
}
