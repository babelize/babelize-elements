"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface Locale {
  /** ISO 639-1 / BCP 47 code (e.g. "en", "fr-FR", "ar-SA") */
  code: string;
  /** Display name in its native language */
  label: string;
  /** Override flag emoji (auto-detected from code if omitted) */
  flag?: string;
  /** Override RTL (auto-detected from code if omitted) */
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
  /** Show flag emojis next to locale names (default: true) */
  showFlags?: boolean;
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
 * Maps ISO 639-1 language codes to flag emojis via regional indicator symbols.
 * Covers 80+ common languages. Override per-locale with the `flag` prop.
 */
const LANG_TO_FLAG: Record<string, string> = {
  en: "\u{1F1FA}\u{1F1F8}", fr: "\u{1F1EB}\u{1F1F7}", es: "\u{1F1EA}\u{1F1F8}",
  de: "\u{1F1E9}\u{1F1EA}", ja: "\u{1F1EF}\u{1F1F5}", ko: "\u{1F1F0}\u{1F1F7}",
  zh: "\u{1F1E8}\u{1F1F3}", ar: "\u{1F1F8}\u{1F1E6}", pt: "\u{1F1E7}\u{1F1F7}",
  it: "\u{1F1EE}\u{1F1F9}", nl: "\u{1F1F3}\u{1F1F1}", ru: "\u{1F1F7}\u{1F1FA}",
  pl: "\u{1F1F5}\u{1F1F1}", tr: "\u{1F1F9}\u{1F1F7}", vi: "\u{1F1FB}\u{1F1F3}",
  th: "\u{1F1F9}\u{1F1ED}", id: "\u{1F1EE}\u{1F1E9}", hi: "\u{1F1EE}\u{1F1F3}",
  bn: "\u{1F1E7}\u{1F1E9}", uk: "\u{1F1FA}\u{1F1E6}", cs: "\u{1F1E8}\u{1F1FF}",
  sv: "\u{1F1F8}\u{1F1EA}", da: "\u{1F1E9}\u{1F1F0}", fi: "\u{1F1EB}\u{1F1EE}",
  no: "\u{1F1F3}\u{1F1F4}", nb: "\u{1F1F3}\u{1F1F4}", nn: "\u{1F1F3}\u{1F1F4}",
  el: "\u{1F1EC}\u{1F1F7}", he: "\u{1F1EE}\u{1F1F1}", fa: "\u{1F1EE}\u{1F1F7}",
  ro: "\u{1F1F7}\u{1F1F4}", hu: "\u{1F1ED}\u{1F1FA}", sk: "\u{1F1F8}\u{1F1F0}",
  bg: "\u{1F1E7}\u{1F1EC}", hr: "\u{1F1ED}\u{1F1F7}", sr: "\u{1F1F7}\u{1F1F8}",
  sl: "\u{1F1F8}\u{1F1EE}", lt: "\u{1F1F1}\u{1F1F9}", lv: "\u{1F1F1}\u{1F1FB}",
  et: "\u{1F1EA}\u{1F1EA}", ga: "\u{1F1EE}\u{1F1EA}", mt: "\u{1F1F2}\u{1F1F9}",
  ca: "\u{1F1E6}\u{1F1F8}", eu: "\u{1F1E6}\u{1F1F7}", gl: "\u{1F1E6}\u{1F1F7}",
  cy: "\u{1F1FF}\u{1F1F4}", mk: "\u{1F1F2}\u{1F1F0}", sq: "\u{1F1E6}\u{1F1F1}",
  bs: "\u{1F1E7}\u{1F1F8}", is: "\u{1F1EE}\u{1F1F8}", fo: "\u{1F1EB}\u{1F1F4}",
  sw: "\u{1F1F9}\u{1F1FF}", am: "\u{1F1E6}\u{1F1F2}", ne: "\u{1F1F3}\u{1F1F5}",
  si: "\u{1F1F8}\u{1F1F0}", my: "\u{1F1F2}\u{1F1E2}", km: "\u{1F1F0}\u{1F1ED}",
  lo: "\u{1F1F1}\u{1F1E6}", ka: "\u{1F1EC}\u{1F1EA}", hy: "\u{1F1E6}\u{1F1F2}",
  kk: "\u{1F1F0}\u{1F1F0}", uz: "\u{1F1FA}\u{1F1FF}", mn: "\u{1F1F2}\u{1F1F3}",
  ps: "\u{1F1F5}\u{1F1F8}", ur: "\u{1F1FA}\u{1F1F2}", sd: "\u{1F1F8}\u{1F1E6}",
  ml: "\u{1F1F2}\u{1F1F1}", ta: "\u{1F1F9}\u{1F1F1}", te: "\u{1F1F9}\u{1F1EF}",
  kn: "\u{1F1EE}\u{1F1F3}", mr: "\u{1F1F2}\u{1F1F7}", gu: "\u{1F1EC}\u{1F1A9}",
  pa: "\u{1F1F5}\u{1F1E6}", or: "\u{1F1F3}\u{1F1F4}", as: "\u{1F1E6}\u{1F1F8}",
  yi: "\u{1F1FE}\u{1F1EA}", yo: "\u{1F1FE}\u{1F1F3}", ig: "\u{1F1EE}\u{1F1EC}",
  zu: "\u{1F1FF}\u{1F1F3}", af: "\u{1F1E6}\u{1F1FF}",
  ha: "\u{1F1ED}\u{1F1F2}", tl: "\u{1F1F5}\u{1F1ED}", mg: "\u{1F1F2}\u{1F1EC}",
  mi: "\u{1F1F3}\u{1F1FF}", sm: "\u{1F1F8}\u{1F1F4}", fj: "\u{1F1EB}\u{1F1EF}",
  to: "\u{1F1F9}\u{1F1F4}", haw: "\u{1F1ED}\u{1F1FC}", la: "\u{1F1F1}\u{1F1E6}",
  eo: "\u{1F1EA}\u{1F1F7}",
};

function getFlag(code: string): string {
  const lang = code.split("-")[0].toLowerCase();
  return LANG_TO_FLAG[lang] ?? "\u{1F310}"; // 🌐 globe as fallback
}

/**
 * Dropdown language switcher with searchable locale list.
 *
 * @example
 * ```tsx
 * // Simple — flags auto-detected from language code
 * <LanguageSwitcher
 *   locale="en"
 *   locales={[
 *     { code: "en", label: "English" },
 *     { code: "fr", label: "Français" },
 *     { code: "ar", label: "العربية" },
 *   ]}
 *   onLocaleChange={(code) => router.push(`/${code}`)}
 * />
 *
 * // No flags
 * <LanguageSwitcher
 *   locale="en"
 *   locales={[{ code: "en", label: "English" }]}
 *   onLocaleChange={setLocale}
 *   showFlags={false}
 * />
 * ```
 */
export function LanguageSwitcher({
  locale,
  locales,
  onLocaleChange,
  showFlags = true,
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
        {showFlags && <span className="text-base">{activeLocale?.flag ?? getFlag(locale)}</span>}
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
                  {showFlags && <span className="text-base">{l.flag ?? getFlag(l.code)}</span>}
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
