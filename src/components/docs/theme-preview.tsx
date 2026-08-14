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
  { code: "en", label: "English", flag: "\u{1F1FA}\u{1F1F8}" },
  { code: "fr", label: "Fran\u00e7ais", flag: "\u{1F1EB}\u{1F1F7}" },
  { code: "es", label: "Espa\u00f1ol", flag: "\u{1F1EA}\u{1F1F8}" },
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
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-semibold text-black/80 dark:text-white/80">{theme.name}</h4>
          <p className="text-xs text-black/40 dark:text-white/40">{theme.description}</p>
        </div>
        {showToggle && (
          <button
            type="button"
            onClick={() => setIsDark(!isDark)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-2.5 py-1 text-xs text-black/50 dark:text-white/50 transition-colors hover:bg-black/10 dark:hover:bg-white/10"
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
      <div
        className="rounded-2xl border overflow-hidden"
        style={{
          background: vars["--background"],
          color: vars["--foreground"],
          borderColor: vars["--border"],
        }}
      >
        {/* Browser chrome */}
        <div
          className="flex items-center justify-between px-4 py-2.5 border-b"
          style={{ borderColor: vars["--border"] }}
        >
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-[#ff5f57]" />
            <span className="size-2 rounded-full bg-[#febc2e]" />
            <span className="size-2 rounded-full bg-[#28c840]" />
          </div>
          <div className="flex items-center gap-1.5 rounded-md px-2 py-0.5" style={{ background: vars["--muted"] }}>
            <svg className="size-2.5" style={{ color: vars["--muted-foreground"] }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5a17.92 17.92 0 0 1-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
            </svg>
            <span className="text-[10px]" style={{ color: vars["--muted-foreground"] }}>app.example.com</span>
          </div>
          <div className="w-12" />
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Nav */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="size-8 rounded-lg flex items-center justify-center text-xs font-bold"
                style={{ background: vars["--primary"], color: vars["--primary-foreground"] }}
              >
                B
              </div>
              <div className="space-y-1">
                <div className="h-2 w-20 rounded" style={{ background: vars["--foreground"] }} />
                <div className="h-1.5 w-14 rounded" style={{ background: vars["--muted-foreground"] }} />
              </div>
            </div>
            <div
              className="h-7 px-3 rounded-lg text-[10px] font-medium flex items-center"
              style={{ background: vars["--primary"], color: vars["--primary-foreground"] }}
            >
              Get Started
            </div>
          </div>

          {/* Hero */}
          <div className="space-y-2 py-2">
            <div className="h-3 w-48 rounded" style={{ background: vars["--foreground"] }} />
            <div className="h-2 w-36 rounded" style={{ background: vars["--muted-foreground"] }} />
          </div>

          {/* Cards */}
          <div className="grid grid-cols-2 gap-3">
            {["Feature 1", "Feature 2"].map((f) => (
              <div
                key={f}
                className="rounded-xl p-3 border space-y-2"
                style={{ background: vars["--card"], borderColor: vars["--border"] }}
              >
                <div className="size-6 rounded-md" style={{ background: vars["--primary"] }} />
                <div className="h-2 w-16 rounded" style={{ background: vars["--foreground"] }} />
                <div className="h-1.5 w-20 rounded" style={{ background: vars["--muted-foreground"] }} />
              </div>
            ))}
          </div>

          {/* Language Switcher */}
          <div className="pt-1">
            <LanguageSwitcher
              locale={locale}
              locales={previewLocales}
              onLocaleChange={setLocale}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
