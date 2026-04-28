/**
 * 12-stage color tokens.
 * Maps the 7 core features + 2 interview modes + 3 cross-cutting surfaces
 * (todo, memory, blog) onto a single palette tree shared by Web and Android.
 *
 * Base hues are drawn from the Okabe-Ito color-blind safe palette where
 * possible; the remaining hues are picked to preserve hue separation under
 * deuteranope/protanope simulation.
 *
 * Spec: v2 §3.3.
 */

export type StageKey =
  | "profile"
  | "experience"
  | "career"
  | "essay"
  | "resume"
  | "portfolio"
  | "interviewCoaching"
  | "interviewEvaluation"
  | "salary"
  | "todo"
  | "memory"
  | "blog";

export type Shade = "50" | "100" | "500" | "700" | "900";

export type StagePalette = Record<Shade, string>;

export const stages: Record<StageKey, StagePalette> = {
  profile: {
    "50": "#F3E5F5",
    "100": "#E1BEE7",
    "500": "#7E57C2",
    "700": "#5E35B1",
    "900": "#311B92",
  },
  experience: {
    "50": "#FFEBE2",
    "100": "#FFCBB3",
    "500": "#D55E00",
    "700": "#A14600",
    "900": "#5C2700",
  },
  career: {
    "50": "#E0F5EE",
    "100": "#A8E5CF",
    "500": "#009E73",
    "700": "#006C4E",
    "900": "#003B2A",
  },
  essay: {
    "50": "#E1F0FA",
    "100": "#B0D8F0",
    "500": "#0072B2",
    "700": "#004F7C",
    "900": "#002A43",
  },
  resume: {
    "50": "#ECEFF1",
    "100": "#CFD8DC",
    "500": "#5D6D7E",
    "700": "#37474F",
    "900": "#102027",
  },
  portfolio: {
    "50": "#FFFDE7",
    "100": "#FFF59D",
    "500": "#F0E442",
    "700": "#B8AC22",
    "900": "#605700",
  },
  interviewCoaching: {
    "50": "#E3F4FC",
    "100": "#B2E0F4",
    "500": "#56B4E9",
    "700": "#1976A1",
    "900": "#003F5E",
  },
  interviewEvaluation: {
    "50": "#E8EAEF",
    "100": "#B5BCC9",
    "500": "#1F2A3D",
    "700": "#101724",
    "900": "#05080F",
  },
  salary: {
    "50": "#FFF8E1",
    "100": "#FFE082",
    "500": "#B8860B",
    "700": "#7E5C00",
    "900": "#3D2C00",
  },
  todo: {
    "50": "#FFF4E0",
    "100": "#FFD9A8",
    "500": "#E69F00",
    "700": "#A36F00",
    "900": "#5C3F00",
  },
  memory: {
    "50": "#EDE7F6",
    "100": "#D1C4E9",
    "500": "#B39DDB",
    "700": "#7E57C2",
    "900": "#311B92",
  },
  blog: {
    "50": "#E8EAF6",
    "100": "#9FA8DA",
    "500": "#3F51B5",
    "700": "#283593",
    "900": "#0F1648",
  },
};

export const stageKeys = Object.keys(stages) as StageKey[];

export const stageLabels: Record<StageKey, { ko: string; en: string }> = {
  profile: { ko: "Career Profile", en: "Career Profile" },
  experience: { ko: "경험 정리", en: "Experience" },
  career: { ko: "경력기술서", en: "Career Description" },
  essay: { ko: "자소서", en: "Cover Letter" },
  resume: { ko: "이력서", en: "Resume" },
  portfolio: { ko: "포트폴리오", en: "Portfolio" },
  interviewCoaching: { ko: "모의면접 (코칭)", en: "Mock Interview (Coaching)" },
  interviewEvaluation: { ko: "모의면접 (평가)", en: "Mock Interview (Evaluation)" },
  salary: { ko: "연봉 협상", en: "Salary Negotiation" },
  todo: { ko: "할 일", en: "To-do" },
  memory: { ko: "메모리", en: "Memory" },
  blog: { ko: "블로그", en: "Blog" },
};
