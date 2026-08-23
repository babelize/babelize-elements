"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { LanguageSwitcher, type Locale } from "@/registry/components/language-switcher";

const locales: Locale[] = [
  { code: "en" },
  { code: "fr" },
  { code: "es" },
  { code: "de" },
  { code: "ja" },
  { code: "ar" },
];

const greetings: Record<string, string> = {
  en: "Hello, world!",
  fr: "Bonjour, le monde !",
  es: "\u00a1Hola, mundo!",
  de: "Hallo, Welt!",
  ja: "\u4eca\u65e5\u306f\u4e16\u754c\uff01",
  ar: "\u0645\u0631\u062d\u0628\u0627 \u0628\u0627\u0644\u0639\u0627\u0644\u0645!",
};

export function LanguageSwitcherDemo() {
  const [locale, setLocale] = useState("en");
  const [previewDark, setPreviewDark] = useState(true);

  return (
    <div className="space-y-0">
      <div className="flex items-center justify-between rounded-t-2xl border border-b-0 border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] px-3 py-2">
        <span className="font-mono text-xs text-black/40 dark:text-white/40">
          language-switcher
        </span>

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

      <div
        className={cn(
          "relative overflow-visible rounded-b-2xl border border-t-0 shadow-2xl transition-colors",
          previewDark && "dark",
          "bg-white text-zinc-900 border-zinc-200 dark:bg-zinc-950 dark:text-zinc-50 dark:border-zinc-800"
        )}
      >
        <div className="relative flex flex-col items-center justify-center gap-8 px-6 py-16 sm:px-12">
          <div className="relative z-50">
            <LanguageSwitcher
              locales={locales}
              defaultValue="en"
              onValueChange={setLocale}
              showFlags
            />
          </div>

          <div className="relative z-10 text-center">
            <p className="text-4xl font-bold tracking-tight sm:text-5xl text-zinc-900 dark:text-zinc-50">
              {greetings[locale] ?? "Hello, world!"}
            </p>
            <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
              locale:{" "}
              <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50">
                {locale}
              </code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}