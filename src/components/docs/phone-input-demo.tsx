"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { PhoneInput } from "@/registry/components/phone-input";
import { CodeBlock } from "./code-block";
import { ThemeDropdown, type ThemeName } from "./theme-dropdown";

const CODE_SNIPPET = `"use client";

import { PhoneInput } from "@babelize/elements";

export default function App() {
  return (
    <PhoneInput
      defaultCountry="US"
      placeholder="Enter phone number"
      onChange={(phone, country) => console.log(phone, country.dialCode)}
    />
  );
}`;

export function PhoneInputDemo() {
  const [previewDark, setPreviewDark] = useState(true);
  const [theme, setTheme] = useState<ThemeName>("emerald");
  const [tab, setTab] = useState<"preview" | "code">("preview");

  return (
    <div className="space-y-0">
      <div className="flex items-center justify-between rounded-t-2xl border border-b-0 border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] px-3 py-2">
        <div className="flex items-center gap-0.5 rounded-lg bg-black/5 dark:bg-white/5 p-0.5">
          <button
            type="button"
            onClick={() => setTab("preview")}
            className={cn(
              "rounded-md px-3 py-1 text-xs font-medium transition-colors",
              tab === "preview"
                ? "bg-white dark:bg-[#111] text-black/80 dark:text-white/80 shadow-sm"
                : "text-black/40 dark:text-white/40 hover:text-black/60 dark:hover:text-white/60",
            )}
          >
            Preview
          </button>
          <button
            type="button"
            onClick={() => setTab("code")}
            className={cn(
              "rounded-md px-3 py-1 text-xs font-medium transition-colors",
              tab === "code"
                ? "bg-white dark:bg-[#111] text-black/80 dark:text-white/80 shadow-sm"
                : "text-black/40 dark:text-white/40 hover:text-black/60 dark:hover:text-white/60",
            )}
          >
            Code
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <ThemeDropdown value={theme} onChange={setTheme} />
          <button
            type="button"
            onClick={() => setPreviewDark(!previewDark)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-2.5 py-1.5 text-xs font-medium text-black/50 dark:text-white/50 transition-colors hover:bg-black/10 dark:hover:bg-white/10 hover:text-black dark:hover:text-white"
          >
            {previewDark ? (
              <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
              </svg>
            ) : (
              <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
              </svg>
            )}
            {previewDark ? "Light" : "Dark"}
          </button>
        </div>
      </div>

      {tab === "preview" ? (
        <div
          className={cn(
            "relative overflow-visible rounded-b-2xl border border-t-0 shadow-2xl transition-colors",
            `theme-${theme}`,
            previewDark && "dark",
            "bg-background text-foreground border-border"
          )}
        >
          <div className="relative flex flex-col items-center justify-center gap-8 px-6 py-16 sm:px-12">
            <div className="relative z-50">
              <PhoneInput
                defaultCountry="US"
                placeholder="Enter phone number"
              />
            </div>

            <div className="relative z-10 text-center">
              <p className="text-sm text-muted-foreground">
                Enter your phone number with country code
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-b-2xl border border-t-0 border-black/10 dark:border-white/10 bg-[#0A0A0A] p-4">
          <CodeBlock code={CODE_SNIPPET} lang="tsx" />
        </div>
      )}
    </div>
  );
}
