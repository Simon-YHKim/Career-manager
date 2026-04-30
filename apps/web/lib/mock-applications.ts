/**
 * Shared mock dataset — used by the landing dashboard, the /todo page,
 * and (eventually) the search/add flow. Replace with Supabase queries
 * in S20.
 */

export type ApplicationStatus =
  | "draft"
  | "applied"
  | "screening"
  | "interview"
  | "evaluation"
  | "result"
  | "offered"
  | "accepted"
  | "rejected";

export const statusLabel: Record<ApplicationStatus, string> = {
  draft: "지원 준비",
  applied: "서류 제출",
  screening: "서류 심사",
  interview: "면접",
  evaluation: "평가 대기",
  result: "결과 대기",
  offered: "오퍼 받음",
  accepted: "수락",
  rejected: "탈락",
};

export type Application = {
  id: string;
  company: string;
  role: string;
  /** ISO date — the next critical deadline. */
  deadline: string;
  status: ApplicationStatus;
  /** Optional URL to the original posting. */
  postingUrl?: string;
  notes?: string;
};

/** Today + N days as YYYY-MM-DD (local). */
export function addDaysISO(n: number, base: Date = new Date()): string {
  const d = new Date(base);
  d.setDate(d.getDate() + n);
  return toISODate(d);
}

export function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function daysUntil(iso: string, base: Date = new Date()): number {
  const today = new Date(base);
  today.setHours(0, 0, 0, 0);
  const target = new Date(iso);
  target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export const MOCK_APPS: readonly Application[] = [
  {
    id: "a1",
    company: "토스",
    role: "Backend Engineer",
    deadline: addDaysISO(2),
    status: "interview",
    postingUrl: "https://toss.im/career",
    notes: "면접 준비 — coaching 모드 활용",
  },
  {
    id: "a2",
    company: "네이버",
    role: "Frontend Engineer",
    deadline: addDaysISO(5),
    status: "applied",
    postingUrl: "https://recruit.navercorp.com",
  },
  {
    id: "a3",
    company: "카카오",
    role: "Platform Engineer",
    deadline: addDaysISO(10),
    status: "draft",
    postingUrl: "https://careers.kakao.com",
    notes: "자소서 초안 필요",
  },
  {
    id: "a4",
    company: "당근",
    role: "Infra Engineer",
    deadline: addDaysISO(20),
    status: "draft",
    postingUrl: "https://team.daangn.com/jobs",
  },
];

export type Task = {
  id: string;
  title: string;
  /** ISO due date. */
  due: string;
  /** Where the task originated — drives the deep-link target. */
  sourceSlug: string;
  sourceLabel: string;
};

export const MOCK_TASKS: readonly Task[] = [
  {
    id: "t1",
    title: "토스 자소서 마무리",
    due: addDaysISO(0),
    sourceSlug: "essay",
    sourceLabel: "자소서",
  },
  {
    id: "t2",
    title: "네이버 면접 모의",
    due: addDaysISO(1),
    sourceSlug: "interview-coaching",
    sourceLabel: "코칭",
  },
  {
    id: "t3",
    title: "포트폴리오 OG 카드 정리",
    due: addDaysISO(3),
    sourceSlug: "portfolio",
    sourceLabel: "포트폴리오",
  },
  {
    id: "t4",
    title: "카카오 1차 답변 정리",
    due: addDaysISO(6),
    sourceSlug: "interview-evaluation",
    sourceLabel: "평가",
  },
];
