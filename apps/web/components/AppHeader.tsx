import Link from "next/link";
import { categories, stageLabels, stageSlug } from "@/lib/stages-config";
import { AuthMenu } from "@/components/AuthMenu";

/**
 * Top navigation. Monotone — links share the same neutral text token
 * regardless of the destination stage. Per DESIGN.md v2 (2026-04-29)
 * the surface no longer color-codes by category.
 */
export function AppHeader() {
  return (
    <header className="border-b border-stage-resume-100 bg-white">
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
            className="text-stage-resume-700 hover:text-stage-resume-900"
          >
            {stageLabels.todo.ko}
          </Link>
          <Link
            href={`/${stageSlug.blog}`}
            className="text-stage-resume-700 hover:text-stage-resume-900"
          >
            {stageLabels.blog.ko}
          </Link>
          <span
            className="hidden h-3 w-px bg-stage-resume-100 sm:inline-block"
            aria-hidden="true"
          />
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/#${cat.id}`}
              className="text-stage-resume-700 hover:text-stage-resume-900"
            >
              {cat.title}
            </Link>
          ))}
        </nav>

        <AuthMenu />
      </div>
    </header>
  );
}
