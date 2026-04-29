"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Skeleton } from "@/components/ui";

/**
 * Auth widget rendered top-right by AppHeader. Has 4 visual states:
 *  - loading       → skeleton (env set, session check in flight)
 *  - unconfigured  → "로그인 · S2" disabled stub (no env vars)
 *  - anonymous     → "로그인" link to /auth/signin
 *  - authenticated → email + 로그아웃
 */
export function AuthMenu() {
  const { state, signOut } = useAuth();

  if (state.status === "loading") {
    return <Skeleton variant="block" className="h-8 w-20 rounded-md" />;
  }

  if (state.status === "unconfigured") {
    return (
      <button
        type="button"
        aria-label="로그인 (S2 wiring 대기)"
        disabled
        className="cursor-not-allowed rounded-md border border-black/10 px-3 py-1.5 text-xs font-medium text-stage-resume-700 opacity-60"
      >
        로그인 · S2
      </button>
    );
  }

  if (state.status === "anonymous") {
    return (
      <Link
        href="/auth/signin"
        className="rounded-md border border-stage-resume-100 bg-white px-3 py-1.5 text-xs font-medium text-stage-resume-900 hover:border-stage-resume-700"
      >
        로그인
      </Link>
    );
  }

  // authenticated
  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-[11px] text-stage-resume-700">
        {state.user.email}
      </span>
      <button
        type="button"
        onClick={() => void signOut()}
        className="rounded-md border border-stage-resume-100 bg-white px-3 py-1.5 text-xs font-medium text-stage-resume-900 hover:border-stage-resume-700"
      >
        로그아웃
      </button>
    </div>
  );
}
