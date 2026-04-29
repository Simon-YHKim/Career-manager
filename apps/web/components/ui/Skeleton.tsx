import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Props = HTMLAttributes<HTMLDivElement> & {
  /** "line" gives a typographic-height block; "block" inherits height from caller. */
  variant?: "line" | "block";
};

export function Skeleton({ variant = "line", className, ...rest }: Props) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(
        "animate-pulse rounded bg-stage-resume-100 motion-reduce:animate-none",
        variant === "line" && "h-3",
        className,
      )}
      {...rest}
    />
  );
}
