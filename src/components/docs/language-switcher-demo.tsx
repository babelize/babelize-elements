"use client";

import { useState } from "react";
import { LanguageSwitcher, type Locale } from "@/registry/components/language-switcher";

const locales: Locale[] = [
  { code: "en" },
  { code: "fr" },
  { code: "es" },
  { code: "de" },
  { code: "ja" },
  { code: "ar" },
];

const greetings: Record<string, string> = {
  en: "Hello, world!",
  fr: "Bonjour, le monde !",
  es: "¡Hola, mundo!",
  de: "Hallo, Welt!",
  ja: "今日は世界！",
  ar: "مرحبا بالعالم!",
};

export function LanguageSwitcherDemo() {
  const [locale, setLocale] = useState("en");

  return (
    <>
      <LanguageSwitcher
        locales={locales}
        defaultValue="en"
        onValueChange={setLocale}
        showFlags // flag emoji next to each locale
      />

      <p className="text-4xl font-bold tracking-tight sm:text-5xl">{greetings[locale]}</p>
    </>
  );
}
