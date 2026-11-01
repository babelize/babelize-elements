import type { MetadataRoute } from "next";
import { source } from "@/lib/source";

const siteUrl = "https://elements.babelize.co";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${siteUrl}/`, changeFrequency: "weekly", priority: 1 },
    ...source
      .getLanguages()
      .flatMap(({ pages }) => pages)
      .map((page) => ({
        url: `${siteUrl}${page.url}`,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
  ];
}
