import { locales, sourceLocale } from "@/i18n/locales";

/** `pathname` in `locale`: `/docs/x` → `/ja/docs/x`; English has no prefix. */
export function pathInLocale(pathname: string, locale: string): string {
  const [, first = "", ...rest] = pathname.split("/");
  const bare = locales.includes(first) && first !== sourceLocale ? `/${rest.join("/")}` : pathname;
  if (locale === sourceLocale) return bare;
  return bare === "/" ? `/${locale}` : `/${locale}${bare}`;
}

/** Open Graph `og:locale` per site locale. */
export const OG_LOCALE: Record<string, string> = {
  en: "en_US",
  es: "es_ES",
  ja: "ja_JP",
  ar: "ar_AR",
};

/** The Open Graph fields every page shares, for `locale`; pages add their own url, title and description. */
export function baseOpenGraph(locale: string) {
  return {
    type: "website" as const,
    siteName: "Babelize Elements",
    locale: OG_LOCALE[locale] ?? OG_LOCALE.en,
    alternateLocale: Object.entries(OG_LOCALE)
      .filter(([code]) => code !== locale)
      .map(([, og]) => og),
  };
}

/**
 * hreflang alternates for a page that exists in `available` locales (default:
 * all), English as `x-default`. Paths are relative to metadataBase.
 */
export function languageAlternates(
  pathname: string,
  available: readonly string[] = locales,
): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of available) languages[locale] = pathInLocale(pathname, locale);
  languages["x-default"] = pathInLocale(pathname, sourceLocale);
  return languages;
}
