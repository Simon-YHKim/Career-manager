import type { HTMLAttributes } from "react";
import { stages, type StageKey } from "@career/design-tokens";
import { cn } from "@/lib/utils";

type TagVariant = "filled" | "outline";

export type TagProps = HTMLAttributes<HTMLSpanElement> & {
  /** Stage key whose palette tints the tag. Defaults to neutral resume hue. */
  stage?: StageKey;
  variant?: TagVariant;
};

export function Tag({
  stage = "resume",
  variant = "filled",
  className,
  style,
  children,
  ...rest
}: TagProps) {
  const palette = stages[stage];
  const inlineStyle =
    variant === "filled"
      ? { backgroundColor: palette["100"], color: palette["900"], ...style }
      : { borderColor: palette["500"], color: palette["900"], ...style };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest",
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
