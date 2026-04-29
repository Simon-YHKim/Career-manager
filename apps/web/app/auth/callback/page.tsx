"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Card, Skeleton } from "@/components/ui";
import { useAuth } from "@/lib/auth-context";

/**
 * OAuth + magic-link redirect target. The Supabase JS client's
 * `detectSessionInUrl` (set in lib/supabase.ts) consumes the URL
 * fragment automatically when the AuthProvider mounts; this page just
 * waits for the auth state to flip and then redirects home.
 *
 * Static-export compatible — purely client-side flow, no server route
 * handler.
 */
export default function AuthCallbackPage() {
  const router = useRouter();
  const { state } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Supabase encodes errors in the URL fragment (#error=...).
    if (typeof window !== "undefined") {
      const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
      const err = hash.get("error_description") ?? hash.get("error");
      if (err) setError(err);
    }
  }, []);

  useEffect(() => {
    if (state.status === "authenticated") {
      router.replace("/");
    }
  }, [state, router]);

  return (
    <main className="mx-auto max-w-md px-6 py-12">
      <Breadcrumb category={null} current="로그인 확인 중" />

      <Card className="mt-6 space-y-3">
        {error ? (
          <>
            <p className="text-xs font-medium uppercase tracking-widest text-stage-salary-900">
              로그인 실패
            </p>
            <p className="text-sm">{error}</p>
            <a
              href="/auth/signin/"
              className="text-sm underline-offset-4 hover:underline"
            >
              ↩ 다시 시도
            </a>
          </>
        ) : (
          <>
            <p className="text-xs font-medium uppercase tracking-widest text-stage-resume-700">
              로그인 확인 중
            </p>
            <Skeleton className="w-32" />
            <Skeleton className="w-56" />
            <Skeleton className="w-40" />
          </>
        )}
      </Card>
    </main>
  );
}
