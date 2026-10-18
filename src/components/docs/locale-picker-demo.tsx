"use client";

import { LocalePicker } from "@/registry/components/locale-picker";

export function LocalePickerDemo() {
  return (
    <LocalePicker
      regions={["IN", "US", "GB", "DE", "JP"]}
      defaultValue="en-IN"
      onValueChange={(locale) => console.log(locale)}
    />
  );
}
