"use client";

import { TranslationWidget } from "@/registry/components/translation-widget";
import { locales, translation } from "@/lib/elements-config";

export function TranslationWidgetDemo() {
  return (
    <TranslationWidget
      locales={locales}
      defaultSourceLocale="en"
      defaultTargetLocale="fr"
      defaultSourceText={translation.source}
      defaultTargetText={translation.target}
      onSourceChange={(text) => console.log("Source:", text)}
      maxLength={500}
      className="max-w-3xl"
    />
  );
}
