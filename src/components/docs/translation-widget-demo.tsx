"use client";

import { useState } from "react";
import { TranslationWidget } from "@/registry/components/translation-widget";

const greetings: Record<string, string> = {
  fr: "Bonjour, le monde !",
  ar: "!مرحبا بالعالم",
};

export function TranslationWidgetDemo() {
  const [fr, setFr] = useState(greetings.fr);
  const [ar, setAr] = useState(greetings.ar);

  return (
    <div className="space-y-6">
      <TranslationWidget
        sourceLocale="en"
        targetLocale="fr"
        sourceText="Hello, world!"
        targetText={fr}
        onTargetChange={setFr}
        sourcePlaceholder="Source text"
        targetPlaceholder="Translation"
      />

      <TranslationWidget
        sourceLocale="en"
        targetLocale="ar"
        sourceText="Hello, world!"
        targetText={ar}
        onTargetChange={setAr}
        sourcePlaceholder="Source text"
        targetPlaceholder="Translation"
      />
    </div>
  );
}
