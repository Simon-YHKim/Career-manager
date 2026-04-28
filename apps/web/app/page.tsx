import { stageKeys } from "@career/design-tokens";
import { StageCard } from "@/components/StageCard";

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <header className="mb-10">
        <p className="mb-2 text-sm uppercase tracking-widest text-stage-resume-700">
          Sprint 1 · Foundation
        </p>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Career Manager
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-stage-resume-700 sm:text-base">
          한국·영미권 통합 커리어 플랫폼. 본 페이지는 디자인 토큰
          (12-stage Okabe-Ito palette) 의 Web ↔ Android 동일성을 확인하기
          위한 스캐폴드입니다.
        </p>
      </header>

      <section>
        <h2 className="mb-4 text-lg font-semibold">12 Stage Color Tokens</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stageKeys.map((key) => (
            <StageCard key={key} stageKey={key} />
          ))}
        </div>
      </section>

      <footer className="mt-16 border-t border-black/10 pt-6 text-xs text-stage-resume-700">
        Built on Next.js 15 · Tailwind v4 · @career/design-tokens ·
        @career/schema
      </footer>
    </main>
  );
}
