/**
 * Tailwind plugin that exposes the 12-stage palette as
 * `theme.extend.colors.stage.<stageKey>.<shade>`.
 *
 * Usage in apps/web/tailwind.config.ts:
 *   import { stageColorsPreset } from "@career/design-tokens/tailwind";
 *   export default { presets: [stageColorsPreset], content: [...] };
 */
import { stages, type StageKey, type Shade } from "./stages.js";

type TailwindPreset = {
  theme: {
    extend: {
      colors: {
        stage: Record<StageKey, Record<Shade, string>>;
      };
    };
  };
};

export const stageColorsPreset: TailwindPreset = {
  theme: {
    extend: {
      colors: {
        stage: stages,
      },
    },
  },
};

export default stageColorsPreset;
