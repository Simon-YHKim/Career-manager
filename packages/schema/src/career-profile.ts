import { z } from "zod";

/**
 * Persona codes:
 *  A = 취린이 (pre-job-seeker)
 *  B = 신입 (new grad)
 *  C = 주니어 이직자 (junior switcher)
 *  D = 시니어 (senior)
 *  E = 베테랑/임원 (executive)
 *  F = 외국계/영미권 (foreign / Western)
 */
export const Persona = z.enum(["A", "B", "C", "D", "E", "F"]);
export type Persona = z.infer<typeof Persona>;

export const Language = z.enum(["ko", "en"]);
export type Language = z.infer<typeof Language>;

export const TargetJob = z.object({
  title: z.string(),
  title_en: z.string().optional(),
  industries: z.array(z.string()).default([]),
});

export const Preferences = z.object({
  locations: z.array(z.string()).default([]),
  remote: z.enum(["onsite", "hybrid", "remote"]).optional(),
  salary_floor_krw: z.number().int().nonnegative().optional(),
  salary_floor_usd: z.number().int().nonnegative().optional(),
});

/**
 * Minimal slice of CareerProfile we hydrate at app boot. The full schema
 * (experience_atoms, star_cards, hidden_strengths, applications,
 *  negotiations, salary_data, portfolio, ats_versions) lands in later
 *  sprints alongside the features that read/write each section.
 *
 * Spec: v1 §6.2 — current sprint scope only.
 */
export const CareerProfileMinimal = z.object({
  user_id: z.string().uuid(),
  persona: Persona,
  languages: z.array(Language).min(1),
  target_jobs: z.array(TargetJob).default([]),
  preferences: Preferences.default({}),
  career_thesis: z.string().max(280).optional(),
  updated_at: z.string().datetime(),
});
export type CareerProfileMinimal = z.infer<typeof CareerProfileMinimal>;
