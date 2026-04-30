import Link from "next/link";
import { AuthMenu } from "@/components/AuthMenu";

/**
 * Top navigation. Intentionally minimal — the dashboard surfaces the
 * primary destinations (Q&A · 블로그 · 리멤버 · LinkedIn at the top,
 * categories at the bottom). The header keeps only the logo + auth widget
 * so the dashboard can fit a single viewport without scroll.
 */
export function AppHeader() {
  return (
    <header className="border-b border-stage-resume-100 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link
          href="/"
          className="font-semibold tracking-tight text-stage-resume-900"
        >
          Career Manager
        </Link>
        <AuthMenu />
      </div>
    </header>
  );
}
