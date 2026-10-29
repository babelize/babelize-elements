import { createMDX } from "fumadocs-mdx/next";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      // There is no docs index page; the footer and navbar link to /docs.
      { source: "/docs", destination: "/docs/getting-started", permanent: true },
      // The formatters (LocaleNumber, RelativeTime) were removed in #72; their old
      // docs URLs are still known to search engines.
      {
        source: "/docs/components/formatters/:path*",
        destination: "/docs/components",
        permanent: true,
      },
    ];
  },
};

const withMDX = createMDX();

export default withMDX(nextConfig);
