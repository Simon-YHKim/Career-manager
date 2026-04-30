/**
 * Schemas + localStorage helpers for the Remember / LinkedIn self-fill
 * export pages. Mirrors the field set researched 2026-04 (see
 * docs/specs/profile-export-pipeline.md).
 *
 * 저장 규칙: 단순 JSON, 사용자 본인 브라우저에 한정. Supabase 합류 시
 * 동일 shape 으로 마이그레이션 (각 키를 row 로).
 */

const REMEMBER_KEY = "cm:profile-export:remember:v1";
const LINKEDIN_KEY = "cm:profile-export:linkedin:v1";

// ── Remember ────────────────────────────────────────────────────────────────

export type RememberExperience = {
  company: string;
  department: string;
  title: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
};

export type RememberEducation = {
  school: string;
  major: string;
  degree: string;
  startYear: string;
  endYear: string;
};

export type RememberCertification = {
  name: string;
  issuer: string;
  date: string;
};

export type RememberAward = {
  title: string;
  date: string;
  description: string;
};

export type RememberLanguage = {
  language: string;
  proficiency: string;
};

export type RememberProfile = {
  // 기본 정보
  name: string;
  currentCompany: string;
  department: string;
  title: string;
  jobFunction: string;
  // 한 줄 소개 + 자기소개
  summary: string;
  totalYears: string;
  // 반복 섹션
  experiences: RememberExperience[];
  educations: RememberEducation[];
  skills: string[];
  certifications: RememberCertification[];
  awards: RememberAward[];
  languages: RememberLanguage[];
  // 링크 / 연락처
  links: string[];
  email: string;
  phone: string;
};

export const EMPTY_REMEMBER: RememberProfile = {
  name: "",
  currentCompany: "",
  department: "",
  title: "",
  jobFunction: "",
  summary: "",
  totalYears: "",
  experiences: [],
  educations: [],
  skills: [],
  certifications: [],
  awards: [],
  languages: [],
  links: [],
  email: "",
  phone: "",
};

export const REMEMBER_JOB_FUNCTIONS: readonly string[] = [
  "개발",
  "기획·전략",
  "마케팅",
  "영업·세일즈",
  "디자인",
  "데이터·분석",
  "재무·회계",
  "인사·HR",
  "운영·CS",
  "리서치",
  "교육",
  "의료",
  "법무",
  "기타",
];

// ── LinkedIn ────────────────────────────────────────────────────────────────

export type LinkedinExperience = {
  title: string;
  employmentType: string;
  company: string;
  isCurrent: boolean;
  startDate: string;
  endDate: string;
  location: string;
  locationType: string;
  description: string;
  skills: string[];
};

export type LinkedinEducation = {
  school: string;
  degree: string;
  fieldOfStudy: string;
  startYear: string;
  endYear: string;
  grade: string;
  activities: string;
  description: string;
};

export type LinkedinCertification = {
  name: string;
  issuer: string;
  issueDate: string;
  expirationDate: string;
  doesNotExpire: boolean;
  credentialId: string;
  credentialUrl: string;
};

export type LinkedinProfile = {
  // Top intro
  firstName: string;
  lastName: string;
  pronouns: string;
  headline: string;
  country: string;
  city: string;
  industry: string;
  customProfileUrl: string;
  websites: string[];
  // About (max 2600)
  about: string;
  // Repeatable
  experiences: LinkedinExperience[];
  educations: LinkedinEducation[];
  skills: string[];
  certifications: LinkedinCertification[];
};

export const EMPTY_LINKEDIN: LinkedinProfile = {
  firstName: "",
  lastName: "",
  pronouns: "",
  headline: "",
  country: "",
  city: "",
  industry: "",
  customProfileUrl: "",
  websites: [],
  about: "",
  experiences: [],
  educations: [],
  skills: [],
  certifications: [],
};

export const LINKEDIN_EMPLOYMENT_TYPES = [
  "Full-time",
  "Part-time",
  "Self-employed",
  "Freelance",
  "Contract",
  "Internship",
  "Apprenticeship",
  "Seasonal",
] as const;

export const LINKEDIN_LOCATION_TYPES = [
  "On-site",
  "Hybrid",
  "Remote",
] as const;

// ── Storage ─────────────────────────────────────────────────────────────────

export function loadRemember(): RememberProfile {
  if (typeof window === "undefined") return EMPTY_REMEMBER;
  try {
    const raw = window.localStorage.getItem(REMEMBER_KEY);
    if (!raw) return EMPTY_REMEMBER;
    const parsed = JSON.parse(raw) as Partial<RememberProfile>;
    return { ...EMPTY_REMEMBER, ...parsed };
  } catch {
    return EMPTY_REMEMBER;
  }
}

export function saveRemember(profile: RememberProfile): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(REMEMBER_KEY, JSON.stringify(profile));
}

export function loadLinkedin(): LinkedinProfile {
  if (typeof window === "undefined") return EMPTY_LINKEDIN;
  try {
    const raw = window.localStorage.getItem(LINKEDIN_KEY);
    if (!raw) return EMPTY_LINKEDIN;
    const parsed = JSON.parse(raw) as Partial<LinkedinProfile>;
    return { ...EMPTY_LINKEDIN, ...parsed };
  } catch {
    return EMPTY_LINKEDIN;
  }
}

export function saveLinkedin(profile: LinkedinProfile): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LINKEDIN_KEY, JSON.stringify(profile));
}

// ── Render helpers ──────────────────────────────────────────────────────────

export function rememberSummaryText(p: RememberProfile): string {
  return p.summary.trim();
}

export function rememberExperienceText(p: RememberProfile): string {
  return p.experiences
    .map((e) => {
      const period = e.current
        ? `${e.startDate} - 재직중`
        : `${e.startDate} - ${e.endDate}`;
      const lines = [
        `${e.company} · ${e.title}${e.department ? ` (${e.department})` : ""}`,
        period,
        e.description,
      ].filter(Boolean);
      return lines.join("\n");
    })
    .join("\n\n");
}

export function rememberEducationText(p: RememberProfile): string {
  return p.educations
    .map(
      (e) =>
        `${e.school} · ${e.major}${e.degree ? ` (${e.degree})` : ""} · ${e.startYear} - ${e.endYear}`,
    )
    .join("\n");
}

export function rememberSkillsText(p: RememberProfile): string {
  return p.skills.join(", ");
}

export function linkedinAboutText(p: LinkedinProfile): string {
  return p.about.trim();
}

export function linkedinExperienceText(p: LinkedinProfile): string {
  return p.experiences
    .map((e) => {
      const period = e.isCurrent
        ? `${e.startDate} - Present`
        : `${e.startDate} - ${e.endDate}`;
      const meta = [e.employmentType, e.locationType, e.location]
        .filter(Boolean)
        .join(" · ");
      return [
        `${e.title} — ${e.company}`,
        period + (meta ? ` (${meta})` : ""),
        e.description,
        e.skills.length > 0 ? `Skills: ${e.skills.join(", ")}` : "",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n\n");
}

export function linkedinEducationText(p: LinkedinProfile): string {
  return p.educations
    .map((e) => {
      const head = `${e.school}${e.degree ? `, ${e.degree}` : ""}${e.fieldOfStudy ? ` in ${e.fieldOfStudy}` : ""}`;
      const period = `${e.startYear} - ${e.endYear}`;
      return [head, period, e.activities, e.description, e.grade]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n\n");
}
