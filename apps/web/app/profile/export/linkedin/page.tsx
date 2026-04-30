"use client";

import { useState } from "react";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Button, Card, useToast } from "@/components/ui";

/**
 * LinkedIn — 글로벌 프로필. LinkedIn API 는 Marketing Developer Platform
 * 인증이 필요하고 Profile API 는 v2 부터 third-party 에 매우 제한적이라,
 * 1차 출시는 영문 섹션을 클립보드 복사 형태로 제공합니다. S?? 자동
 * 동기화 검토 → 가능 시 OAuth 추가.
 */

const SECTIONS = [
  {
    label: "Headline",
    body:
      "Backend Engineer · Payments — 6 yrs scaling fintech APIs across Korea & APAC.",
  },
  {
    label: "About",
    body:
      "I build payments infrastructure that survives Black Friday traffic spikes. At Toss I led the migration of our gateway to a sharded Kafka pipeline (12M txns/day, zero downtime). Comfortable working across Korean and English teams.",
  },
  {
    label: "Experience — Toss · Senior Backend Engineer",
    body:
      "• Led payment gateway migration (Kotlin · Spring · Kafka), 12M daily txns\n• Reduced p99 latency from 480ms → 120ms\n• Mentored 3 junior engineers; ran weekly architecture review",
  },
];

export default function LinkedinExportPage() {
  const { show } = useToast();
  const [copied, setCopied] = useState<number | null>(null);

  async function copy(text: string, i: number) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(i);
      show({ kind: "success", message: "Copied." });
      setTimeout(() => setCopied(null), 1500);
    } catch {
      show({ kind: "error", message: "복사 실패 — 직접 선택해 복사해주세요." });
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <Breadcrumb category={null} current="LinkedIn · 프로필 내보내기" />
      <header className="mt-6 border-l-2 border-stage-resume-900 pl-4">
        <p className="font-mono text-[11px] uppercase tracking-widest text-stage-resume-700">
          profile · linkedin
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">
          LinkedIn 프로필 동기화
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-stage-resume-700">
          LinkedIn Profile API 는 third-party 에 제한적이라 자동 동기화는
          현재 지원되지 않습니다. 영문 섹션 단위로 복사·붙여넣어 사용하세요.
          OAuth 자동 동기화는 S?? 검토 단계입니다.
        </p>
      </header>

      <section className="mt-8 space-y-3">
        {SECTIONS.map((s, i) => (
          <Card key={s.label} className="space-y-2">
            <div className="flex items-baseline justify-between gap-2">
              <p className="font-mono text-[11px] uppercase tracking-widest text-stage-resume-700">
                {s.label}
              </p>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => copy(s.body, i)}
              >
                {copied === i ? "Copied" : "Copy"}
              </Button>
            </div>
            <pre className="whitespace-pre-wrap rounded-md border border-stage-resume-100 bg-stage-resume-50 p-3 font-sans text-sm text-stage-resume-900">
              {s.body}
            </pre>
          </Card>
        ))}
      </section>

      <p className="mt-10 text-center font-mono text-[11px] uppercase tracking-widest text-stage-resume-700">
        S?: LinkedIn OAuth 검토 — 가능 시 자동 동기화 전환
      </p>
    </main>
  );
}
