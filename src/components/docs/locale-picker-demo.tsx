"use client";

import { useState } from "react";
import { LocalePicker } from "@/registry/components/locale-picker";

export function LocalePickerDemo() {
  const [locale, setLocale] = useState("en-IN");

  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <LocalePicker
        regions={["IN", "US", "GB", "DE", "JP"]} // ISO 3166-1 alpha-2 codes
        defaultValue="en-IN" // omit for uncontrolled, use value instead
        onValueChange={setLocale} // receives the full BCP 47 tag, e.g. "en-US"
      />
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        Selected locale: <code>{locale}</code>
      </p>
    </div>
  );
}
