import { notFound } from "next/navigation";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Tag } from "@/components/ui";
import {
  articleBySlug,
  articles,
  categoryLabel,
  type Article,
  type Block,
} from "@/lib/blog-articles";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export const dynamicParams = false;

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = articleBySlug(slug);
  if (!article) notFound();

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <Breadcrumb category={null} current={article.title} />

      <header className="mt-6 border-l-2 border-stage-resume-900 pl-4">
        <div className="flex flex-wrap items-baseline gap-2">
          <Tag>{categoryLabel[article.category]}</Tag>
          <span className="font-mono text-[11px] uppercase tracking-widest text-stage-resume-700">
            {article.readMinutes}분 읽기 · {article.publishedAt}
          </span>
        </div>
        <h1 className="mt-3 text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">
          {article.title}
        </h1>
      </header>

      <article className="mt-8 space-y-5 text-[15px] leading-7 text-stage-resume-900">
        {(article.body ?? fallbackBody(article)).map((block, i) => (
          <BlockRenderer key={i} block={block} />
        ))}
      </article>

      <footer className="mt-12 flex items-center justify-between gap-3 border-t border-stage-resume-100 pt-6">
        <Link
          href="/blog"
          className="font-mono text-[11px] uppercase tracking-widest text-stage-resume-700 underline-offset-4 hover:underline hover:text-stage-resume-900"
        >
          ← 블로그 목록
        </Link>
        <span className="font-mono text-[10px] uppercase tracking-widest text-stage-resume-500">
          {article.slug}
        </span>
      </footer>
    </main>
  );
}

function fallbackBody(article: Article): readonly Block[] {
  return [{ kind: "paragraph", text: article.excerpt }];
}

function BlockRenderer({ block }: { block: Block }) {
  switch (block.kind) {
    case "heading":
      return (
        <h2 className="mt-6 text-lg font-semibold tracking-tight text-stage-resume-900">
          {block.text}
        </h2>
      );
    case "paragraph":
      return <p className="text-stage-resume-900">{block.text}</p>;
    case "bullets":
      return (
        <ul className="space-y-2 pl-1">
          {block.items.map((it, i) => (
            <li
              key={i}
              className="relative pl-4 text-stage-resume-900 before:absolute before:left-0 before:top-3 before:h-1 before:w-1 before:rounded-full before:bg-stage-resume-700"
            >
              {it}
            </li>
          ))}
        </ul>
      );
    case "callout":
      return (
        <p className="rounded-xl border border-stage-resume-100 bg-stage-resume-50 px-4 py-3 text-[14px] leading-6 text-stage-resume-900">
          {block.text}
        </p>
      );
  }
}
