import { z } from "zod";

/**
 * Document type discriminator. Every user-owned artifact is stored as a
 * Document row in Postgres with a JSONB body narrowed by `type`.
 *
 * Spec: v1 §1.2.
 */
export const DocumentType = z.enum([
  "career_profile",
  "experience_atom",
  "career_description",
  "cover_letter",
  "resume",
  "mock_interview",
  "negotiation_sim",
  "portfolio",
  "application",
  "company_research",
  "jd_analysis",
  "memo",
  "schedule",
]);
export type DocumentType = z.infer<typeof DocumentType>;

export const KillerClass = z.enum(["필살기", "빌살기", "밉살기", "unknown"]);
export type KillerClass = z.infer<typeof KillerClass>;

export const EngineId = z.enum(["G", "S", "L", "AB", "AD"]);
export type EngineId = z.infer<typeof EngineId>;

export const EvaluationMode = z.enum(["coaching", "evaluation"]);
export type EvaluationMode = z.infer<typeof EvaluationMode>;

/**
 * Common fields for every Document. `body` is type-narrowed in
 * downstream schemas; this base only validates the envelope.
 */
export const DocumentBase = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  project_id: z.string().uuid().nullable(),
  type: DocumentType,
  title: z.string().min(1).max(200),
  body: z.unknown(),
  schema_version: z.string().min(1),
  tags: z.array(z.string()).default([]),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  deleted_at: z.string().datetime().nullable().default(null),
  killer_class: KillerClass.default("unknown"),
  engine_used: EngineId.optional(),
  evaluation_mode: EvaluationMode.optional(),
  content_hash: z.string().min(1),
  blob_ref: z.string().nullable().default(null),
});
export type DocumentBase = z.infer<typeof DocumentBase>;
