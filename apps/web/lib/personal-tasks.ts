/**
 * Personal todos — the *non-application* track. Application-bound checklists
 * live inside `application-flow.ts` (per-phase templates) and surface
 * inline-expanded under each D-day row in the dashboard.
 *
 * This module covers the other half: chores and reminders that don't belong
 * to a specific posting (예: 일주일에 한 번 시장 조사, 자소서 라이브러리
 * 정리, 다음 주 면접 코칭 신청). S20 replaces this with Supabase rows.
 */

import { addDaysISO } from "@/lib/mock-applications";

export type PersonalTask = {
  id: string;
  title: string;
  /** ISO due date. */
  due: string;
  done?: boolean;
  /** Optional deep-link to a stage page. */
  href?: string;
};

export const MOCK_PERSONAL_TASKS: readonly PersonalTask[] = [
  {
    id: "pt1",
    title: "이번 주 채용 시장 동향 훑어보기",
    due: addDaysISO(0),
  },
  {
    id: "pt2",
    title: "경험 정리 — 최근 3개월 회고",
    due: addDaysISO(2),
    href: "/experience",
  },
  {
    id: "pt3",
    title: "리멤버 프로필 1주 1회 동기화",
    due: addDaysISO(4),
    href: "/profile/export/remember",
  },
];
