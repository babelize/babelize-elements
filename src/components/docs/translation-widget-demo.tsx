"use client";

import { useState } from "react";
import { TranslationWidget } from "@/registry/components/translation-widget";

export function TranslationWidgetDemo() {
  const [target, setTarget] = useState("");

  return (
    <TranslationWidget
      sourceLocale="en"
      targetLocale="fr"
      sourceText="Hello, world!"
      targetText={target}
      onTargetChange={setTarget}
      sourcePlaceholder="Source text"
      targetPlaceholder="Translation"
    />
  );
}
