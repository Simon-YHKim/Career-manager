import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { stageBySlug, stageLabels, stageSlug, stageTagline } from "@/lib/stages-config";
import { StagePage } from "@/components/StagePage";

/**
 * Stages with their own dedicated pages — excluded from the dynamic
 * route so Next.js static-route precedence stays clean and we don't
 * generate duplicate pages.
 *
 *   todo · blog       → quick-access pages (stub-with-mock-data)
 *   profile · experience → foundation forms (S2-ready scaffolds)
 */
const DEDICATED_SLUGS = new Set<string>([
  stageSlug.todo,
  stageSlug.blog,
  stageSlug.profile,
  stageSlug.experience,
]);

export function generateStaticParams() {
  return Object.values(stageSlug)
    .filter((slug) => !DEDICATED_SLUGS.has(slug))
    .map((slug) => ({ stage: slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ stage: string }>;
}): Promise<Metadata> {
  const { stage } = await params;
  const stageKey = stageBySlug[stage];
  if (!stageKey) return {};
  const label = stageLabels[stageKey];
  return {
    title: label.ko,
    description: stageTagline[stageKey],
    openGraph: {
      title: `${label.ko} · Career Manager`,
      description: stageTagline[stageKey],
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ stage: string }>;
}) {
  const { stage } = await params;
  const stageKey = stageBySlug[stage];
  if (!stageKey) notFound();
  return <StagePage stageKey={stageKey} />;
}
