"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Button, Card, InputField, TextareaField, useToast } from "@/components/ui";
import {
  EMPTY_REMEMBER,
  REMEMBER_JOB_FUNCTIONS,
  loadRemember,
  rememberEducationText,
  rememberExperienceText,
  rememberSkillsText,
  rememberSummaryText,
  saveRemember,
  type RememberAward,
  type RememberCertification,
  type RememberEducation,
  type RememberExperience,
  type RememberLanguage,
  type RememberProfile,
} from "@/lib/profile-export";

/**
 * 리멤버 (Remember) 프로필 셀프 작성 + 클립보드 export.
 *
 * 자동 동기화 (OAuth) 는 협의 단계라 1차 출시는 셀프 작성 + 섹션별 복사.
 * AI 자동 작성은 후속 sprint 에 사용자 ‘경험’ 데이터를 기반으로 합류
 * (docs/specs/profile-export-pipeline.md 참고).
 *
 * 필드 set 은 리멤버 커리어 프로필 도움말 + 스카웃 TIP 글에서 추출
 * (2026-04 기준). 자기소개 ≥ 50자 가 검색 노출 최소 조건.
 */
export default function RememberExportPage() {
  const { show } = useToast();
  const [profile, setProfile] = useState<RememberProfile>(EMPTY_REMEMBER);
  const [hydrated, setHydrated] = useState(false);
  const [skillDraft, setSkillDraft] = useState("");
  const [linkDraft, setLinkDraft] = useState("");

  useEffect(() => {
    setProfile(loadRemember());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveRemember(profile);
  }, [profile, hydrated]);

  const summaryOk = profile.summary.trim().length >= 50;

  const requiredCount = useMemo(() => {
    const need = [
      !!profile.name,
      !!profile.currentCompany,
      !!profile.title,
      !!profile.jobFunction,
      summaryOk,
      !!profile.totalYears,
      profile.experiences.length >= 1,
      profile.educations.length >= 1,
      profile.skills.length >= 1,
    ];
    return { filled: need.filter(Boolean).length, total: need.length };
  }, [profile, summaryOk]);

  function update<K extends keyof RememberProfile>(k: K, v: RememberProfile[K]) {
    setProfile((p) => ({ ...p, [k]: v }));
  }

  async function copy(text: string, label: string) {
    if (!text.trim()) {
      show({ kind: "info", message: `${label} 내용이 비어 있습니다.` });
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      show({ kind: "success", message: `${label} 복사됨.` });
    } catch {
      show({ kind: "error", message: "복사 실패 — 직접 선택해 복사해주세요." });
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <Breadcrumb category={null} current="리멤버 · 프로필 작성" />
      <header className="mt-6 border-l-2 border-stage-resume-900 pl-4">
        <p className="font-mono text-[11px] uppercase tracking-widest text-stage-resume-700">
          profile · remember
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">
          리멤버 프로필 작성
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-stage-resume-700">
          리멤버 커리어 프로필 양식에 맞춰 채워두면, 섹션별로 한 번에 복사해서
          앱에 붙여넣을 수 있습니다. 자동 동기화는 OAuth 협의 후 합류합니다.
        </p>
        <p className="mt-3 inline-flex items-center gap-2 rounded-md border border-stage-resume-100 bg-stage-resume-50 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-stage-resume-700">
          필수 입력 {requiredCount.filled} / {requiredCount.total} · 자동 저장됨
        </p>
      </header>

      {/* 기본 정보 */}
      <Section title="기본 정보" subtitle="basic">
        <div className="grid gap-3 sm:grid-cols-2">
          <InputField
            label="이름 *"
            value={profile.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="홍길동"
          />
          <InputField
            label="현재 회사 *"
            value={profile.currentCompany}
            onChange={(e) => update("currentCompany", e.target.value)}
            placeholder="토스"
          />
          <InputField
            label="부서"
            value={profile.department}
            onChange={(e) => update("department", e.target.value)}
            placeholder="결제 플랫폼"
          />
          <InputField
            label="직책 *"
            value={profile.title}
            onChange={(e) => update("title", e.target.value)}
            placeholder="Backend Engineer"
          />
          <label className="flex flex-col gap-1 text-xs">
            <span className="font-medium text-stage-resume-900">직무 *</span>
            <select
              value={profile.jobFunction}
              onChange={(e) => update("jobFunction", e.target.value)}
              className="rounded-md border border-stage-resume-100 bg-white px-3 py-2 text-sm focus-visible:border-stage-resume-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stage-resume-700"
            >
              <option value="">선택</option>
              {REMEMBER_JOB_FUNCTIONS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </label>
          <InputField
            label="총 경력연수 *"
            type="number"
            value={profile.totalYears}
            onChange={(e) => update("totalYears", e.target.value)}
            placeholder="6"
          />
        </div>
      </Section>

      {/* 자기소개 */}
      <Section
        title="자기소개"
        subtitle="summary · ≥ 50자"
        onCopy={() => copy(rememberSummaryText(profile), "자기소개")}
      >
        <TextareaField
          label="자기소개 (한 줄로 시작 + 본문)"
          rows={5}
          value={profile.summary}
          onChange={(e) => update("summary", e.target.value)}
          placeholder="결제 도메인 6년 — 토스 / 카카오페이 시장 비교 인사이트 보유. 일 거래 12M 건 처리 백엔드 운영 경험..."
          hint={
            summaryOk
              ? `${profile.summary.length}자 — 검색 노출 조건 충족`
              : `현재 ${profile.summary.length}자 — 50자 이상 권장 (스카웃 노출 조건)`
          }
        />
      </Section>

      {/* 경력 사항 */}
      <Section
        title="경력 사항"
        subtitle="experiences · 최소 1건"
        onCopy={() => copy(rememberExperienceText(profile), "경력")}
      >
        <ExperienceList
          items={profile.experiences}
          onChange={(items) => update("experiences", items)}
        />
      </Section>

      {/* 학력 */}
      <Section
        title="학력"
        subtitle="educations · 최소 1건"
        onCopy={() => copy(rememberEducationText(profile), "학력")}
      >
        <EducationList
          items={profile.educations}
          onChange={(items) => update("educations", items)}
        />
      </Section>

      {/* 스킬 */}
      <Section
        title="전문분야 / 스킬"
        subtitle="skills · 인접 키워드 함께"
        onCopy={() => copy(rememberSkillsText(profile), "스킬")}
      >
        <TagInput
          tags={profile.skills}
          draft={skillDraft}
          onDraftChange={setSkillDraft}
          onAdd={(t) => update("skills", [...profile.skills, t])}
          onRemove={(i) =>
            update(
              "skills",
              profile.skills.filter((_, idx) => idx !== i),
            )
          }
          placeholder="예: Kotlin (엔터 또는 쉼표)"
        />
      </Section>

      {/* 자격증 */}
      <Section title="자격증" subtitle="certifications">
        <CertificationList
          items={profile.certifications}
          onChange={(items) => update("certifications", items)}
        />
      </Section>

      {/* 수상 및 기타 이력 */}
      <Section title="수상 및 기타 이력" subtitle="awards">
        <AwardList
          items={profile.awards}
          onChange={(items) => update("awards", items)}
        />
      </Section>

      {/* 외국어 */}
      <Section title="외국어" subtitle="languages · best-effort">
        <LanguageList
          items={profile.languages}
          onChange={(items) => update("languages", items)}
        />
      </Section>

      {/* 블로그 / 홈페이지 */}
      <Section title="블로그 · 홈페이지" subtitle="links">
        <TagInput
          tags={profile.links}
          draft={linkDraft}
          onDraftChange={setLinkDraft}
          onAdd={(t) => update("links", [...profile.links, t])}
          onRemove={(i) =>
            update(
              "links",
              profile.links.filter((_, idx) => idx !== i),
            )
          }
          placeholder="https://github.com/me (엔터 또는 쉼표)"
        />
      </Section>

      {/* 연락처 */}
      <Section title="연락처" subtitle="contact">
        <div className="grid gap-3 sm:grid-cols-2">
          <InputField
            label="이메일"
            type="email"
            value={profile.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="you@career.kr"
          />
          <InputField
            label="휴대전화"
            value={profile.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="010-0000-0000"
          />
        </div>
      </Section>

      <section className="mt-10 rounded-2xl border border-stage-resume-100 bg-stage-resume-50 p-5 text-sm text-stage-resume-700">
        <p className="font-mono text-[11px] uppercase tracking-widest text-stage-resume-500">
          후속 단계 · roadmap
        </p>
        <p className="mt-2">
          AI 모듈 합류 후 (S?+) ‘경험’ · ‘프로필’ 데이터로 위 양식을 자동
          작성합니다. OAuth 협의가 끝나면 리멤버 앱에 직접 동기화로 전환.
          상세는 docs/specs/profile-export-pipeline.md 참고.
        </p>
        <Link
          href="/help"
          className="mt-3 inline-block font-mono text-[10px] uppercase tracking-widest text-stage-resume-700 underline-offset-4 hover:underline hover:text-stage-resume-900"
        >
          ↗ Q&amp;A: 외부 연동
        </Link>
      </section>

      <p className="mt-10 text-center font-mono text-[11px] uppercase tracking-widest text-stage-resume-700">
        S?: 리멤버 OAuth 연동 → 자동 동기화
      </p>
    </main>
  );
}

// ── Reusable section wrapper ────────────────────────────────────────────────

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
              섹션 복사
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
  items: RememberExperience[];
  onChange: (next: RememberExperience[]) => void;
}) {
  function add() {
    onChange([
      ...items,
      {
        company: "",
        department: "",
        title: "",
        startDate: "",
        endDate: "",
        current: false,
        description: "",
      },
    ]);
  }
  function update(i: number, patch: Partial<RememberExperience>) {
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
              label="회사"
              value={e.company}
              onChange={(ev) => update(i, { company: ev.target.value })}
            />
            <InputField
              label="직책"
              value={e.title}
              onChange={(ev) => update(i, { title: ev.target.value })}
            />
            <InputField
              label="부서"
              value={e.department}
              onChange={(ev) => update(i, { department: ev.target.value })}
            />
            <div className="flex items-end gap-2">
              <InputField
                label="시작 (YYYY-MM)"
                value={e.startDate}
                onChange={(ev) => update(i, { startDate: ev.target.value })}
                placeholder="2022-03"
              />
              <InputField
                label={e.current ? "재직중" : "종료 (YYYY-MM)"}
                value={e.current ? "" : e.endDate}
                onChange={(ev) => update(i, { endDate: ev.target.value })}
                placeholder="2025-12"
                disabled={e.current}
              />
            </div>
          </div>
          <label className="mt-2 flex items-center gap-2 text-xs text-stage-resume-700">
            <input
              type="checkbox"
              checked={e.current}
              onChange={(ev) => update(i, { current: ev.target.checked })}
              className="h-4 w-4 accent-stage-resume-900"
            />
            현재 재직 중
          </label>
          <TextareaField
            label="주요 성과 / 업무"
            rows={3}
            value={e.description}
            onChange={(ev) => update(i, { description: ev.target.value })}
            placeholder="• ...\n• ..."
            className="mt-2"
          />
          <div className="mt-2 text-right">
            <Button size="sm" variant="ghost" onClick={() => remove(i)}>
              제거
            </Button>
          </div>
        </div>
      ))}
      <Button size="sm" variant="ghost" onClick={add}>
        + 경력 추가
      </Button>
    </div>
  );
}

