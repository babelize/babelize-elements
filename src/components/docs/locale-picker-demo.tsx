"use client";

import { LocalePicker } from "@/registry/components/locale-picker";

export function LocalePickerDemo() {
  return (
    <LocalePicker
      regions={["IN", "US", "GB", "DE", "JP"]} // your ISO 3166-1 alpha-2 regions
      defaultValue="en-IN"
      onValueChange={(locale) => console.log("Selected locale:", locale)}
      label="english" // native, english
      variant="outline" // outline, ghost, secondary
      size="default" // sm, default, lg
    />
  );
}
