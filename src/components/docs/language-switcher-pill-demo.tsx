"use client";

import { LanguageSwitcherPill } from "@/registry/components/language-switcher-pill";
import { pillLocales } from "@/lib/elements-config";

export function LanguageSwitcherPillDemo() {
  return (
    <LanguageSwitcherPill
      locales={pillLocales}
      defaultLocale="en"
      onLocaleChange={(code) => console.log("Selected locale:", code)}
      variant="default" // default, outline
      size="default" // sm, default, lg
    />
  );
}
