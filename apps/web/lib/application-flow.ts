/**
 * Lightweight phase machine for an application — drives the dynamic
 * checklist on the /todo detail panel. Real state lives in Supabase
 * once S20 ships; this is the local prototype.
 */

export type Phase =
  | "draft"
  | "applied"
  | "screening_passed"
  | "interview_1"
  | "interview_1_passed"
  | "interview_2"
  | "interview_2_passed"
  | "offered"
  | "accepted"
  | "rejected";

export const phaseLabel: Record<Phase, string> = {
  draft: "지원 준비",
  applied: "서류 제출",
  screening_passed: "서류 합격",
  interview_1: "1차 면접",
  interview_1_passed: "1차 합격",
  interview_2: "2차 면접",
  interview_2_passed: "2차 합격",
  offered: "오퍼 받음",
  accepted: "수락",
  rejected: "탈락",
};

export type ChecklistTemplate = {
  /** Plain title shown on a checkbox row. */
  title: string;
  /** Optional internal link (deep-link to other stages). */
  href?: string;
};

export type PhaseSpec = {
  /** Phases that can follow this one. UI surfaces these as "다음 단계" actions. */
  next: readonly Phase[];
  /** Checklist seeds for *this* phase. Toggling done is purely UI state. */
  checklist: readonly ChecklistTemplate[];
};

export const phaseSpec: Record<Phase, PhaseSpec> = {
  draft: {
    next: ["applied"],
    checklist: [
      { title: "회사·직무 정보 정리 (사이트 · 최근 launch · 인터뷰 후기)" },
      { title: "이력서 ATS-tuned 버전 만들기", href: "/resume" },
      { title: "자소서 reframe (회사 톤에 맞춰)", href: "/essay" },
      { title: "포트폴리오에서 회사 직무와 닿는 항목 강조", href: "/portfolio" },
      { title: "마감일 캘린더 등록" },
    ],
  },
  applied: {
    next: ["screening_passed", "rejected"],
    checklist: [
      { title: "지원 확인 메일 보관" },
      { title: "결과 발표 예상일 메모" },
    ],
  },
  screening_passed: {
    next: ["interview_1"],
    checklist: [
      { title: "면접 일정 확정 + 캘린더" },
      { title: "모의 면접 코칭 1회", href: "/interview-coaching" },
      { title: "예상 압박 질문 5개 답안 정리" },
      { title: "회사 product 최근 release 한 줄 요약" },
    ],
  },
  interview_1: {
    next: ["interview_1_passed", "rejected"],
    checklist: [
      { title: "면접 직후 회고 — 어떤 질문에 막혔는지", href: "/memory" },
      { title: "후속 질문에 대한 추가 자료 제출" },
    ],
  },
  interview_1_passed: {
    next: ["interview_2"],
    checklist: [
      { title: "1차 답변 평가", href: "/interview-evaluation" },
      { title: "2차 면접 일정 확정" },
      { title: "시스템 디자인 / 컬처핏 등 다음 라운드 유형 파악" },
    ],
  },
  interview_2: {
    next: ["interview_2_passed", "rejected"],
    checklist: [
      { title: "2차 면접 직후 회고", href: "/memory" },
      { title: "리퍼러스 / 추가 자료 요청 대응" },
    ],
  },
  interview_2_passed: {
    next: ["offered"],
    checklist: [
      { title: "오퍼 받기까지 예상 일정 메모" },
      { title: "협상 시뮬레이션 사전 준비", href: "/salary" },
    ],
  },
  offered: {
    next: ["accepted", "rejected"],
    checklist: [
      { title: "협상 카운터 시나리오 작성", href: "/salary" },
      { title: "다른 회사 진행 상황 비교" },
      { title: "수락 마감일 확인" },
    ],
  },
  accepted: {
    next: [],
    checklist: [
      { title: "사이닝 보너스 · 사인 일정 확정" },
      { title: "퇴사 일정 협의 (기존 회사 있는 경우)" },
      { title: "자기 회고 — 무엇이 통했나", href: "/memory" },
    ],
  },
  rejected: {
    next: [],
    checklist: [
      { title: "회고 — 어디서 막혔나", href: "/memory" },
      { title: "이번 사이클의 자료 (자소서·면접 답변) 메모리에 보관" },
    ],
  },
};

export type Milestone = {
  phase: Phase;
  /** ISO date when this phase started. */
  enteredAt: string;
};

/** Default seed milestones for the existing mock applications. */
export type ApplicationDetail = {
  id: string;
  currentPhase: Phase;
  milestones: readonly Milestone[];
  /** Per-checklist-item done flags, keyed by `${phase}:${index}`. */
  checked: Record<string, boolean>;
};
