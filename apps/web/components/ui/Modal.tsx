"use client";

import { useEffect, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

/**
 * Minimal modal — backdrop + centered panel. Closes on Escape or
 * backdrop click. No focus-trap library; first interactive element
 * gains focus naturally via tab order.
 */
export function Modal({ open, onClose, title, description, children, className }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <button
        type="button"
        aria-label="닫기"
        onClick={onClose}
        className="absolute inset-0 bg-stage-resume-900/40"
      />
      <div
        className={cn(
          "relative w-full max-w-md rounded-2xl border border-stage-resume-100 bg-white p-6 shadow-lg",
          className,
        )}
      >
        {(title || description) && (
          <header className="mb-4">
            {title && (
              <h2 className="text-xl font-semibold tracking-tight text-stage-resume-900">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-1 text-sm text-stage-resume-700">{description}</p>
            )}
          </header>
        )}
        {children}
        <button
          type="button"
          aria-label="닫기"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-md p-1 text-stage-resume-700 hover:bg-stage-resume-50"
        >
          ×
        </button>
      </div>
    </div>
  );
}
