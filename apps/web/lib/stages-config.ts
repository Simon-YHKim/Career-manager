/**
 * Single source of truth for the 12-stage taxonomy + their grouping.
 * Used by:
 *  - apps/web/app/page.tsx (landing — quick access + journey categories)
 *  - apps/web/app/[stage]/page.tsx (per-stage pages, 12 routes)
 *  - apps/web/components/AppHeader.tsx (top nav)
 *  - apps/web/components/Breadcrumb.tsx
 *
 * The 12-stage tokens live in @career/design-tokens; this file adds the
 * product-side metadata (slug, category, copy) that the design-tokens
 * package intentionally doesn't ship.
 */

import { stageLabels, type StageKey, type Shade } from "@career/design-tokens";

export type CategoryId = "foundation" | "artifacts" | "interview";

export type CategoryDef = {
  id: CategoryId;
  title: string;
  subtitle: string;
  description: string;
  /** Stage whose 5-shade palette is reused as the category's hue. */
  anchor: StageKey;
  /** Stages in journey order — earliest first, deepest shade last. */
  stages: readonly StageKey[];
};

export const categories: readonly CategoryDef[] = [
  {
    id: "foundation",
    title: "기반",
    subtitle: "Foundation",
    description: "자기 자신을 정리하는 단계 — 커리어 프로필 · 경험 정리 · 누적 메모리.",
    anchor: "experience",
    stages: ["profile", "experience", "memory"],
  },
  {
    id: "artifacts",
    title: "자료",
    subtitle: "Artifacts",
    description: "지원에 사용하는 문서들 — 이력서부터 포트폴리오까지.",
    anchor: "career",
    stages: ["resume", "career", "essay", "portfolio"],
  },
  {
    id: "interview",
    title: "면접",
    subtitle: "Interview",
    description: "코칭 → 평가 → 협상까지, 면접 사이클 전체.",
    anchor: "interviewCoaching",
    stages: ["interviewCoaching", "interviewEvaluation", "salary"],
  },
] as const;

export type QuickAccessDef = {
  stageKey: StageKey;
  title: string;
  tagline: string;
  description: string;
};

export const quickAccess: readonly QuickAccessDef[] = [
  {
    stageKey: "todo",
    title: "할 일",
    tagline: "채용 일정 + 리마인더",
    description:
      "지원한 공고의 마감·면접·결과 발표 일정을 한 곳에서. 캘린더 · 리마인더 · 알람으로 놓치지 않게 관리합니다.",
  },
  {
    stageKey: "blog",
    title: "블로그",
    tagline: "취업에 도움되는 글",
    description:
      "이력서 · 자소서 · 면접 · 협상까지 — 실전 사례와 가이드를 읽으며 다음 단계를 준비합니다.",
  },
] as const;

/**
 * Stage → slug map. Slugs are stable URL fragments — kept short and
 * lowercase. Camel-cased stage keys (`interviewCoaching`) are
 * decamelised into kebab-case (`interview-coaching`).
 */
export const stageSlug: Record<StageKey, string> = {
  profile: "profile",
  experience: "experience",
  memory: "memory",
  resume: "resume",
  career: "career",
  essay: "essay",
  portfolio: "portfolio",
  interviewCoaching: "interview-coaching",
  interviewEvaluation: "interview-evaluation",
  salary: "salary",
  todo: "todo",
  blog: "blog",
};

/** Inverse map for route lookup. */
export const stageBySlug: Record<string, StageKey> = Object.fromEntries(
  Object.entries(stageSlug).map(([k, v]) => [v, k as StageKey]),
);

/** Sprint where the stage is scheduled to ship — informs the placeholder copy. */
export const stageSprint: Record<StageKey, string> = {
  profile: "S2",
  experience: "S2",
  memory: "S24",
  resume: "S6",
  career: "S6",
  essay: "S7",
  portfolio: "S8",
  interviewCoaching: "S11",
  interviewEvaluation: "S12",
  salary: "S13",
  todo: "S20",
  blog: "S17",
};

/**
 * Per-stage tagline used on the stage page hero. Mirrors stageLabels for
 * locale; expand into longer marketing copy as features land.
 */
export const stageTagline: Record<StageKey, string> = {
  profile: "한 줄 커리어 thesis 와 핵심 메타데이터.",
  experience: "프로젝트 단위로 경험을 atom 단위로 쪼개 정리합니다.",
  memory: "누적된 자기 이해 — 임베딩 기반 검색.",
  resume: "한 페이지 요약 이력서 — 핵심만 추려 보여줍니다.",
  career: "경력기술서 — 업무 단위로 깊이 있게 풀어 씁니다.",
  essay: "자기소개서 — 회사·공고에 맞춰 reframe.",
  portfolio: "결과물·증거 모음 — 링크와 설명으로 구성.",
  interviewCoaching: "모의 면접 (코칭 모드) — LLM 이 피드백을 줍니다.",
  interviewEvaluation: "모의 면접 (평가 모드) — 점수와 개선점.",
  salary: "연봉 협상 시뮬레이션 + 시장 데이터 비교.",
  todo: "채용 공고 일정 + 취업 준비 리마인더.",
  blog: "취업에 도움되는 글 — 가이드 · 사례 · 인사이트.",
};

/** Find which category a stage belongs to. Returns null for quick-access stages (todo/blog). */
export function categoryOf(stageKey: StageKey): CategoryDef | null {
  return categories.find((c) => c.stages.includes(stageKey)) ?? null;
}

/** Position within the category (0-indexed). Returns -1 for quick-access stages. */
export function positionInCategory(stageKey: StageKey): number {
  const cat = categoryOf(stageKey);
  if (!cat) return -1;
  return cat.stages.indexOf(stageKey);
}

/**
 * Map "i-th stage of N within a category" to a shade. Lighter to darker.
 * Constrained to N ∈ {2, 3, 4} which covers the current 12-stage taxonomy.
 */
export const SHADE_RAMP: Record<2 | 3 | 4, readonly Shade[]> = {
  2: ["500", "900"],
  3: ["100", "500", "900"],
  4: ["100", "500", "700", "900"],
};

export const GRID_CLASSES: Record<2 | 3 | 4, string> = {
  2: "grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-3",
  4: "grid-cols-2 lg:grid-cols-4",
};

/** Human-readable label re-export for convenience. */
export { stageLabels };
