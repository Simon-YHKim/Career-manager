"use client";

import { useAuth } from "@/lib/auth-context";
import { Dashboard } from "@/components/Dashboard";
import { MarketingLanding } from "@/components/MarketingLanding";
import { Skeleton } from "@/components/ui";

/**
 * Root route — branches by auth state.
 *  - loading        → skeleton
 *  - unauthenticated (anonymous · unconfigured) → marketing landing
 *  - authenticated  → dashboard (D-day · personal tasks · calendar)
 *
 * `unconfigured` (Supabase env missing) shows the marketing page so the
 * GitHub Pages preview is meaningful even before secrets land.
 */
export default function Home() {
  const { state } = useAuth();

  if (state.status === "loading") {
    return (
      <main className="mx-auto max-w-5xl px-6 py-10">
        <Skeleton variant="block" className="h-12 w-1/2 rounded-md" />
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <Skeleton variant="block" className="h-32 rounded-xl" />
          <Skeleton variant="block" className="h-32 rounded-xl" />
          <Skeleton variant="block" className="h-32 rounded-xl" />
        </div>
      </main>
    );
  }

  if (state.status === "authenticated") {
    return <Dashboard />;
  }

  return <MarketingLanding />;
}
