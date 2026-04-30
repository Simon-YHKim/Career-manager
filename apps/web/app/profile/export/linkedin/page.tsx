"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import {
  Button,
  Card,
  InputField,
  TextareaField,
  useToast,
} from "@/components/ui";
import {
  EMPTY_LINKEDIN,
  LINKEDIN_EMPLOYMENT_TYPES,
  LINKEDIN_LOCATION_TYPES,
  linkedinAboutText,
  linkedinEducationText,
  linkedinExperienceText,
  loadLinkedin,
  saveLinkedin,
  type LinkedinCertification,
  type LinkedinEducation,
  type LinkedinExperience,
  type LinkedinProfile,
} from "@/lib/profile-export";

/**
 * LinkedIn 셀프 작성 + 클립보드 export.
 *
 * LinkedIn Profile API 는 third-party 에 매우 제한적이라 자동 동기화가
 * 불투명. 1차 출시는 영문 섹션 단위 복사. AI 자동 작성은 후속 sprint
 * (docs/specs/profile-export-pipeline.md).
 *
 * Field set 은 LinkedIn Help Center + 공개 프로필 편집기 (2026-04 기준)
 * 에서 추출. About 2600 chars · Headline 220 · Experience description
 * 2000 등 LinkedIn 의 실제 제한을 그대로 hint 로 노출합니다.
 */