function EducationList({
  items,
  onChange,
}: {
  items: RememberEducation[];
  onChange: (next: RememberEducation[]) => void;
}) {
  function add() {
    onChange([
      ...items,
      { school: "", major: "", degree: "", startYear: "", endYear: "" },
    ]);
  }
  function update(i: number, patch: Partial<RememberEducation>) {
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
              label="학교"
              value={e.school}
              onChange={(ev) => update(i, { school: ev.target.value })}
            />
            <InputField
              label="전공"
              value={e.major}
              onChange={(ev) => update(i, { major: ev.target.value })}
            />
            <InputField
              label="학위"
              value={e.degree}
              onChange={(ev) => update(i, { degree: ev.target.value })}
              placeholder="학사 / 석사"
            />
            <div className="flex gap-2">
              <InputField
                label="입학"
                value={e.startYear}
                onChange={(ev) => update(i, { startYear: ev.target.value })}
                placeholder="2018"
              />
              <InputField
                label="졸업"
                value={e.endYear}
                onChange={(ev) => update(i, { endYear: ev.target.value })}
                placeholder="2022"
              />
            </div>
          </div>
          <div className="mt-2 text-right">
            <Button size="sm" variant="ghost" onClick={() => remove(i)}>
              제거
            </Button>
          </div>
        </div>
      ))}
      <Button size="sm" variant="ghost" onClick={add}>
        + 학력 추가
      </Button>
    </div>
  );
}

