"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[error.tsx]", error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col items-start justify-center gap-4 px-6">
      <h1 className="text-2xl font-semibold">문제가 발생했습니다</h1>
      <p className="text-sm text-neutral-600 dark:text-neutral-300">
        예상치 못한 오류로 페이지를 표시할 수 없습니다. 잠시 후 다시 시도해 주세요.
      </p>
      {error.digest && (
        <p className="font-mono text-xs text-neutral-500">digest: {error.digest}</p>
      )}
      <button
        type="button"
        onClick={reset}
        className="mt-2 rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-900"
      >
        다시 시도
      </button>
    </main>
  );
}
