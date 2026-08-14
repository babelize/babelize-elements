"use client";

import { useState } from "react";
import { LanguageSwitcher, type Locale } from "@/registry/components/language-switcher";

const locales: Locale[] = [
  { code: "en", label: "English", flag: "\u{1F1FA}\u{1F1F8}" },
  { code: "fr", label: "Fran\u00e7ais", flag: "\u{1F1EB}\u{1F1F7}" },
  { code: "es", label: "Espa\u00f1ol", flag: "\u{1F1EA}\u{1F1F8}" },
  { code: "de", label: "Deutsch", flag: "\u{1F1E9}\u{1F1EA}" },
  { code: "ja", label: "\u65E5\u672C\u8A9E", flag: "\u{1F1EF}\u{1F1F5}" },
  { code: "ar", label: "\u0627\u0644\u0639\u0631\u0628\u064A\u0629", flag: "\u{1F1F8}\u{1F1E6}", rtl: true },
];

export function LanguageSwitcherDemo() {
  const [locale, setLocale] = useState("en");

  return (
    <div className="flex flex-col items-center gap-6 rounded-xl border border-white/10 bg-[#0A0A0A] p-8">
      <LanguageSwitcher
        locale={locale}
        locales={locales}
        onLocaleChange={setLocale}
      />
      <div className="text-center">
        <p className="text-sm text-white/40">
          Current locale: <span className="font-mono text-emerald-400">{locale}</span>
        </p>
      </div>
    </div>
  );
}