export default function LinkedinExportPage() {
  const { show } = useToast();
  const [profile, setProfile] = useState<LinkedinProfile>(EMPTY_LINKEDIN);
  const [hydrated, setHydrated] = useState(false);
  const [skillDraft, setSkillDraft] = useState("");
  const [websiteDraft, setWebsiteDraft] = useState("");

  useEffect(() => {
    setProfile(loadLinkedin());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveLinkedin(profile);
  }, [profile, hydrated]);

  const requiredCount = useMemo(() => {
    const need = [
      !!profile.firstName,
      !!profile.lastName,
      !!profile.headline,
      !!profile.country,
      !!profile.industry,
      !!profile.about,
      profile.experiences.length >= 1,
      profile.educations.length >= 1,
      profile.skills.length >= 1,
    ];
    return { filled: need.filter(Boolean).length, total: need.length };
  }, [profile]);

  function update<K extends keyof LinkedinProfile>(k: K, v: LinkedinProfile[K]) {
    setProfile((p) => ({ ...p, [k]: v }));
  }

  async function copy(text: string, label: string) {
    if (!text.trim()) {
      show({ kind: "info", message: `${label} is empty.` });
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      show({ kind: "success", message: `${label} copied.` });
    } catch {
      show({ kind: "error", message: "Copy failed — please select manually." });
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <Breadcrumb category={null} current="LinkedIn · 프로필 작성" />
      <header className="mt-6 border-l-2 border-stage-resume-900 pl-4">
        <p className="font-mono text-[11px] uppercase tracking-widest text-stage-resume-700">
          profile · linkedin
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">
          LinkedIn 프로필 작성
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-stage-resume-700">
          LinkedIn 의 실제 입력 양식 (Top intro · About · Experience · Education
          · Skills · Certifications) 을 영문으로 채우고, 섹션별로 복사해서
          linkedin.com 에 붙여넣습니다. 자동 동기화는 API 제약상 보류 상태.
        </p>
        <p className="mt-3 inline-flex items-center gap-2 rounded-md border border-stage-resume-100 bg-stage-resume-50 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-stage-resume-700">
          required {requiredCount.filled} / {requiredCount.total} · auto-saved
        </p>
      </header>

      {/* Top intro */}
      <Section
        title="Top intro"
        subtitle="identity card"
        onCopy={() =>
          copy(
            [
              `${profile.firstName} ${profile.lastName}`.trim(),
              profile.headline,
              [profile.city, profile.country].filter(Boolean).join(", "),
              profile.industry,
              ...profile.websites,
            ]
              .filter(Boolean)
              .join("\n"),
            "Top intro",
          )
        }
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <InputField
            label="First name * (≤ 20)"
            value={profile.firstName}
            maxLength={20}
            onChange={(e) => update("firstName", e.target.value)}
            placeholder="Hong"
          />
          <InputField
            label="Last name * (≤ 40)"
            value={profile.lastName}
            maxLength={40}
            onChange={(e) => update("lastName", e.target.value)}
            placeholder="Gildong"
          />
          <InputField
            label="Pronouns"
            value={profile.pronouns}
            onChange={(e) => update("pronouns", e.target.value)}
            placeholder="He/Him · She/Her · They/Them"
          />
          <InputField
            label="Industry *"
            value={profile.industry}
            onChange={(e) => update("industry", e.target.value)}
            placeholder="Financial Services / Software"
          />
          <InputField
            label="Country *"
            value={profile.country}
            onChange={(e) => update("country", e.target.value)}
            placeholder="South Korea"
          />
          <InputField
            label="City"
            value={profile.city}
            onChange={(e) => update("city", e.target.value)}
            placeholder="Seoul"
          />
        </div>
        <InputField
          label="Headline * (≤ 220)"
          maxLength={220}
          value={profile.headline}
          onChange={(e) => update("headline", e.target.value)}
          placeholder="Backend Engineer · Payments — building reliable APIs at Toss"
          hint={`${profile.headline.length}/220`}
        />
        <InputField
          label="Custom profile URL"
          value={profile.customProfileUrl}
          onChange={(e) => update("customProfileUrl", e.target.value)}
          placeholder="linkedin.com/in/your-handle"
        />
        <div>
          <p className="text-xs font-medium text-stage-resume-900">
            Websites (up to 3)
          </p>
          <TagInput
            tags={profile.websites}
            draft={websiteDraft}
            onDraftChange={setWebsiteDraft}
            onAdd={(t) => {
              if (profile.websites.length >= 3) return;
              update("websites", [...profile.websites, t]);
            }}
            onRemove={(i) =>
              update(
                "websites",
                profile.websites.filter((_, idx) => idx !== i),
              )
            }
            placeholder="https://github.com/me (Enter or comma)"
          />
        </div>
      </Section>

      {/* About */}
      <Section
        title="About"
        subtitle="≤ 2,600 chars"
        onCopy={() => copy(linkedinAboutText(profile), "About")}
      >
        <TextareaField
          label="About"
          rows={8}
          maxLength={2600}
          value={profile.about}
          onChange={(e) => update("about", e.target.value)}
          placeholder="I build payments infrastructure that survives Black Friday traffic spikes..."
          hint={`${profile.about.length}/2600`}
        />
      </Section>

      {/* Experience */}
      <Section
        title="Experience"
        subtitle="≥ 1 role required"
        onCopy={() => copy(linkedinExperienceText(profile), "Experience")}
      >
        <ExperienceList
          items={profile.experiences}
          onChange={(items) => update("experiences", items)}
        />
      </Section>

      {/* Education */}
      <Section
        title="Education"
        subtitle="≥ 1 school required"
        onCopy={() => copy(linkedinEducationText(profile), "Education")}
      >
        <EducationList
          items={profile.educations}
          onChange={(items) => update("educations", items)}
        />
      </Section>

      {/* Skills */}
      <Section
        title="Skills"
        subtitle="up to 50 · ≤ 80 chars each"
        onCopy={() => copy(profile.skills.join("\n"), "Skills")}
      >
        <TagInput
          tags={profile.skills}
          draft={skillDraft}
          onDraftChange={setSkillDraft}
          onAdd={(t) => {
            if (profile.skills.length >= 50) return;
            update("skills", [...profile.skills, t]);
          }}
          onRemove={(i) =>
            update(
              "skills",
              profile.skills.filter((_, idx) => idx !== i),
            )
          }
          placeholder="Kotlin (Enter or comma)"
        />
      </Section>

      {/* Certifications */}
      <Section title="Licenses & Certifications" subtitle="optional">
        <CertificationList
          items={profile.certifications}
          onChange={(items) => update("certifications", items)}
        />
      </Section>

      <section className="mt-10 rounded-2xl border border-stage-resume-100 bg-stage-resume-50 p-5 text-sm text-stage-resume-700">
        <p className="font-mono text-[11px] uppercase tracking-widest text-stage-resume-500">
          후속 단계 · roadmap
        </p>
        <p className="mt-2">
          AI 모듈 합류 후 (S?+) 본인의 ‘경험’ · 영문 reframe 데이터로 위
          섹션을 자동 작성합니다. LinkedIn API 자동 동기화는 third-party
          제약상 검토 단계 — docs/specs/profile-export-pipeline.md 참고.
        </p>
        <Link
          href="/help"
          className="mt-3 inline-block font-mono text-[10px] uppercase tracking-widest text-stage-resume-700 underline-offset-4 hover:underline hover:text-stage-resume-900"
        >
          ↗ Q&amp;A: 외부 연동
        </Link>
      </section>

      <p className="mt-10 text-center font-mono text-[11px] uppercase tracking-widest text-stage-resume-700">
        S?: LinkedIn OAuth 검토 — 가능 시 자동 동기화 전환
      </p>
    </main>
  );
}

// ── Section wrapper ─────────────────────────────────────────────────────────

function Section({
  title,
  subtitle,
  onCopy,
  children,
}: {
  title: string;
  subtitle: string;
  onCopy?: () => void;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-6">
      <Card className="space-y-4">
        <div className="flex items-baseline justify-between gap-2">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-widest text-stage-resume-500">
              {subtitle}
            </p>
            <h2 className="mt-0.5 text-base font-semibold text-stage-resume-900">
              {title}
            </h2>
          </div>
          {onCopy && (
            <Button size="sm" variant="ghost" onClick={onCopy}>
              Copy
            </Button>
          )}
        </div>
        {children}
      </Card>
    </section>
  );
}

// ── Repeatable groups ───────────────────────────────────────────────────────

function ExperienceList({
  items,
  onChange,
}: {
  items: LinkedinExperience[];
  onChange: (next: LinkedinExperience[]) => void;
}) {
  function add() {
    onChange([
      ...items,
      {
        title: "",
        employmentType: "",
        company: "",
        isCurrent: false,
        startDate: "",
        endDate: "",
        location: "",
        locationType: "",
        description: "",
        skills: [],
      },
    ]);
  }
  function update(i: number, patch: Partial<LinkedinExperience>) {
    onChange(items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  }
  function remove(i: number) {
    onChange(items.filter((_, idx) => idx !== i));
  }

  return (
    <div className="space-y-3">
      {items.map((e, i) => (
        <div
          key={i}
          className="rounded-xl border border-stage-resume-100 bg-stage-resume-50 p-3"
        >
          <div className="grid gap-2 sm:grid-cols-2">
            <InputField
              label="Title *"
              maxLength={100}
              value={e.title}
              onChange={(ev) => update(i, { title: ev.target.value })}
            />
            <InputField
              label="Company *"
              maxLength={100}
              value={e.company}
              onChange={(ev) => update(i, { company: ev.target.value })}
            />
            <label className="flex flex-col gap-1 text-xs">
              <span className="font-medium text-stage-resume-900">
                Employment type
              </span>
              <select
                value={e.employmentType}
                onChange={(ev) =>
                  update(i, { employmentType: ev.target.value })
                }
                className="rounded-md border border-stage-resume-100 bg-white px-3 py-2 text-sm focus-visible:border-stage-resume-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stage-resume-700"
              >
                <option value="">—</option>
                {LINKEDIN_EMPLOYMENT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-xs">
              <span className="font-medium text-stage-resume-900">
                Location type
              </span>
              <select
                value={e.locationType}
                onChange={(ev) => update(i, { locationType: ev.target.value })}
                className="rounded-md border border-stage-resume-100 bg-white px-3 py-2 text-sm focus-visible:border-stage-resume-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stage-resume-700"
              >
                <option value="">—</option>
                {LINKEDIN_LOCATION_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>
            <InputField
              label="Location"
              value={e.location}
              onChange={(ev) => update(i, { location: ev.target.value })}
              placeholder="Seoul · Remote"
            />
            <div className="flex items-end gap-2">
              <InputField
                label="Start (YYYY-MM)"
                value={e.startDate}
                onChange={(ev) => update(i, { startDate: ev.target.value })}
                placeholder="2022-03"
              />
              <InputField
                label={e.isCurrent ? "Present" : "End (YYYY-MM)"}
                value={e.isCurrent ? "" : e.endDate}
                onChange={(ev) => update(i, { endDate: ev.target.value })}
                placeholder="2025-12"
                disabled={e.isCurrent}
              />
            </div>
          </div>
          <label className="mt-2 flex items-center gap-2 text-xs text-stage-resume-700">
            <input
              type="checkbox"
              checked={e.isCurrent}
              onChange={(ev) => update(i, { isCurrent: ev.target.checked })}
              className="h-4 w-4 accent-stage-resume-900"
            />
            I currently work here
          </label>
          <TextareaField
            label="Description (≤ 2,000)"
            rows={4}
            maxLength={2000}
            value={e.description}
            onChange={(ev) => update(i, { description: ev.target.value })}
            placeholder="• Led payment gateway migration..."
            className="mt-2"
            hint={`${e.description.length}/2000`}
          />
          <div className="mt-2 text-right">
            <Button size="sm" variant="ghost" onClick={() => remove(i)}>
              Remove
            </Button>
          </div>
        </div>
      ))}
      <Button size="sm" variant="ghost" onClick={add}>
        + Add experience
      </Button>
    </div>
  );
}

function EducationList({
  items,
  onChange,
}: {
  items: LinkedinEducation[];
  onChange: (next: LinkedinEducation[]) => void;
}) {
  function add() {
    onChange([
      ...items,
      {
        school: "",
        degree: "",
        fieldOfStudy: "",
        startYear: "",
        endYear: "",
        grade: "",
        activities: "",
        description: "",
      },
    ]);
  }
  function update(i: number, patch: Partial<LinkedinEducation>) {
    onChange(items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  }
  function remove(i: number) {
    onChange(items.filter((_, idx) => idx !== i));
  }

  return (
    <div className="space-y-3">
      {items.map((e, i) => (
        <div
          key={i}
          className="rounded-xl border border-stage-resume-100 bg-stage-resume-50 p-3"
        >
          <div className="grid gap-2 sm:grid-cols-2">
            <InputField
              label="School *"
              value={e.school}
              onChange={(ev) => update(i, { school: ev.target.value })}
            />
            <InputField
              label="Degree"
              value={e.degree}
              onChange={(ev) => update(i, { degree: ev.target.value })}
              placeholder="BSc · MBA"
            />
            <InputField
              label="Field of study"
              value={e.fieldOfStudy}
              onChange={(ev) => update(i, { fieldOfStudy: ev.target.value })}
            />
            <InputField
              label="Grade"
              value={e.grade}
              onChange={(ev) => update(i, { grade: ev.target.value })}
              placeholder="3.7 / GPA / Distinction"
            />
            <div className="flex gap-2">
              <InputField
                label="Start"
                value={e.startYear}
                onChange={(ev) => update(i, { startYear: ev.target.value })}
                placeholder="2018"
              />
              <InputField
                label="End"
                value={e.endYear}
                onChange={(ev) => update(i, { endYear: ev.target.value })}
                placeholder="2022"
              />
            </div>
          </div>
          <TextareaField
            label="Activities (≤ 500)"
            rows={2}
            maxLength={500}
            value={e.activities}
            onChange={(ev) => update(i, { activities: ev.target.value })}
            className="mt-2"
          />
          <TextareaField
            label="Description (≤ 1,000)"
            rows={2}
            maxLength={1000}
            value={e.description}
            onChange={(ev) => update(i, { description: ev.target.value })}
            className="mt-2"
          />
          <div className="mt-2 text-right">
            <Button size="sm" variant="ghost" onClick={() => remove(i)}>
              Remove
            </Button>
          </div>
        </div>
      ))}
      <Button size="sm" variant="ghost" onClick={add}>
        + Add education
      </Button>
    </div>
  );
}

function CertificationList({
  items,
  onChange,
}: {
  items: LinkedinCertification[];
  onChange: (next: LinkedinCertification[]) => void;
}) {
  function add() {
    onChange([
      ...items,
      {
        name: "",
        issuer: "",
        issueDate: "",
        expirationDate: "",
        doesNotExpire: false,
        credentialId: "",
        credentialUrl: "",
      },
    ]);
  }
  function update(i: number, patch: Partial<LinkedinCertification>) {
    onChange(items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  }
  function remove(i: number) {
    onChange(items.filter((_, idx) => idx !== i));
  }
  return (
    <div className="space-y-3">
      {items.map((c, i) => (
        <div
          key={i}
          className="rounded-xl border border-stage-resume-100 bg-stage-resume-50 p-3"
        >
          <div className="grid gap-2 sm:grid-cols-2">
            <InputField
              label="Name *"
              maxLength={255}
              value={c.name}
              onChange={(ev) => update(i, { name: ev.target.value })}
            />
            <InputField
              label="Issuer *"
              maxLength={100}
              value={c.issuer}
              onChange={(ev) => update(i, { issuer: ev.target.value })}
            />
            <InputField
              label="Issue date (YYYY-MM)"
              value={c.issueDate}
              onChange={(ev) => update(i, { issueDate: ev.target.value })}
            />
            <InputField
              label={c.doesNotExpire ? "No expiration" : "Expiration (YYYY-MM)"}
              value={c.doesNotExpire ? "" : c.expirationDate}
              onChange={(ev) => update(i, { expirationDate: ev.target.value })}
              disabled={c.doesNotExpire}
            />
            <InputField
              label="Credential ID"
              value={c.credentialId}
              onChange={(ev) => update(i, { credentialId: ev.target.value })}
            />
            <InputField
              label="Credential URL"
              value={c.credentialUrl}
              onChange={(ev) => update(i, { credentialUrl: ev.target.value })}
            />
          </div>
          <label className="mt-2 flex items-center gap-2 text-xs text-stage-resume-700">
            <input
              type="checkbox"
              checked={c.doesNotExpire}
              onChange={(ev) => update(i, { doesNotExpire: ev.target.checked })}
              className="h-4 w-4 accent-stage-resume-900"
            />
            This credential does not expire
          </label>
          <div className="mt-2 text-right">
            <Button size="sm" variant="ghost" onClick={() => remove(i)}>
              Remove
            </Button>
          </div>
        </div>
      ))}
      <Button size="sm" variant="ghost" onClick={add}>
        + Add certification
      </Button>
    </div>
  );
}

// ── Tag input ───────────────────────────────────────────────────────────────

function TagInput({
  tags,
  draft,
  onDraftChange,
  onAdd,
  onRemove,
  placeholder,
}: {
  tags: string[];
  draft: string;
  onDraftChange: (v: string) => void;
  onAdd: (tag: string) => void;
  onRemove: (i: number) => void;
  placeholder?: string;
}) {
  function commit() {
    const t = draft.trim();
    if (!t) return;
    if (tags.includes(t)) {
      onDraftChange("");
      return;
    }
    onAdd(t);
    onDraftChange("");
  }
  return (
    <div>
      <div className="flex flex-wrap gap-1.5">
        {tags.map((t, i) => (
          <span
            key={`${t}-${i}`}
            className="inline-flex items-center gap-1 rounded-full border border-stage-resume-100 bg-white px-2 py-0.5 text-xs text-stage-resume-900"
          >
            {t}
            <button
              type="button"
              onClick={() => onRemove(i)}
              className="text-stage-resume-500 hover:text-stage-resume-900"
              aria-label={`remove ${t}`}
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <input
        type="text"
        value={draft}
        onChange={(e) => onDraftChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            commit();
          }
        }}
        onBlur={commit}
        placeholder={placeholder}
        className="mt-2 w-full rounded-md border border-stage-resume-100 bg-white px-3 py-2 text-sm focus-visible:border-stage-resume-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stage-resume-700"
      />
    </div>
  );
}
