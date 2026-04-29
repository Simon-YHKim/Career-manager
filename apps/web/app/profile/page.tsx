"use client";

import { useState, type FormEvent } from "react";
import { Persona, Language } from "@career/schema";
import { stages } from "@career/design-tokens";
import { stageLabels, stageTagline, categoryOf } from "@/lib/stages-config";
import { Breadcrumb } from "@/components/Breadcrumb";
import {
  Button,
  Card,
  InputField,
  SelectField,
  Tag,
  TextareaField,
  useToast,
} from "@/components/ui";

const personaOptions: readonly { value: Persona; label: string }[] = [
  { value: "A", label: "A · 취린이 (취준 시작)" },
  { value: "B", label: "B · 신입 (졸업 전후)" },
  { value: "C", label: "C · 주니어 이직자 (1-5년)" },
  { value: "D", label: "D · 시니어 (5-15년)" },
  { value: "E", label: "E · 베테랑·임원" },
  { value: "F", label: "F · 외국계·영미권" },
];

const languageOptions: readonly { value: Language; label: string }[] = [
  { value: "ko", label: "한국어" },
  { value: "en", label: "English" },
];

type TargetJob = { title: string; titleEn: string };

export default function ProfilePage() {
  const palette = stages.profile;
  const cat = categoryOf("profile");
  const { show } = useToast();

  const [thesis, setThesis] = useState("");
  const [persona, setPersona] = useState<Persona>("B");
  const [languages, setLanguages] = useState<Language[]>(["ko"]);
  const [targetJobs, setTargetJobs] = useState<TargetJob[]>([
    { title: "", titleEn: "" },
  ]);
  const [remote, setRemote] = useState<"onsite" | "hybrid" | "remote">("hybrid");

  const thesisChars = thesis.length;
  const thesisOver = thesisChars > 280;

  function toggleLang(lang: Language) {
    setLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang],
    );
  }

  function updateJob(i: number, patch: Partial<TargetJob>) {
    setTargetJobs((prev) => prev.map((j, idx) => (idx === i ? { ...j, ...patch } : j)));
  }

  function addJob() {
    setTargetJobs((prev) => [...prev, { title: "", titleEn: "" }]);
  }

  function removeJob(i: number) {
    setTargetJobs((prev) => prev.filter((_, idx) => idx !== i));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (thesisOver) {
      show({ kind: "error", message: "Career thesis 는 280자 이내여야 합니다." });
      return;
    }
    if (languages.length === 0) {
      show({ kind: "error", message: "최소 한 개의 언어를 선택해야 합니다." });
      return;
    }
    show({
      kind: "info",
      message: "S2 에서 Supabase 저장으로 연결됩니다. 현재는 시각 시안.",
    });
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <Breadcrumb category={cat} current={stageLabels.profile.ko} />

      <header
        className="mt-6 border-l-4 pl-4"
        style={{ borderColor: palette["500"] }}
      >
        <p
          className="font-mono text-[11px] uppercase tracking-widest"
          style={{ color: palette["700"] }}
        >
          profile · {stageLabels.profile.en}
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">
          {stageLabels.profile.ko}
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-stage-resume-700">
          {stageTagline.profile}
        </p>
      </header>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <Card className="space-y-4">
          <p className="text-xs font-medium uppercase tracking-widest text-stage-resume-700">
            한 줄 thesis
          </p>
          <TextareaField
            label="Career thesis"
            hint={
              <span className={thesisOver ? "text-stage-salary-900" : undefined}>
                {thesisChars} / 280자
              </span>
            }
            placeholder="예: AI 시스템을 안전하게 운영하는 인프라 엔지니어로 성장한다."
            value={thesis}
            onChange={(e) => setThesis(e.target.value)}
            error={thesisOver ? "280자를 초과했습니다." : null}
            rows={3}
          />
        </Card>

        <Card className="space-y-4">
          <p className="text-xs font-medium uppercase tracking-widest text-stage-resume-700">
            기본 정보
          </p>
          <SelectField
            label="Persona"
            value={persona}
            onChange={(e) => setPersona(e.target.value as Persona)}
          >
            {personaOptions.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </SelectField>

          <fieldset className="space-y-1.5">
            <legend className="text-xs font-medium text-stage-resume-900">
              언어 (지원 가능한)
            </legend>
            <div className="flex gap-2">
              {languageOptions.map((opt) => {
                const active = languages.includes(opt.value);
                return (
                  <button
                    key={opt.value}
                    type="button"
                    aria-pressed={active}
                    onClick={() => toggleLang(opt.value)}
                    className="rounded-full border px-3 py-1 text-xs font-medium transition-colors motion-reduce:transition-none"
                    style={{
                      backgroundColor: active ? palette["500"] : "transparent",
                      borderColor: active ? palette["500"] : palette["100"],
                      color: active ? palette["50"] : palette["900"],
                    }}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </fieldset>
        </Card>

        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-widest text-stage-resume-700">
              희망 직무
            </p>
            <Button type="button" variant="ghost" size="sm" onClick={addJob}>
              + 추가
            </Button>
          </div>
          <div className="space-y-3">
            {targetJobs.map((job, i) => (
              <div key={i} className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
                <InputField
                  label={i === 0 ? "직무 (한글)" : `직무 ${i + 1} (한글)`}
                  value={job.title}
                  onChange={(e) => updateJob(i, { title: e.target.value })}
                  placeholder="예: 백엔드 엔지니어"
                />
                <InputField
                  label={i === 0 ? "직무 (영문)" : `직무 ${i + 1} (영문)`}
                  value={job.titleEn}
                  onChange={(e) => updateJob(i, { titleEn: e.target.value })}
                  placeholder="Backend Engineer"
                />
                {targetJobs.length > 1 && (
                  <div className="flex items-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeJob(i)}
                    >
                      삭제
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

        <Card className="space-y-4">
          <p className="text-xs font-medium uppercase tracking-widest text-stage-resume-700">
            근무 형태
          </p>
          <SelectField
            label="원격 근무 선호"
            value={remote}
            onChange={(e) =>
              setRemote(e.target.value as "onsite" | "hybrid" | "remote")
            }
          >
            <option value="onsite">출근</option>
            <option value="hybrid">하이브리드</option>
            <option value="remote">완전 원격</option>
          </SelectField>
        </Card>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <Tag stage="profile">S2 · Supabase 저장 wiring 대기</Tag>
          <Button type="submit" variant="primary" size="lg">
            저장
          </Button>
        </div>
      </form>
    </main>
  );
}
