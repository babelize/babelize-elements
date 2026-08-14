"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { LanguageSwitcher, type Locale } from "@/registry/components/language-switcher";

const locales: Locale[] = [
  { code: "en", label: "English", flag: "\u{1F1FA}\u{1F1F8}" },
  { code: "fr", label: "Fran\u00e7ais", flag: "\u{1F1EB}\u{1F1F7}" },
  { code: "es", label: "Espa\u00f1ol", flag: "\u{1F1EA}\u{1F1F8}" },
  { code: "de", label: "Deutsch", flag: "\u{1F1E9}\u{1F1EA}" },
  { code: "ja", label: "\u65E5\u672C\u8A9E", flag: "\u{1F1EF}\u{1F1F5}" },
  { code: "ar", label: "\u0627\u0644\u0639\u0631\u0628\u064A\u0629", flag: "\u{1F1F8}\u{1F1E6}", rtl: true },
];

const greetings: Record<string, string> = {
  en: "Hello, world!",
  fr: "Bonjour, le monde !",
  es: "\u00a1Hola, mundo!",
  de: "Hallo, Welt!",
  ja: "\u4eca\u65e5\u306f\u4e16\u754c\uff01",
  ar: "\u0645\u0631\u062d\u0628\u0627 \u0628\u0627\u0644\u0639\u0627\u0644\u0645!",
};

function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="inline-flex items-center gap-1.5 rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-3 py-1.5 text-xs font-medium text-black/60 dark:text-white/60 transition-colors hover:bg-black/10 dark:hover:bg-white/10 hover:text-black dark:hover:text-white"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      <svg className="size-3.5 hidden dark:block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
      </svg>
      <svg className="size-3.5 block dark:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
      </svg>
      {theme === "dark" ? "Light" : "Dark"}
    </button>
  );
}

export function LanguageSwitcherDemo() {
  const [locale, setLocale] = useState("en");
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="relative overflow-visible rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-[#f9f9f9] dark:bg-[#09090b] shadow-2xl">
      {/* Browser chrome */}
      <div className="flex items-center justify-between border-b border-black/[0.06] dark:border-white/[0.06] bg-black/[0.02] dark:bg-white/[0.02] px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="size-3 rounded-full bg-[#ff5f57]" />
          <span className="size-3 rounded-full bg-[#febc2e]" />
          <span className="size-3 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-black/[0.06] dark:border-white/[0.06] bg-black/[0.03] dark:bg-white/[0.03] px-3 py-1">
          <svg className="size-3 text-black/20 dark:text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5a17.92 17.92 0 0 1-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
          </svg>
          <span className="text-xs text-black/30 dark:text-white/30">elements.babelize.co/docs/language-switcher</span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <div className="w-16" />
        </div>
      </div>

      {/* Preview content */}
      <div className="relative flex flex-col items-center justify-center gap-8 px-6 py-16 sm:px-12">
        {/* Subtle grid background */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.015]"
          style={{
            backgroundImage: `radial-gradient(circle, ${isDark ? "white" : "black"} 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }}
        />

        {/* Glow */}
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-emerald-500/10 blur-[100px]" />

        {/* The component */}
        <div className="relative z-50">
          <LanguageSwitcher
            locale={locale}
            locales={locales}
            onLocaleChange={setLocale}
          />
        </div>

        {/* Result */}
        <div className="relative z-10 text-center">
          <p className="text-4xl font-bold tracking-tight text-black dark:text-white sm:text-5xl">
            {greetings[locale] ?? "Hello, world!"}
          </p>
          <p className="mt-3 text-sm text-black/40 dark:text-white/30">
            locale: <code className="rounded bg-black/5 dark:bg-white/5 px-1.5 py-0.5 font-mono text-emerald-600 dark:text-emerald-400">{locale}</code>
          </p>
        </div>
      </div>
    </div>
  );
}
