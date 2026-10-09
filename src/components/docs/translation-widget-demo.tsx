"use client";

import { useState } from "react";
import { TranslationWidget, type Locale } from "@/registry/components/translation-widget";

const locales: Locale[] = [
  { code: "en" },
  { code: "fr" },
  { code: "es" },
  { code: "de" },
  { code: "hi" },
  { code: "ja" },
  { code: "ar" },
];

const greetings: Record<string, string> = {
  en: "Hello, world!",
  fr: "Bonjour, le monde !",
  es: "¡Hola, mundo!",
  de: "Hallo, Welt!",
  hi: "नमस्ते, दुनिया!",
  ja: "こんにちは、世界！",
  ar: "مرحبا بالعالم!",
};

export function TranslationWidgetDemo() {
  const [sourceLocale, setSourceLocale] = useState("en");
  const [targetLocale, setTargetLocale] = useState("fr");
  const [source, setSource] = useState(greetings.en);
  const [target, setTarget] = useState(greetings.fr);

  return (
    <TranslationWidget
      locales={locales}
      sourceLocale={sourceLocale}
      targetLocale={targetLocale}
      onSourceLocaleChange={(code) => {
        setSourceLocale(code);
        setSource(greetings[code] ?? source);
      }}
      onTargetLocaleChange={(code) => {
        setTargetLocale(code);
        setTarget(greetings[code] ?? target);
      }}
      sourceText={source}
      onSourceChange={setSource}
      targetText={target}
      onTargetChange={setTarget}
      sourcePlaceholder="Source text"
      targetPlaceholder="Translation"
    />
  );
}
