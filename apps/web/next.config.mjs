/** @type {import('next').NextConfig} */
const basePath = process.env.NEXT_BASE_PATH ?? "";

const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@career/design-tokens", "@career/schema"],
  output: "export",
  // GitHub Pages serves the project at /<repo>/ — basePath + assetPrefix keep
  // links and static assets correct. Empty when deployed at a domain root.
  basePath,
  assetPrefix: basePath || undefined,
  // GitHub Pages has no Image Optimization endpoint; tell next/image to skip it.
  images: { unoptimized: true },
  // Static export requires deterministic file names — disable RSC payload routes.
  trailingSlash: true,
};

export default nextConfig;
