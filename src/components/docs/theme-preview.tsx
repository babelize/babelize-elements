"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { LanguageSwitcher, type Locale } from "@/registry/components/language-switcher";

export interface ThemeDefinition {
  name: string;
  description: string;
  colors: {
    light: Record<string, string>;
    dark: Record<string, string>;
  };
}

const previewLocales: Locale[] = [
  { code: "en" },
  { code: "fr" },
  { code: "es" },
];

export function ThemePreview({
  theme,
  defaultDark = false,
  showToggle = true,
  compact = false,
}: {
  theme: ThemeDefinition;
  defaultDark?: boolean;
  showToggle?: boolean;
  compact?: boolean;
}) {
  const [isDark, setIsDark] = useState(defaultDark);
  const [locale, setLocale] = useState("en");
  const vars = isDark ? theme.colors.dark : theme.colors.light;

  if (compact) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-black/70 dark:text-white/70">{theme.name}</span>
          {showToggle && (
            <button
              type="button"
              onClick={() => setIsDark(!isDark)}
              className="inline-flex items-center gap-1 rounded-md border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-2 py-0.5 text-[10px] text-black/50 dark:text-white/50 transition-colors hover:bg-black/10 dark:hover:bg-white/10"
            >
              {isDark ? (
                <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                </svg>
              ) : (
                <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                </svg>
              )}
              {isDark ? "Light" : "Dark"}
            </button>
          )}
        </div>
        <div
          className="rounded-xl border overflow-hidden"
          style={{
            background: vars["--background"],
            color: vars["--foreground"],
            borderColor: vars["--border"],
          }}
        >
          <div className="p-4 space-y-3">
            {/* Mini nav */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="size-5 rounded" style={{ background: vars["--primary"] }} />
                <div className="h-1.5 w-12 rounded" style={{ background: vars["--foreground"] }} />
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-4 w-8 rounded" style={{ background: vars["--muted"] }} />
                <div
                  className="h-4 px-2 rounded text-[8px] flex items-center"
                  style={{ background: vars["--primary"], color: vars["--primary-foreground"] }}
                >
                  Go
                </div>
              </div>
            </div>
            {/* Mini card */}
            <div
              className="rounded-lg p-2.5 border space-y-1.5"
              style={{ background: vars["--card"], borderColor: vars["--border"] }}
            >
              <div className="h-2 w-20 rounded" style={{ background: vars["--primary"] }} />
              <div className="h-1.5 w-28 rounded" style={{ background: vars["--muted-foreground"] }} />
              <div className="flex gap-1.5 pt-0.5">
                <div className="h-4 w-10 rounded text-[7px] flex items-center justify-center" style={{ background: vars["--primary"], color: vars["--primary-foreground"] }}>OK</div>
                <div className="h-4 w-8 rounded text-[7px] flex items-center justify-center" style={{ background: vars["--secondary"], color: vars["--secondary-foreground"] }}>No</div>
              </div>
            </div>
            {/* Color dots */}
            <div className="flex gap-1">
              <div className="size-3 rounded-full" style={{ background: vars["--primary"] }} />
              <div className="size-3 rounded-full" style={{ background: vars["--secondary"] }} />
              <div className="size-3 rounded-full" style={{ background: vars["--accent"] }} />
              <div className="size-3 rounded-full" style={{ background: vars["--destructive"] }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-900 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-black/20 dark:hover:border-white/20">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-black/5 dark:border-white/5">
        <div>
          <h4 className="text-sm font-semibold text-black/80 dark:text-white/80">{theme.name}</h4>
          <p className="text-xs text-black/40 dark:text-white/40 mt-0.5">{theme.description}</p>
        </div>
        {showToggle && (
          <button
            type="button"
            onClick={() => setIsDark(!isDark)}
            className="inline-flex items-center gap-1.5 rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-3 py-1.5 text-xs text-black/50 dark:text-white/50 transition-all hover:bg-black/10 dark:hover:bg-white/10 hover:text-black/70 dark:hover:text-white/70"
          >
            {isDark ? (
              <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
              </svg>
            ) : (
              <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
              </svg>
            )}
            {isDark ? "Light" : "Dark"}
          </button>
        )}
      </div>

      {/* Preview */}
      <div
        className="p-6 transition-colors duration-300"
        style={{
          background: vars["--background"],
          color: vars["--foreground"],
        }}
      >
        {/* Mini nav */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div
              className="size-7 rounded-lg flex items-center justify-center text-[10px] font-bold"
              style={{ background: vars["--primary"], color: vars["--primary-foreground"] }}
            >
              B
            </div>
            <div className="space-y-1">
              <div className="h-2 w-16 rounded" style={{ background: vars["--foreground"] }} />
              <div className="h-1.5 w-10 rounded" style={{ background: vars["--muted-foreground"] }} />
            </div>
          </div>
          <div
            className="h-6 px-2.5 rounded-md text-[9px] font-medium flex items-center"
            style={{ background: vars["--primary"], color: vars["--primary-foreground"] }}
          >
            Get Started
          </div>
        </div>

        {/* Hero text */}
        <div className="mb-5 space-y-2">
          <div className="h-3 w-40 rounded" style={{ background: vars["--foreground"] }} />
          <div className="h-2 w-28 rounded" style={{ background: vars["--muted-foreground"] }} />
        </div>

        {/* Cards */}
        <div className="grid grid-cols-2 gap-2.5 mb-5">
          {["Feature 1", "Feature 2"].map((f) => (
            <div
              key={f}
              className="rounded-xl p-3 border space-y-2"
              style={{ background: vars["--card"], borderColor: vars["--border"] }}
            >
              <div className="size-5 rounded-md" style={{ background: vars["--primary"] }} />
              <div className="h-2 w-14 rounded" style={{ background: vars["--foreground"] }} />
              <div className="h-1.5 w-18 rounded" style={{ background: vars["--muted-foreground"] }} />
            </div>
          ))}
        </div>

        {/* Language Switcher */}
        <div className="flex justify-center">
          <LanguageSwitcher
            locales={previewLocales}
            defaultValue="en"
            onValueChange={setLocale}
          />
        </div>
      </div>

      {/* Color palette footer */}
      <div className="flex items-center gap-2 px-5 py-3 border-t border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02]">
        <div className="flex gap-1.5">
          <div className="size-4 rounded-full border border-black/10 dark:border-white/10" style={{ background: vars["--primary"] }} />
          <div className="size-4 rounded-full border border-black/10 dark:border-white/10" style={{ background: vars["--secondary"] }} />
          <div className="size-4 rounded-full border border-black/10 dark:border-white/10" style={{ background: vars["--accent"] }} />
          <div className="size-4 rounded-full border border-black/10 dark:border-white/10" style={{ background: vars["--muted"] }} />
          <div className="size-4 rounded-full border border-black/10 dark:border-white/10" style={{ background: vars["--destructive"] }} />
        </div>
        <span className="text-[10px] text-black/30 dark:text-white/30 ml-auto">
          {isDark ? "Dark" : "Light"} mode
        </span>
      </div>
    </div>
  );
}
