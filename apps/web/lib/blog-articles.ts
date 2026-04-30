/**
 * Blog article catalog. Sample-only for now — replaced with a CMS feed
 * in a later sprint. Used by /blog (list) and /blog/[slug] (detail).
 *
 * Reading model: subway / bus friendly. Short paragraphs, no long
 * tables, headings every 100-150 words, total 5-10 min read.
 */

export type BlogCategory =
  | "resume"
  | "essay"
  | "interview"
  | "salary"
  | "career-change"
  | "market"
  | "tools";

export type CategoryFilter = "all" | BlogCategory;

export const categoryLabel: Record<CategoryFilter, string> = {
  all: "전체",
  resume: "이력서",
  essay: "자소서",
  interview: "면접",
  salary: "협상",
  "career-change": "이직",
  market: "시장 동향",
  tools: "자기 정리",
};

export const categoryFilters: readonly CategoryFilter[] = [
  "all",
  "resume",
  "essay",
  "interview",
  "salary",
  "career-change",
  "market",
  "tools",
];

/**
 * Article body — `paragraph` is plain text (1-3 sentences),
 * `heading` is a section title, `bullets` is a short list.
 * Keep blocks short for one-thumb scrolling.
 */
export type Block =
  | { kind: "paragraph"; text: string }
  | { kind: "heading"; text: string }
  | { kind: "bullets"; items: readonly string[] }
  | { kind: "callout"; text: string };

export type Article = {
  slug: string;
  title: string;
  category: BlogCategory;
  excerpt: string;
  readMinutes: number;
  publishedAt: string;
  /** Optional rich body. When absent, the detail page shows the excerpt. */
  body?: readonly Block[];
};

