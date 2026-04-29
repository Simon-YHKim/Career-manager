import Link from "next/link";
import type { CategoryDef } from "@/lib/stages-config";

type Props = {
  category: CategoryDef | null;
  current: string;
};

export function Breadcrumb({ category, current }: Props) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="font-mono text-[11px] uppercase tracking-widest text-stage-resume-700"
    >
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <Link href="/" className="hover:text-stage-resume-900">
            Home
          </Link>
        </li>
        {category && (
          <>
            <li aria-hidden="true">/</li>
            <li>
              <Link
                href={`/#${category.id}`}
                className="hover:text-stage-resume-900"
              >
                {category.title}
              </Link>
            </li>
          </>
        )}
        <li aria-hidden="true">/</li>
        <li aria-current="page" className="text-stage-resume-900">
          {current}
        </li>
      </ol>
    </nav>
  );
}
