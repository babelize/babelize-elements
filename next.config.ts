import { createMDX } from "fumadocs-mdx/next";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      // There is no docs index page; the footer and navbar link to /docs.
      { source: "/docs", destination: "/docs/getting-started", permanent: true },
    ];
  },
};

const withMDX = createMDX();

export default withMDX(nextConfig);
