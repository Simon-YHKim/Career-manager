import type { HTMLAttributes } from "react";
import { stages, type StageKey } from "@career/design-tokens";
import { cn } from "@/lib/utils";

type TagVariant = "filled" | "outline";

export type TagProps = HTMLAttributes<HTMLSpanElement> & {
  /**
   * Stage prop is opt-in — semantic states (danger/success/info) only.
   * Per DESIGN.md v2, default tags are neutral and don't carry hue.
   */
  stage?: StageKey;
  variant?: TagVariant;
};

const baseClass =
  "inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest";

export function Tag({
  stage,
  variant = "outline",
  className,
  style,
  children,
  ...rest
}: TagProps) {
  if (!stage) {
    // Neutral default — surface text + border only.
    const neutralClass =
      variant === "filled"
        ? "border border-stage-resume-100 bg-stage-resume-50 text-stage-resume-900"
        : "border border-stage-resume-100 bg-transparent text-stage-resume-700";
    return (
      <span className={cn(baseClass, neutralClass, className)} style={style} {...rest}>
        {children}
      </span>
    );
  }

  // Stage-tinted only when caller explicitly opts in (e.g. danger / success / info).
  const palette = stages[stage];
  const inlineStyle =
    variant === "filled"
      ? { backgroundColor: palette["100"], color: palette["900"], ...style }
      : { borderColor: palette["500"], color: palette["900"], ...style };
  return (
    <span
      className={cn(
        baseClass,
        variant === "outline" && "border bg-transparent",
        className,
      )}
      style={inlineStyle}
      {...rest}
    >
      {children}
    </span>
  );
}
