"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface Locale {
  /** ISO 639-1 / BCP 47 code (e.g. "en", "fr-FR", "ar-SA") */
  code: string;
  /** Display name in its native language */
  label: string;
  /** Optional flag emoji */
  flag?: string;
  /** Set true for RTL locales */
  rtl?: boolean;
}

export interface LanguageSwitcherThemeColors {
  /** Button background */
  btnBg: string;
  /** Button border */
  btnBorder: string;
  /** Button text */
  btnText: string;
  /** Chevron and muted icon color */
  iconColor: string;
  /** Dropdown background */
  dropdownBg: string;
  /** Dropdown border */
  dropdownBorder: string;
  /** Dropdown item text */
  itemText: string;
  /** Dropdown item hover background */
  itemHoverBg: string;
  /** Dropdown item hover text */
  itemHoverText: string;
  /** Active item background */
  activeBg: string;
  /** Active item text */
  activeText: string;
  /** Search input background */
  inputBg: string;
  /** Search input text */
  inputText: string;
  /** Search input placeholder */
  inputPlaceholder: string;
  /** Search border */
  inputBorder: string;
  /** No results text */
  noResultsText: string;
}

export interface LanguageSwitcherProps {
  /** Current active locale code */
  locale: string;
  /** Array of available locales */
  locales: Locale[];
  /** Callback when locale changes */
  onLocaleChange: (code: string) => void;
  /** Additional CSS classes */
  className?: string;
  /** Theme colors — when provided, component uses inline styles instead of Tailwind dark: variants */
  themeColors?: LanguageSwitcherThemeColors;
}

const RTL_LOCALES = new Set(["ar", "he", "fa", "ur", "ps", "sd", "yi"]);

function isRtl(code: string): boolean {
  const lang = code.split("-")[0].toLowerCase();
  return RTL_LOCALES.has(lang);
}

/**
 * Dropdown language switcher with searchable locale list.
 *
 * @example
 * ```tsx
 * <LanguageSwitcher
 *   locale="en"
 *   locales={[
 *     { code: "en", label: "English", flag: "🇺🇸" },
 *     { code: "fr", label: "Français", flag: "🇫🇷" },
 *     { code: "ar", label: "العربية", flag: "🇸🇦", rtl: true },
 *   ]}
 *   onLocaleChange={(code) => router.push(`/${code}`)}
 * />
 * ```
 */
export function LanguageSwitcher({
  locale,
  locales,
  onLocaleChange,
  className,
  themeColors,
}: LanguageSwitcherProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const ref = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const activeLocale = locales.find((l) => l.code === locale);

  const filtered = locales.filter(
    (l) =>
      l.label.toLowerCase().includes(search.toLowerCase()) ||
      l.code.toLowerCase().includes(search.toLowerCase()),
  );

  const dir = isRtl(locale) ? "rtl" : "ltr";
  const hasTheme = !!themeColors;
  const tc = themeColors;

  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  React.useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        setSearch("");
      }
    }
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [open]);

  return (
    <div ref={ref} className={cn("relative inline-block text-sm z-50", className)}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/50",
          dir === "rtl" && "flex-row-reverse",
          !hasTheme && "border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-black/80 dark:text-white/80 hover:bg-black/10 dark:hover:bg-white/10",
        )}
        style={hasTheme ? { background: tc!.btnBg, borderColor: tc!.btnBorder, color: tc!.btnText } : undefined}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={`Current language: ${activeLocale?.label ?? locale}`}
      >
        {activeLocale?.flag && <span className="text-base">{activeLocale.flag}</span>}
        <span>{activeLocale?.label ?? locale}</span>
        <svg
          className={cn(
            "size-4 transition-transform",
            open && "rotate-180",
            !hasTheme && "text-black/40 dark:text-white/40",
          )}
          style={hasTheme ? { color: tc!.iconColor } : undefined}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div
          className={cn(
            "absolute z-50 mt-1 min-w-[200px] overflow-hidden rounded-xl shadow-xl",
            !hasTheme && "border border-black/10 dark:border-white/10 bg-white dark:bg-[#111]",
          )}
          style={hasTheme ? { background: tc!.dropdownBg, borderColor: tc!.dropdownBorder } : undefined}
          role="listbox"
          aria-label="Select language"
        >
          <div
            className={cn("p-2", !hasTheme && "border-b border-black/5 dark:border-white/5")}
            style={hasTheme ? { borderBottom: `1px solid ${tc!.inputBorder}` } : undefined}
          >
            <input
              ref={inputRef}
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={cn(
                "w-full rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-emerald-500/50",
                !hasTheme && "bg-black/5 dark:bg-white/5 text-black dark:text-white placeholder-black/30 dark:placeholder-white/30",
              )}
              style={hasTheme ? { background: tc!.inputBg, color: tc!.inputText } : undefined}
            />
          </div>
          <div className="max-h-60 overflow-y-auto p-1">
            {filtered.map((l) => {
              const isActive = l.code === locale;
              const itemDir = l.rtl || isRtl(l.code) ? "rtl" : "ltr";
              return (
                <button
                  key={l.code}
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  dir={itemDir}
                  onClick={() => {
                    onLocaleChange(l.code);
                    setOpen(false);
                    setSearch("");
                  }}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors",
                    itemDir === "rtl" && "flex-row-reverse text-right",
                    !hasTheme && (
                      isActive
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "text-black/60 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-black dark:hover:text-white"
                    ),
                  )}
                  style={
                    hasTheme
                      ? {
                          background: isActive ? tc!.activeBg : undefined,
                          color: isActive ? tc!.activeText : tc!.itemText,
                        }
                      : undefined
                  }
                  onMouseEnter={(e) => {
                    if (hasTheme && !isActive) e.currentTarget.style.background = tc!.itemHoverBg;
                  }}
                  onMouseLeave={(e) => {
                    if (hasTheme && !isActive) e.currentTarget.style.background = "transparent";
                  }}
                >
                  {l.flag && <span className="text-base">{l.flag}</span>}
                  <span className="flex-1">{l.label}</span>
                  {isActive && (
                    <svg
                      className="size-4"
                      style={{ color: tc?.activeText }}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              );
            })}
            {filtered.length === 0 && (
              <div
                className={cn("px-3 py-2 text-sm", !hasTheme && "text-black/30 dark:text-white/30")}
                style={hasTheme ? { color: tc!.noResultsText } : undefined}
              >
                No results
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
