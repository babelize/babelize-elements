import type { MetadataRoute } from "next";
import { source } from "@/lib/source";
import { locales } from "@/i18n/locales";
import { languageAlternates, pathInLocale } from "@/lib/locale-path";

const siteUrl = "https://elements.babelize.co";

/** Absolute URL as the pages' canonicals write it (the home page without a trailing slash). */
const absolute = (path: string) => (path === "/" ? siteUrl : `${siteUrl}${path}`);
const absoluteAll = (languages: Record<string, string>) =>
  Object.fromEntries(Object.entries(languages).map(([l, path]) => [l, absolute(path)]));

/** Every page in every language it exists in, each listing the others as alternates. */
export default function sitemap(): MetadataRoute.Sitemap {
  const landing = languageAlternates("/");
  const entries: MetadataRoute.Sitemap = locales.map((locale) => ({
    url: absolute(pathInLocale("/", locale)),
    changeFrequency: "weekly",
    priority: 1,
    alternates: { languages: absoluteAll(landing) },
  }));

  for (const page of source.getPages()) {
    const available = locales.filter((l) => source.getPage(page.slugs, l)?.locale === l);
    const languages = absoluteAll(languageAlternates(page.url, available));
    for (const locale of available) {
      entries.push({
        url: absolute(pathInLocale(page.url, locale)),
        changeFrequency: "weekly",
        priority: 0.8,
        alternates: { languages },
      });
    }
  }
  return entries;
}
