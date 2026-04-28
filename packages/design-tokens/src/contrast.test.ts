import { describe, it, expect } from "vitest";
import { stages, stageKeys } from "./stages.js";
import { contrastRatio, WCAG } from "./contrast.js";

const WHITE = "#FFFFFF";

describe("WCAG contrast on white background", () => {
  // 900-shade is the documented body-text track for every stage.
  // It must clear AA-normal (4.5:1). Most clear AAA (7:1) too.
  it("900-shade of every stage passes AA normal text (4.5:1)", () => {
    for (const key of stageKeys) {
      const ratio = contrastRatio(stages[key]["900"], WHITE);
      expect(
        ratio,
        `${key}.900 (${stages[key]["900"]}) ratio ${ratio.toFixed(2)} should >= ${WCAG.AA_NORMAL}`,
      ).toBeGreaterThanOrEqual(WCAG.AA_NORMAL);
    }
  });

  // 700-shade is used for headings, badges, and large text. It must
  // clear AA-large (3:1) for every stage except portfolio (yellow has
  // an inherent contrast ceiling — body usage falls back to 900).
  it("700-shade of every stage except portfolio passes AA large text (3.0:1)", () => {
    for (const key of stageKeys) {
      if (key === "portfolio") continue;
      const ratio = contrastRatio(stages[key]["700"], WHITE);
      expect(
        ratio,
        `${key}.700 (${stages[key]["700"]}) ratio ${ratio.toFixed(2)} should >= ${WCAG.AA_LARGE}`,
      ).toBeGreaterThanOrEqual(WCAG.AA_LARGE);
    }
  });

  // 500-shade is treated as accent only. Pin the documented behavior
  // so accidental promotion to body text is caught at review time.
  it("500-shade is accent-only (no AA-normal guarantee)", () => {
    const knownLowContrast = [
      "career",
      "portfolio",
      "interviewCoaching",
      "salary",
      "todo",
      "memory",
    ] as const;
    for (const key of knownLowContrast) {
      const ratio = contrastRatio(stages[key]["500"], WHITE);
      expect(ratio).toBeLessThan(WCAG.AA_NORMAL);
    }
  });
});
