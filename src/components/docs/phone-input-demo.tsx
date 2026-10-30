"use client";

import { useState } from "react";
import { PhoneInput } from "@/registry/components/phone-input";

export function PhoneInputDemo() {
  const [e164, setE164] = useState("");
  return (
    <div className="w-full max-w-xs space-y-2">
      <PhoneInput
        defaultCountry="US"
        placeholder="(555) 000-0000"
        preferredCountries={["IN", "GB"]} // pinned above the full list
        validate // marks a malformed number aria-invalid
        onValueChange={(phone, country) => console.log("Phone:", country.dialCode, phone)}
        onValidityChange={(valid, value) => setE164(valid ? value : "")}
        size="default" // sm, default, lg
        className="w-full"
      />
      <p className="text-xs text-muted-foreground">
        {e164 ? `E.164: ${e164}` : "Type a phone number"}
      </p>
    </div>
  );
}
