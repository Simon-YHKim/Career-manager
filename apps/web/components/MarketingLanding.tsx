"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthModal } from "@/components/AuthModal";

/**
 * Public marketing landing — shown to visitors who haven't logged in.
 * Authenticated users see <Dashboard /> instead (page.tsx branches by
 * AuthState).
 *
 * Tone: 단정한 한국어, 한 화면 안에 정리. AI Slop 3원칙 준수
 * (이모지 X · 모노톤 · 레퍼런스 일관).
 */
export function MarketingLanding() {
  const [open, setOpen] = useState<"signin" | "signup" | null>(null);

  return (
    <main className="mx-auto flex min-h-[calc(100dvh-65px)] max-w-5xl flex-col px-6 py-10">
      <section className="border-l-2 border-stage-resume-900 pl-5">
        <p className="font-mono text-[11px] uppercase tracking-widest text-stage-resume-700">
          Career Manager · Korea + Western
        </p>
        <h1 className="mt-2 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
          한국 채용과 글로벌 채용을
          <br />
          하나의 워크플로우로.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-stage-resume-700">
          자기 정리 → 자료 만들기 → 면접 → 협상까지. 12 단계가 한 곳에서
          이어집니다. 캘린더와 D-day 알림으로 마감 놓치지 않고, 리멤버 ·
          링크드인 프로필도 동기화합니다.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setOpen("signup")}
            className="rounded-md bg-stage-resume-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-stage-resume-700"
          >
            무료로 시작하기
          </button>
          <button
            type="button"
            onClick={() => setOpen("signin")}
            className="rounded-md border border-stage-resume-100 bg-white px-5 py-2.5 text-sm font-medium text-stage-resume-900 hover:border-stage-resume-700"
          >
            로그인
          </button>
          <Link
            href="/?demo=1"
            className="rounded-md border border-stage-resume-100 bg-white px-5 py-2.5 text-sm font-medium text-stage-resume-900 hover:border-stage-resume-700"
          >
            데모로 둘러보기
          </Link>
          <Link
            href="/help"
            className="self-center font-mono text-[11px] uppercase tracking-widest text-stage-resume-700 underline-offset-4 hover:underline hover:text-stage-resume-900"
          >
            ↗ Q&amp;A 보기
          </Link>
        </div>
      </section>

      <section
        aria-label="기능 요약"
        className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
      >
        {[
          {
            title: "기반",
            body:
              "프로필 · 경험 · 메모리. 한 번 정리한 내용이 자료·면접에 자동으로 흘러들어 갑니다.",
          },
          {
            title: "자료",
            body:
              "이력서 · 경력기술서 · 자소서 · 포트폴리오 — 회사 톤에 맞춰 reframe.",
          },
          {
            title: "면접",
            body: "코칭 → 평가 → 연봉 협상. LLM 기반 모의 면접과 시장 비교.",
          },
          {
            title: "할 일",
            body:
              "지원 공고의 단계별 체크리스트와 개인 리마인더. D-day 가 임박하면 자동 강조.",
          },
          {
            title: "리멤버 · LinkedIn",
            body:
              "정리된 프로필을 한국어 / 영문 양식으로. 자동 동기화 또는 복사·붙여넣기.",
          },
          {
            title: "블로그 · Q&A",
            body:
              "이력서 · 자소서 · 면접 · 협상 가이드. 사용 매뉴얼은 Q&A 페이지.",
          },
        ].map((f) => (
          <div
            key={f.title}
            className="rounded-xl border border-stage-resume-100 bg-white p-4"
          >
            <p className="text-base font-semibold text-stage-resume-900">
              {f.title}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-stage-resume-700">
              {f.body}
            </p>
          </div>
        ))}
      </section>

      <p className="mt-10 text-center font-mono text-[11px] uppercase tracking-widest text-stage-resume-700">
        S2 — Supabase Auth · Google · Apple · Email Magic Link
      </p>

      <AuthModal
        open={open !== null}
        onClose={() => setOpen(null)}
        initialTab={open ?? "signin"}
      />
    </main>
  );
}
