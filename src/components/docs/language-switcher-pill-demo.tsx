"use client";

import * as React from "react";

import { LanguageSwitcherPill } from "@/registry/components/language-switcher-pill";

const locales = [
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
  { code: "ja", label: "日本語" },
  { code: "ar", label: "العربية", rtl: true },
];

export function LanguageSwitcherPillDemo() {
  const [locale, setLocale] = React.useState("en");

  return (
    <div className="flex min-h-[180px] items-center justify-center">
      <LanguageSwitcherPill locales={locales} locale={locale} onLocaleChange={setLocale} />
    </div>
  );
}
