"use client";

import { LanguageSwitcher } from "@/registry/components/language-switcher";
import { locales } from "@/lib/elements-config";

export function LanguageSwitcherDemo() {
  return (
    <LanguageSwitcher
      locales={locales}
      defaultValue="en"
      onValueChange={(code) => console.log("Selected locale:", code)}
      label="native" // native, english
      variant="outline" // outline, ghost, secondary
      size="default" // sm, default, lg
      showFlags
    />
  );
}
