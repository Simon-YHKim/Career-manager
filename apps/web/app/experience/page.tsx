"use client";

import { useState } from "react";
import { stageLabels, stageTagline, categoryOf } from "@/lib/stages-config";
import { Breadcrumb } from "@/components/Breadcrumb";
import {
  Button,
  Card,
  InputField,
  Tag,
  TextareaField,
  useToast,
} from "@/components/ui";

type Atom = {
  id: string;
  title: string;
  company: string;
  period: string;
  bullets: string[];
};

const SEED_ATOMS: readonly Atom[] = [
  {
    id: "seed-1",
    title: "Backend Engineer",
    company: "(예시) 토스",
    period: "2023.03 - 2024.12",
    bullets: [
      "결제 트랜잭션 처리량 5x 개선 (peak 200 → 1000 RPS)",
      "Redis 캐싱 + read replica 도입으로 평균 latency 40ms → 12ms",
      "장애 대응 runbook 작성, on-call rotation 도입",
    ],
  },
  {
    id: "seed-2",
    title: "Open source contributor",
    company: "(예시) Vercel/Next.js",
    period: "2024.05 - present",
    bullets: [
      "App Router 의 useSearchParams 메모이제이션 버그 수정 (#52341)",
      "next/font/local 의 자동 subsetting 알고리즘 개선",
    ],
  },
];

function uid(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function ExperiencePage() {
  const cat = categoryOf("experience");
  const { show } = useToast();

  const [atoms, setAtoms] = useState<Atom[]>([...SEED_ATOMS]);
  const [editing, setEditing] = useState<Atom | null>(null);

  function startNew() {
    setEditing({ id: uid(), title: "", company: "", period: "", bullets: [""] });
  }

  function startEdit(atom: Atom) {
    setEditing({ ...atom, bullets: [...atom.bullets] });
  }

  function cancel() {
    setEditing(null);
  }

  function save() {
    if (!editing) return;
    if (!editing.title.trim() || !editing.company.trim()) {
      show({ kind: "error", message: "직무와 회사는 필수입니다." });
      return;
    }
    const cleaned = {
      ...editing,
      bullets: editing.bullets.map((b) => b.trim()).filter(Boolean),
    };
    setAtoms((prev) => {
      const i = prev.findIndex((a) => a.id === cleaned.id);
      if (i === -1) return [cleaned, ...prev];
      return prev.map((a, idx) => (idx === i ? cleaned : a));
    });
    setEditing(null);
    show({
      kind: "info",
      message: "S2 에서 Supabase 저장으로 연결됩니다. 현재는 로컬 상태.",
    });
  }

  function remove(id: string) {
    setAtoms((prev) => prev.filter((a) => a.id !== id));
  }

  function patchEditing(p: Partial<Atom>) {
    setEditing((cur) => (cur ? { ...cur, ...p } : cur));
  }

  function patchBullet(i: number, value: string) {
    setEditing((cur) => {
      if (!cur) return cur;
      const next = [...cur.bullets];
      next[i] = value;
      return { ...cur, bullets: next };
    });
  }

  function addBullet() {
    setEditing((cur) => (cur ? { ...cur, bullets: [...cur.bullets, ""] } : cur));
  }

  function removeBullet(i: number) {
    setEditing((cur) => {
      if (!cur) return cur;
      if (cur.bullets.length === 1) return { ...cur, bullets: [""] };
      return { ...cur, bullets: cur.bullets.filter((_, idx) => idx !== i) };
    });
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <Breadcrumb category={cat} current={stageLabels.experience.ko} />

      <header className="mt-6 flex flex-col gap-4 border-l-2 border-stage-resume-900 pl-4 sm:flex-row sm:items-start sm:justify-between sm:border-l-0 sm:pl-0">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-widest text-stage-resume-700">
            experience · {stageLabels.experience.en}
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">
            {stageLabels.experience.ko}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-stage-resume-700">
            {stageTagline.experience}
          </p>
        </div>
        {!editing && (
          <Button variant="primary" onClick={startNew}>
            + 경험 추가
          </Button>
        )}
      </header>

      {editing && (
        <Card className="mt-8 space-y-4">
          <p className="text-xs font-medium uppercase tracking-widest text-stage-resume-700">
            {atoms.find((a) => a.id === editing.id) ? "경험 수정" : "새 경험"}
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <InputField
              label="직무"
              value={editing.title}
              onChange={(e) => patchEditing({ title: e.target.value })}
              placeholder="Backend Engineer"
            />
            <InputField
              label="회사 / 조직"
              value={editing.company}
              onChange={(e) => patchEditing({ company: e.target.value })}
              placeholder="토스"
            />
          </div>
          <InputField
            label="기간"
            value={editing.period}
            onChange={(e) => patchEditing({ period: e.target.value })}
            placeholder="2023.03 - 2024.12"
          />
          <fieldset className="space-y-2">
            <legend className="text-xs font-medium text-stage-resume-900">
              불릿 (성과 · 기여 · 결과)
            </legend>
            {editing.bullets.map((b, i) => (
              <div key={i} className="flex items-start gap-2">
                <TextareaField
                  label={`#${i + 1}`}
                  value={b}
                  onChange={(e) => patchBullet(i, e.target.value)}
                  placeholder="What · Why · Impact (정량 우선)"
                  rows={2}
                  className="flex-1"
                />
                {editing.bullets.length > 1 && (
                  <div className="pt-7">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeBullet(i)}
                      aria-label={`불릿 ${i + 1} 삭제`}
                    >
                      ×
                    </Button>
                  </div>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={addBullet}
            >
              + 불릿 추가
            </Button>
          </fieldset>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={cancel}>
              취소
            </Button>
            <Button variant="primary" onClick={save}>
              저장
            </Button>
          </div>
        </Card>
      )}

      <section className="mt-8 space-y-3">
        <p className="text-xs font-medium uppercase tracking-widest text-stage-resume-700">
          누적된 경험 ({atoms.length})
        </p>
        {atoms.length === 0 ? (
          <Card>
            <p className="text-sm text-stage-resume-700">
              아직 등록된 경험이 없습니다. 위의 "+ 경험 추가" 로 시작하세요.
            </p>
          </Card>
        ) : (
          atoms.map((a) => (
            <Card key={a.id} className="space-y-2">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <p className="text-base font-semibold leading-tight">
                    {a.title}
                  </p>
                  <p className="font-mono text-[11px] text-stage-resume-700">
                    {a.company} · {a.period}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => startEdit(a)}
                  >
                    수정
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => remove(a.id)}
                  >
                    삭제
                  </Button>
                </div>
              </div>
              <ul className="ml-4 list-disc space-y-1 text-sm text-stage-resume-900 marker:text-stage-resume-700">
                {a.bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </Card>
          ))
        )}
      </section>

      <p className="mt-10 text-center font-mono text-[11px] uppercase tracking-widest text-stage-resume-700">
        <Tag>S2 · Supabase 저장 wiring 대기</Tag>
      </p>
    </main>
  );
}
