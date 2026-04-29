import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "ghost" | "destructive";
type Size = "sm" | "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

const baseClasses =
  "inline-flex items-center justify-center font-medium rounded-md " +
  "transition-colors focus-visible:outline-none focus-visible:ring-2 " +
  "focus-visible:ring-stage-resume-700 focus-visible:ring-offset-2 " +
  "disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:transition-none";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-stage-resume-900 text-stage-resume-50 hover:bg-stage-resume-700 active:bg-stage-resume-700",
  ghost:
    "border border-stage-resume-100 bg-white text-stage-resume-900 hover:border-stage-resume-700 hover:bg-stage-resume-50",
  destructive:
    "bg-stage-salary-700 text-stage-salary-50 hover:bg-stage-salary-900",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-5 text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button({ className, variant = "primary", size = "md", type = "button", ...rest }, ref) {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)}
        {...rest}
      />
    );
  },
);
