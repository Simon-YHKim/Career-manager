import { NextResponse } from "next/server";

// Static-friendly so `next build` with `output: "export"` succeeds for
// GitHub Pages. The values are baked at build time — not live. For a true
// liveness probe (Vercel / Fly), revert to `dynamic = "force-dynamic"`
// once we deploy to a server target.
export const dynamic = "force-static";

const commit =
  process.env.VERCEL_GIT_COMMIT_SHA ??
  process.env.GIT_COMMIT_SHA ??
  process.env.GITHUB_SHA ??
  null;

const version = process.env.npm_package_version ?? null;
const builtAt = new Date().toISOString();

export function GET() {
  return NextResponse.json({
    status: "ok",
    commit,
    version,
    builtAt,
  });
}
