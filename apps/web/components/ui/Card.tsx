import type { HTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Common = {
  className?: string;
  children: ReactNode;
};

type StaticCard = HTMLAttributes<HTMLDivElement> &
  Common & { interactive?: false; href?: never };

type LinkCard = Common & {
  interactive: true;
  /** When provided, renders as <Link>; otherwise <button>. */
  href?: string;
  onClick?: () => void;
  ariaLabel?: string;
};

export type CardProps = StaticCard | LinkCard;

const baseClasses =
  "rounded-2xl border border-black/10 bg-white p-5 text-stage-resume-900";
const interactiveClasses =
  "block transition-colors hover:border-black/30 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stage-resume-700 focus-visible:ring-offset-2";

export function Card(props: CardProps) {
  if (props.interactive) {
    if (props.href) {
      return (
        <Link
          href={props.href}
          aria-label={props.ariaLabel}
          className={cn(baseClasses, interactiveClasses, props.className)}
        >
          {props.children}
        </Link>
      );
    }
    return (
      <button
        type="button"
        aria-label={props.ariaLabel}
        onClick={props.onClick}
        className={cn(baseClasses, interactiveClasses, "w-full text-left", props.className)}
      >
        {props.children}
      </button>
    );
  }
  const { className, children, interactive: _ignore, ...rest } = props;
  return (
    <div className={cn(baseClasses, className)} {...rest}>
      {children}
    </div>
  );
}
