"use client";

import { useLocale, useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/registry/components/language-switcher";
import { locales, sourceLocale } from "@/i18n/locales";

const ONE_YEAR = 60 * 60 * 24 * 365;
const siteLocales = locales.map((code) => ({ code }));

/** `pathname` in `locale`: `/docs/x` → `/ja/docs/x`; English has no prefix. */
export function pathInLocale(pathname: string, locale: string): string {
  const [, first = "", ...rest] = pathname.split("/");
  const bare = locales.includes(first) && first !== sourceLocale ? `/${rest.join("/")}` : pathname;
  if (locale === sourceLocale) return bare;
  return bare === "/" ? `/${locale}` : `/${locale}${bare}`;
}

/**
 * The site's language dropdown, built on our own LanguageSwitcher. Remembers
 * the choice in NEXT_LOCALE and reloads the same page in that language.
 */
export function SiteLanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const t = useTranslations("languageSwitcher");

  const change = (code: string) => {
    if (code === locale) return;
    document.cookie = `NEXT_LOCALE=${code}; path=/; max-age=${ONE_YEAR}; samesite=lax`;
    const { pathname, search, hash } = window.location;
    // A full load, not router.push: the root layout (<html lang dir>, messages)
    // only re-renders on a document request.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.assign(`${pathInLocale(pathname, code)}${search}${hash}`);
  };

  return (
    <LanguageSwitcher
      locales={siteLocales}
      value={locale}
      onValueChange={change}
      label="native"
      size="sm"
      variant="ghost"
      align="end"
      searchable={false}
      labels={{ listbox: t("listbox"), current: (name) => t("current", { name }) }}
      className={className}
    />
  );
}
