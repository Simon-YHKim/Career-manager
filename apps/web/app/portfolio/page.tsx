"use client";

import { useToast, Button, Card, Tag } from "@/components/ui";
import { StageHero } from "@/components/StageHero";
import { stages } from "@career/design-tokens";

type PortfolioItem = {
  id: string;
  title: string;
  kind: "project" | "writing" | "talk" | "code";
  description: string;
  url: string;
  year: number;
};

const kindLabel: Record<PortfolioItem["kind"], string> = {
  project: "프로젝트",
  writing: "글",
  talk: "발표",
  code: "코드",
};

const SEED: readonly PortfolioItem[] = [
  {
    id: "p1",
    title: "Realtime collaborative editor (Yjs CRDT)",
    kind: "project",
    description:
      "Next.js + Yjs + Hocuspocus로 만든 실시간 협업 에디터. 동시 편집 100명 안정 처리.",
    url: "https://github.com/example/realtime-editor",
    year: 2024,
  },
  {
    id: "p2",
    title: "한국 결제망에서 idempotency 다루기",
    kind: "writing",
    description:
      "토스에서 결제 멱등성 키를 어떻게 설계했는지에 대한 회고. 5천 회 이상 조회.",
    url: "https://blog.example.com/idempotency-korea",
    year: 2024,
  },
  {
    id: "p3",
    title: "Next.js App Router 의 hidden cost",
    kind: "talk",
    description:
      "FEConf 2024 발표. RSC 도입 시 자주 놓치는 성능 함정 5가지.",
    url: "https://feconf.kr/2024/sessions/...",
    year: 2024,
  },
  {
    id: "p4",
    title: "next.js · App Router 메모이제이션 PR",
    kind: "code",
    description:
      "useSearchParams 가 자체 메모이제이션을 잃는 케이스 발견 + 수정. PR #52341 머지.",
    url: "https://github.com/vercel/next.js/pull/52341",
    year: 2024,
  },
];

export default function PortfolioPage() {
  const { show } = useToast();
  const palette = stages.portfolio;

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <StageHero
        stageKey="portfolio"
        action={
          <Button
            variant="primary"
            onClick={() =>
              show({ kind: "info", message: "S8 에서 OG-card 자동 생성 + 메타데이터 추출 wiring." })
            }
          >
            + 항목 추가
          </Button>
        }
      />

      <section className="mt-8 grid gap-3 sm:grid-cols-2">
        {SEED.map((item) => (
          <Card key={item.id} interactive href={item.url} className="flex h-full flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
              <Tag stage="portfolio">{kindLabel[item.kind]}</Tag>
              <span className="font-mono text-[10px] text-stage-resume-700">
                {item.year}
              </span>
            </div>
            <h2
              className="text-base font-semibold leading-snug"
              style={{ color: palette["900"] }}
            >
              {item.title}
            </h2>
            <p className="text-sm leading-relaxed text-stage-resume-700">
              {item.description}
            </p>
            <p className="mt-auto truncate font-mono text-[11px] text-stage-portfolio-700">
              ↗ {new URL(item.url).hostname}
            </p>
          </Card>
        ))}
      </section>

      <p className="mt-10 text-center font-mono text-[11px] uppercase tracking-widest text-stage-resume-700">
        S8 에서 URL → OG card · 카테고리 자동 분류 · 추천 정렬
      </p>
    </main>
  );
}
