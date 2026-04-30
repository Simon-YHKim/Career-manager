"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Skeleton } from "@/components/ui";
import { AuthModal } from "@/components/AuthModal";

/**
 * Top-right auth widget. 4 visual states:
 *  - loading        → skeleton
 *  - unconfigured   → 로그인/회원가입 link to /?demo=1 (fake-login preview)
 *  - anonymous      → 로그인/회원가입 buttons (open AuthModal)
 *  - authenticated  → email + 로그아웃
 *
 * Modal state lives here — anywhere can open it via this widget.
 */
export function AuthMenu() {
  const { state, signOut } = useAuth();
  const [open, setOpen] = useState<"signin" | "signup" | null>(null);

  if (state.status === "loading") {
    return <Skeleton variant="block" className="h-8 w-32 rounded-md" />;
  }

  if (state.status === "authenticated") {
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

  // unconfigured — Supabase env not set yet. Pretend login → demo dashboard.
  if (state.status === "unconfigured") {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/?demo=1"
          className="rounded-md border border-stage-resume-100 bg-white px-3 py-1.5 text-xs font-medium text-stage-resume-900 hover:border-stage-resume-700"
        >
          로그인
        </Link>
        <Link
          href="/?demo=1"
          className="rounded-md bg-stage-resume-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-stage-resume-700"
        >
          회원가입
        </Link>
      </div>
    );
  }

  // anonymous — Supabase configured, normal modal flow.
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => setOpen("signin")}
        className="rounded-md border border-stage-resume-100 bg-white px-3 py-1.5 text-xs font-medium text-stage-resume-900 hover:border-stage-resume-700"
      >
        로그인
      </button>
      <button
        type="button"
        onClick={() => setOpen("signup")}
        className="rounded-md bg-stage-resume-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-stage-resume-700"
      >
        회원가입
      </button>
      <AuthModal
        open={open !== null}
        onClose={() => setOpen(null)}
        initialTab={open ?? "signin"}
      />
    </div>
  );
}
