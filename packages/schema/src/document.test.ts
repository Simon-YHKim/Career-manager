import { describe, it, expect } from "vitest";
import { DocumentBase, CareerProfileMinimal } from "./index.js";

describe("DocumentBase", () => {
  const fixture = {
    id: "11111111-1111-4111-8111-111111111111",
    user_id: "22222222-2222-4222-8222-222222222222",
    project_id: null,
    type: "cover_letter",
    title: "Naver 자소서 v1",
    body: { hello: "world" },
    schema_version: "cover_letter@0.1.0",
    created_at: "2026-04-28T00:00:00.000Z",
    updated_at: "2026-04-28T00:00:00.000Z",
    content_hash: "sha256:placeholder",
  };

  it("accepts a minimal valid document", () => {
    const parsed = DocumentBase.parse(fixture);
    expect(parsed.killer_class).toBe("unknown");
    expect(parsed.deleted_at).toBeNull();
    expect(parsed.tags).toEqual([]);
  });

  it("rejects an invalid type", () => {
    expect(() =>
      DocumentBase.parse({ ...fixture, type: "not_a_real_type" }),
    ).toThrow();
  });
});

describe("CareerProfileMinimal", () => {
  it("requires at least one language", () => {
    expect(() =>
      CareerProfileMinimal.parse({
        user_id: "22222222-2222-4222-8222-222222222222",
        persona: "A",
        languages: [],
        updated_at: "2026-04-28T00:00:00.000Z",
      }),
    ).toThrow();
  });

  it("accepts a minimal valid profile", () => {
    const profile = CareerProfileMinimal.parse({
      user_id: "22222222-2222-4222-8222-222222222222",
      persona: "C",
      languages: ["ko", "en"],
      updated_at: "2026-04-28T00:00:00.000Z",
    });
    expect(profile.persona).toBe("C");
    expect(profile.target_jobs).toEqual([]);
  });
});
