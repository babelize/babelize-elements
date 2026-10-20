"use client";

import { LocalePicker } from "@/registry/components/locale-picker";
import { regions } from "@/lib/elements-config";

export function LocalePickerDemo() {
  return (
    <LocalePicker
      regions={regions}
      defaultValue="en-IN"
      onValueChange={(locale) => console.log("Selected locale:", locale)}
      label="english" // native, english
      variant="outline" // outline, ghost, secondary
      size="default" // sm, default, lg
    />
  );
}
