"use client";

import { PhoneInput } from "@/registry/components/phone-input";

export function PhoneInputDemo() {
  return (
    <PhoneInput
      defaultCountry="US"
      placeholder="(555) 000-0000"
      onValueChange={(phone, country) => console.log("Phone:", country.dialCode, phone)}
      size="default" // sm, default, lg
      className="w-full max-w-xs"
    />
  );
}