function CertificationList({
  items,
  onChange,
}: {
  items: RememberCertification[];
  onChange: (next: RememberCertification[]) => void;
}) {
  function add() {
    onChange([...items, { name: "", issuer: "", date: "" }]);
  }
  function update(i: number, patch: Partial<RememberCertification>) {
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
          className="grid gap-2 rounded-xl border border-stage-resume-100 bg-stage-resume-50 p-3 sm:grid-cols-3"
        >
          <InputField
            label="자격증명"
            value={c.name}
            onChange={(ev) => update(i, { name: ev.target.value })}
          />
          <InputField
            label="발급기관"
            value={c.issuer}
            onChange={(ev) => update(i, { issuer: ev.target.value })}
          />
          <div className="flex items-end gap-2">
            <InputField
              label="취득일"
              value={c.date}
              onChange={(ev) => update(i, { date: ev.target.value })}
              placeholder="2024-08"
            />
            <Button size="sm" variant="ghost" onClick={() => remove(i)}>
              제거
            </Button>
          </div>
        </div>
      ))}
      <Button size="sm" variant="ghost" onClick={add}>
        + 자격증 추가
      </Button>
    </div>
  );
}

function AwardList({
  items,
  onChange,
}: {
  items: RememberAward[];
  onChange: (next: RememberAward[]) => void;
}) {
  function add() {
    onChange([...items, { title: "", date: "", description: "" }]);
  }
  function update(i: number, patch: Partial<RememberAward>) {
    onChange(items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  }
  function remove(i: number) {
    onChange(items.filter((_, idx) => idx !== i));
  }
  return (
    <div className="space-y-3">
      {items.map((a, i) => (
        <div
          key={i}
          className="rounded-xl border border-stage-resume-100 bg-stage-resume-50 p-3"
        >
          <div className="grid gap-2 sm:grid-cols-2">
            <InputField
              label="항목명"
              value={a.title}
              onChange={(ev) => update(i, { title: ev.target.value })}
            />
            <InputField
              label="일자"
              value={a.date}
              onChange={(ev) => update(i, { date: ev.target.value })}
              placeholder="2024-11"
            />
          </div>
          <TextareaField
            label="설명"
            rows={2}
            value={a.description}
            onChange={(ev) => update(i, { description: ev.target.value })}
            className="mt-2"
          />
          <div className="mt-2 text-right">
            <Button size="sm" variant="ghost" onClick={() => remove(i)}>
              제거
            </Button>
          </div>
        </div>
      ))}
      <Button size="sm" variant="ghost" onClick={add}>
        + 항목 추가
      </Button>
    </div>
  );
}

function LanguageList({
  items,
  onChange,
}: {
  items: RememberLanguage[];
  onChange: (next: RememberLanguage[]) => void;
}) {
  function add() {
    onChange([...items, { language: "", proficiency: "" }]);
  }
  function update(i: number, patch: Partial<RememberLanguage>) {
    onChange(items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  }
  function remove(i: number) {
    onChange(items.filter((_, idx) => idx !== i));
  }
  return (
    <div className="space-y-3">
      {items.map((l, i) => (
        <div
          key={i}
          className="grid gap-2 rounded-xl border border-stage-resume-100 bg-stage-resume-50 p-3 sm:grid-cols-3"
        >
          <InputField
            label="언어"
            value={l.language}
            onChange={(ev) => update(i, { language: ev.target.value })}
            placeholder="영어"
          />
          <InputField
            label="능숙도"
            value={l.proficiency}
            onChange={(ev) => update(i, { proficiency: ev.target.value })}
            placeholder="비즈니스 / 일상 / Native"
          />
          <div className="flex items-end justify-end">
            <Button size="sm" variant="ghost" onClick={() => remove(i)}>
              제거
            </Button>
          </div>
        </div>
      ))}
      <Button size="sm" variant="ghost" onClick={add}>
        + 언어 추가
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
              aria-label={`${t} 제거`}
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
