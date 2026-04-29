import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { stageBySlug, stageLabels, stageSlug, stageTagline } from "@/lib/stages-config";
import { StagePage } from "@/components/StagePage";

export function generateStaticParams() {
  return Object.values(stageSlug).map((slug) => ({ stage: slug }));
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
