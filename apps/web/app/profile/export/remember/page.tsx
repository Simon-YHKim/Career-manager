"use client";

import { useState } from "react";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Button, Card, useToast } from "@/components/ui";

/**
 * 리멤버 (Remember) — 한국 비즈니스 프로필 네트워크. 공식 export API
 * 가 없는 만큼 (S?? 파트너십 협의), 1차 출시는 사용자가 작성한 경험·
 * 자기소개를 리멤버 프로필 양식에 맞춰 정리하고 클립보드에 복사하는
 * 형태로 제공합니다. 자동 동기화는 OAuth 협의 후 S?? 합류.
 */

const SECTIONS = [
  {
    label: "한 줄 소개",
    body:
      "Backend 엔지니어 · 결제 도메인 6년 — 토스 / 카카오페이 시장 비교 인사이트 보유.",
  },
  {
    label: "주요 역량 (3-5개)",
    body:
      "• 결제 백엔드 (Kotlin, Spring, Kafka)\n• 시스템 안정성 — SLO 99.95% 운영 경험\n• 다국적 팀 협업 (한 · 영 · 일)",
  },
  {
    label: "최근 프로젝트",
    body:
      "토스페이먼츠 결제 게이트웨이 마이그레이션 (2025) — 일 거래 12M 건, 무중단 전환 완료.",
  },
];

export default function RememberExportPage() {
  const { show } = useToast();
  const [copied, setCopied] = useState<number | null>(null);

  async function copy(text: string, i: number) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(i);
      show({ kind: "success", message: "복사됨." });
      setTimeout(() => setCopied(null), 1500);
    } catch {
      show({ kind: "error", message: "복사 실패 — 직접 선택해 복사해주세요." });
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <Breadcrumb category={null} current="리멤버 · 프로필 내보내기" />
      <header className="mt-6 border-l-2 border-stage-resume-900 pl-4">
        <p className="font-mono text-[11px] uppercase tracking-widest text-stage-resume-700">
          profile · remember
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">
          리멤버 프로필 동기화
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-stage-resume-700">
          현재는 자동 연동이 지원되지 않아 복사·붙여넣기 형태로 제공합니다.
          리멤버 OAuth 협의 후 자동 업데이트로 전환됩니다 (S??).
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
                {copied === i ? "복사됨" : "복사"}
              </Button>
            </div>
            <pre className="whitespace-pre-wrap rounded-md border border-stage-resume-100 bg-stage-resume-50 p-3 font-sans text-sm text-stage-resume-900">
              {s.body}
            </pre>
          </Card>
        ))}
      </section>

      <p className="mt-10 text-center font-mono text-[11px] uppercase tracking-widest text-stage-resume-700">
        S?: 리멤버 OAuth 연동 → 자동 동기화
      </p>
    </main>
  );
}