export const articles: readonly Article[] = [
  {
    slug: "interview-pressure-questions-5",
    title: "면접관이 던지는 압박 질문 5가지와 그 본질",
    category: "interview",
    excerpt:
      "왜 우리 회사인가요? · 약점이 무엇인가요? · 5년 후 모습은? — 진짜로 무엇을 묻고 있는지를 분해해야 답이 나옵니다.",
    readMinutes: 6,
    publishedAt: "2026-04-28",
    body: [
      {
        kind: "callout",
        text:
          "TL;DR — 압박 질문은 ‘답’ 을 듣고 싶어 하는 게 아니라 ‘반응’ 을 보고 싶어 합니다. 5초 멈춤은 약점이 아니라 신호입니다.",
      },
      {
        kind: "paragraph",
        text:
          "출퇴근길에 한 번 훑어두기 좋게 다섯 개로 줄였습니다. 답안 자체보다 ‘이 질문이 진짜 묻는 것이 무엇인가’ 를 먼저 짚는 게 핵심입니다.",
      },

      { kind: "heading", text: "1. 왜 우리 회사인가요" },
      {
        kind: "paragraph",
        text:
          "이 질문의 진짜 의도는 회사 자랑을 듣는 게 아닙니다. ‘다른 회사가 아니라 여기여야만 하는 이유’ 가 본인 안에 정리돼 있는지 봅니다.",
      },
      {
        kind: "bullets",
        items: [
          "회사의 최근 launch 1개를 본인의 강점과 연결",
          "이 회사에서만 풀 수 있는 문제 1개를 짚기",
          "본인이 1년 후 만들고 싶은 결과물을 한 줄로",
        ],
      },

      { kind: "heading", text: "2. 본인의 약점은 무엇인가요" },
      {
        kind: "paragraph",
        text:
          "‘완벽주의자라 일을 너무 잡고 있어요’ 같은 답은 거의 모두에게 알려져 있어 오히려 신뢰를 깎습니다. 진짜 약점 + 그 약점을 다루기 위해 지금 하고 있는 행동, 두 짝을 함께 말합니다.",
      },
      {
        kind: "callout",
        text:
          "구조 — 약점 한 줄 → 그게 만든 실패 1건 → 그래서 내가 도입한 루틴 1개. 30초.",
      },

      { kind: "heading", text: "3. 5년 후 어떤 모습이고 싶나요" },
      {
        kind: "paragraph",
        text:
          "이 질문은 ‘우리 회사에서 5년 동안 일할 사람인가’ 를 우회해서 묻습니다. 회사를 빠지지 않고도 본인의 성장 그림이 회사 안에서 어떻게 자라는지 보여주면 충분합니다.",
      },

      { kind: "heading", text: "4. 가장 어려웠던 협업은 어떻게 풀었나요" },
      {
        kind: "paragraph",
        text:
          "성과보다 ‘다른 의견과 부딪쳤을 때 본인이 어떤 사람인지’ 를 봅니다. 갈등 → 본인 행동 → 결과 → 배운 점, 4단계로. 결과가 깔끔하지 않아도 배운 점만 솔직하면 통과합니다.",
      },

      { kind: "heading", text: "5. 마지막으로 궁금한 점이 있나요" },
      {
        kind: "paragraph",
        text:
          "여기서 ‘없습니다’ 라고 답하면 그동안의 답변이 한 단계 깎입니다. 짧아도 좋으니 회사 product · 팀 일하는 방식 · 본인 R&R 중 하나에 대해 한 가지를 묻습니다.",
      },
      {
        kind: "bullets",
        items: [
          "최근 6개월 안에 팀이 가장 잘 풀었다고 생각하는 문제는?",
          "이 자리에서 첫 90일 동안 가장 큰 임팩트를 낸 사람은 무엇을 했나요?",
          "팀이 의사결정을 내릴 때 가장 중요하게 보는 한 가지는?",
        ],
      },

      { kind: "heading", text: "30분 액션" },
      {
        kind: "bullets",
        items: [
          "위 5개 질문에 각각 30초 답안을 메모로 적어두기",
          "그중 가장 막히는 1개를 골라 큰 소리로 한 번 말해 보기",
          "면접 전날 다시 한 번 출퇴근길에 훑어보기",
        ],
      },
    ],
  },
  {
    slug: "resume-one-page-7",
    title: "이력서 한 페이지에 들어가야 하는 7가지",
    category: "resume",
    excerpt:
      "스크리닝 단계에서 채용담당자가 평균 7초를 보는 이력서. 7초 안에 통과시키려면 어떤 정보가 어떤 순서로 있어야 할지 정리했습니다.",
    readMinutes: 6,
    publishedAt: "2026-04-22",
  },
  {
    slug: "essay-not-star",
    title: "자소서를 STAR로 쓰면 안 되는 이유",
    category: "essay",
    excerpt:
      "STAR(Situation-Task-Action-Result)는 면접 답변 프레임이지 자소서 프레임이 아닙니다. 자소서에 더 적합한 두 가지 구조를 비교합니다.",
    readMinutes: 8,
    publishedAt: "2026-04-19",
  },
  {
    slug: "salary-negotiation-loss-kr",
    title: "한국에서 협상 못 한다고 손해보는 평균 금액",
    category: "salary",
    excerpt:
      "오퍼 받았을 때 그대로 사인하시나요? 데이터로 본 협상 가능 폭과 한국 시장에서 통하는 협상 스크립트.",
    readMinutes: 7,
    publishedAt: "2026-04-10",
  },
  {
    slug: "kr-to-us-1y-prep",
    title: "한국 → 영미권 이직, 1년 전부터 준비할 4가지",
    category: "career-change",
    excerpt:
      "비자 · 영문 이력서 · 네트워킹 · 영어 인터뷰. 시간을 거꾸로 돌려 1년 전 나에게 줬으면 좋았을 체크리스트.",
    readMinutes: 12,
    publishedAt: "2026-04-05",
  },
  {
    slug: "portfolio-github-vs-site",
    title: "포트폴리오에 코드 GitHub 링크 vs 자체 사이트, 무엇이 더 좋은가",
    category: "resume",
    excerpt:
      "엔지니어링 · 디자인 · 데이터 직군별로 채용담당자가 실제로 클릭하는 비율을 비교한 데이터.",
    readMinutes: 5,
    publishedAt: "2026-04-01",
  },
];

export function articleBySlug(slug: string): Article | null {
  return articles.find((a) => a.slug === slug) ?? null;
}
