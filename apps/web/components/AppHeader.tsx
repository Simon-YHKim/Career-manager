import Link from "next/link";
import { categories, stageLabels, stageSlug } from "@/lib/stages-config";
import { stages } from "@career/design-tokens";

/**
 * Top navigation. Categories laid out horizontally on desktop, stacked
 * on mobile (no hamburger yet — defer until the route count justifies it).
 *
 * The "로그인" button is a visual placeholder — S2 will wire Supabase Auth.
 */
export function AppHeader() {
  return (
    <header className="border-b border-black/5 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/"
          className="font-semibold tracking-tight text-stage-resume-900"
        >
          Career Manager
        </Link>

        <nav
          aria-label="주요 기능"
          className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm"
        >
          <Link
            href={`/${stageSlug.todo}`}
            className="text-stage-todo-700 hover:text-stage-todo-900"
          >
            {stageLabels.todo.ko}
          </Link>
          <Link
            href={`/${stageSlug.blog}`}
            className="text-stage-blog-700 hover:text-stage-blog-900"
          >
            {stageLabels.blog.ko}
          </Link>
          <span className="hidden h-3 w-px bg-black/10 sm:inline-block" aria-hidden="true" />
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/#${cat.id}`}
              className="text-stage-resume-700 hover:text-stage-resume-900"
              style={{ color: stages[cat.anchor]["700"] }}
            >
              {cat.title}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          aria-label="로그인 (S2 연동 예정)"
          disabled
          className="cursor-not-allowed rounded-md border border-black/10 px-3 py-1.5 text-xs font-medium text-stage-resume-700 opacity-60"
        >
          로그인 · S2
        </button>
      </div>
    </header>
  );
}
