"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { stages, type StageKey } from "@career/design-tokens";
import { cn } from "@/lib/utils";

type ToastKind = "success" | "error" | "info";

type Toast = {
  id: string;
  kind: ToastKind;
  message: string;
  /** auto-dismiss ms; default 4000. 0 = sticky. */
  duration?: number;
};

type ToastInput = Omit<Toast, "id">;

type Ctx = {
  show: (t: ToastInput) => void;
  dismiss: (id: string) => void;
};

const ToastContext = createContext<Ctx | null>(null);

const stageByKind: Record<ToastKind, StageKey> = {
  success: "career", // green
  error: "salary", // amber-ish; flagged red would need a new stage
  info: "interviewCoaching", // sky blue
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<readonly Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback((t: ToastInput) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setToasts((prev) => [...prev, { id, ...t }]);
  }, []);

  const ctx = useMemo<Ctx>(() => ({ show, dismiss }), [show, dismiss]);

  return (
    <ToastContext.Provider value={ctx}>
      {children}
      <ToastViewport toasts={toasts} dismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export function useToast(): Ctx {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used inside <ToastProvider>");
  }
  return ctx;
}

function ToastViewport({
  toasts,
  dismiss,
}: {
  toasts: readonly Toast[];
  dismiss: (id: string) => void;
}) {
  return (
    <div
      role="region"
      aria-live="polite"
      aria-label="알림"
      className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center px-4"
    >
      <div className="flex w-full max-w-md flex-col gap-2">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} dismiss={dismiss} />
        ))}
      </div>
    </div>
  );
}

function ToastItem({
  toast,
  dismiss,
}: {
  toast: Toast;
  dismiss: (id: string) => void;
}) {
  const palette = stages[stageByKind[toast.kind]];
  useEffect(() => {
    if (toast.duration === 0) return;
    const handle = window.setTimeout(
      () => dismiss(toast.id),
      toast.duration ?? 4000,
    );
    return () => window.clearTimeout(handle);
  }, [toast, dismiss]);
  return (
    <div
      className={cn(
        "pointer-events-auto rounded-lg border px-4 py-3 text-sm shadow-sm",
      )}
      style={{
        backgroundColor: palette["50"],
        borderColor: palette["500"],
        color: palette["900"],
      }}
    >
      {toast.message}
    </div>
  );
}
