import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";
import { cn } from "@/lib/utils";

type Wrapper = {
  label: string;
  hint?: ReactNode;
  error?: string | null;
  /** Render-prop receives the id to wire onto the underlying control. */
  children: (id: string) => ReactNode;
  className?: string;
};

function FieldWrapper({ label, hint, error, children, className }: Wrapper) {
  const id = useId();
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-xs font-medium text-stage-resume-900">
        {label}
      </label>
      {children(id)}
      {hint && !error && (
        <p className="text-[11px] text-stage-resume-700">{hint}</p>
      )}
      {error && (
        <p role="alert" className="text-[11px] font-medium text-stage-salary-900">
          {error}
        </p>
      )}
    </div>
  );
}

const controlBase =
  "w-full rounded-md border bg-white px-3 py-2 text-sm text-stage-resume-900 " +
  "placeholder:text-stage-resume-700/50 transition-colors " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stage-resume-700 " +
  "disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:transition-none";

function controlClass(error: string | null | undefined) {
  return cn(
    controlBase,
    error
      ? "border-stage-salary-700 focus-visible:ring-stage-salary-700"
      : "border-stage-resume-100 hover:border-stage-resume-700",
  );
}

export type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: ReactNode;
  error?: string | null;
};

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  function InputField({ label, hint, error, className, ...rest }, ref) {
    return (
      <FieldWrapper label={label} hint={hint} error={error}>
        {(id) => (
          <input
            id={id}
            ref={ref}
            aria-invalid={Boolean(error)}
            className={cn(controlClass(error), className)}
            {...rest}
          />
        )}
      </FieldWrapper>
    );
  },
);

export type TextareaFieldProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  hint?: ReactNode;
  error?: string | null;
};

export const TextareaField = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
  function TextareaField({ label, hint, error, className, rows = 4, ...rest }, ref) {
    return (
      <FieldWrapper label={label} hint={hint} error={error}>
        {(id) => (
          <textarea
            id={id}
            ref={ref}
            rows={rows}
            aria-invalid={Boolean(error)}
            className={cn(controlClass(error), "resize-y", className)}
            {...rest}
          />
        )}
      </FieldWrapper>
    );
  },
);

export type SelectFieldProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  hint?: ReactNode;
  error?: string | null;
};

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  function SelectField({ label, hint, error, className, children, ...rest }, ref) {
    return (
      <FieldWrapper label={label} hint={hint} error={error}>
        {(id) => (
          <select
            id={id}
            ref={ref}
            aria-invalid={Boolean(error)}
            className={cn(controlClass(error), "pr-8", className)}
            {...rest}
          >
            {children}
          </select>
        )}
      </FieldWrapper>
    );
  },
);
