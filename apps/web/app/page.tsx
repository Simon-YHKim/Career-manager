"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Dashboard } from "@/components/Dashboard";
import { MarketingLanding } from "@/components/MarketingLanding";
import { Skeleton } from "@/components/ui";

/**
 * Root route — branches by auth state, plus a `?demo=1` escape hatch
 * that lets unauthenticated visitors preview the dashboard. Useful for
 * shareable URLs before Supabase is wired up.
 */
export default function Home() {
  return (
    <Suspense fallback={<HomeSkeleton />}>
      <HomeInner />
    </Suspense>
  );
}

function HomeInner() {
  const { state } = useAuth();
  const params = useSearchParams();
  const demo = params.get("demo") === "1";

  if (state.status === "loading") {
    return <HomeSkeleton />;
  }

  if (demo || state.status === "authenticated") {
    return <Dashboard demo={demo && state.status !== "authenticated"} />;
  }

  return <MarketingLanding />;
}

function HomeSkeleton() {
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
