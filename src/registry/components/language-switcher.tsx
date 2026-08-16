"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface Locale {
  /** ISO 639-1 / BCP 47 code (e.g. "en", "fr-FR", "ar-SA") */
  code: string;
  /** Override display name (auto-resolved from built-in mapping if omitted) */
  label?: string;
  /** Override flag emoji (auto-detected from code if omitted) */
  flag?: string;
  /** Override RTL (auto-detected from code if omitted) */
  rtl?: boolean;
}

export interface LanguageSwitcherProps {
  /** Array of available locales — only `code` is required */
  locales: Locale[];
  /** Initial selected locale code (default: first locale's code) */
  defaultValue?: string;
  /** Callback when locale changes */
  onValueChange?: (code: string) => void;
  /** Show flag emojis next to locale names (default: false) */
  showFlags?: boolean;
  /** Display labels in native language or English (default: "english") */
  label?: "native" | "english";
  /** Additional CSS classes */
  className?: string;
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
  return LANG_TO_FLAG[lang] ?? "\u{1F310}";
}

/**
 * Built-in language names: native form and English form.
 */
const LANG_NAMES: Record<string, [native: string, english: string]> = {
  en: ["English", "English"], fr: ["Fran\u00e7ais", "French"], es: ["Espa\u00f1ol", "Spanish"],
  de: ["Deutsch", "German"], ja: ["\u65e5\u672c\u8a9e", "Japanese"], ko: ["\ud55c\uad6d\uc5b4", "Korean"],
  zh: ["\u4e2d\u6587", "Chinese"], ar: ["\u0627\u0644\u0639\u0631\u0628\u064a\u0629", "Arabic"], pt: ["Portugu\u00eas", "Portuguese"],
  it: ["Italiano", "Italian"], nl: ["Nederlands", "Dutch"], ru: ["\u0420\u0443\u0441\u0441\u043a\u0438\u0439", "Russian"],
  pl: ["Polski", "Polish"], tr: ["T\u00fcrk\u00e7e", "Turkish"], vi: ["Ti\u1ebfng Vi\u1ec7t", "Vietnamese"],
  th: ["\u0e44\u0e17\u0e22", "Thai"], id: ["Bahasa Indonesia", "Indonesian"], hi: ["\u0939\u093f\u0928\u094d\u0926\u0940", "Hindi"],
  bn: ["\u09ac\u09be\u0982\u09b2\u09be", "Bengali"], uk: ["\u0423\u043a\u0440\u0430\u0457\u043d\u0441\u044c\u043a\u0430", "Ukrainian"], cs: ["\u010ce\u0161tina", "Czech"],
  sv: ["Svenska", "Swedish"], da: ["Dansk", "Danish"], fi: ["Suomi", "Finnish"],
  no: ["Norsk", "Norwegian"], nb: ["Norsk bokm\u00e5l", "Norwegian Bokm\u00e5l"],
  nn: ["Nynorsk", "Norwegian Nynorsk"], el: ["\u0395\u03bb\u03bb\u03b7\u03bd\u03b9\u03ba\u03ac", "Greek"],
  he: ["\u05e2\u05d1\u05e8\u05d9\u05ea", "Hebrew"], fa: ["\u0641\u0627\u0631\u0633\u06cc", "Persian"], ro: ["Rom\u00e2n\u0103", "Romanian"],
  hu: ["Magyar", "Hungarian"], sk: ["Sloven\u010dina", "Slovak"],
  bg: ["\u0411\u044a\u043b\u0433\u0430\u0440\u0441\u043a\u0438", "Bulgarian"], hr: ["Hrvatski", "Croatian"],
  sr: ["\u0421\u0440\u043f\u0441\u043a\u0438", "Serbian"], sl: ["Sloven\u0161\u010dina", "Slovenian"],
  lt: ["Lietuvi\u0173", "Lithuanian"], lv: ["Latvie\u0161u", "Latvian"],
  et: ["Eesti", "Estonian"], ga: ["Gaeilge", "Irish"], mt: ["Malti", "Maltese"],
  ca: ["Catal\u00e0", "Catalan"], eu: ["Euskara", "Basque"], gl: ["Galego", "Galician"],
  cy: ["Cymraeg", "Welsh"], mk: ["\u041c\u0430\u043a\u0435\u0434\u043e\u043d\u0441\u043a\u0438", "Macedonian"],
  sq: ["Shqip", "Albanian"], bs: ["Bosanski", "Bosnian"],
  is: ["\u00cdslenska", "Icelandic"], fo: ["F\u00f8royskt", "Faroese"],
  sw: ["Kiswahili", "Swahili"], am: ["\u12a0\u12cd\u1295\u1348", "Amharic"],
  ne: ["\u0928\u0947\u092a\u093e\u0932\u0940", "Nepali"], si: ["\u0dc3\u0dd2\u0d82\u0dc4\u0dbd", "Sinhala"],
  my: ["\u1019\u103c\u1014\u103a\u1019\u102c", "Burmese"], km: ["\u1780\u1798\u17d2\u1796\u17c7\u1798", "Khmer"], lo: ["\u0ea5\u0e27", "Lao"],
  ka: ["\u10e5\u10d0\u10e0\u10d7\u10e3\u10da\u10d8", "Georgian"], hy: ["\u0540\u0561\u0575\u0565\u10e0\u0565\u0576", "Armenian"],
  kk: ["\u049a\u0430\u0437\u0430\u049b", "Kazakh"], uz: ["O\u2019zbek", "Uzbek"],
  mn: ["\u041c\u043e\u043d\u0433\u043e\u043b", "Mongolian"], ps: ["\u067e\u069a\u062a\u0648", "Pashto"],
  ur: ["\u0627\u0631\u062f\u0648", "Urdu"], sd: ["\u0773\u0647\u0646\u068c\u064a", "Sindhi"],
  ml: ["\u0d2e\u0d32\u0d2f\u0d3e\u0d33\u0d02", "Malayalam"], ta: ["\u0ba4\u0bae\u0bbf\u0bb4\u0bcd", "Tamil"],
  te: ["\u0c24\u0c46\u0c32\u0c41\u0c17\u0c41", "Telugu"], kn: ["\u0c95\u0ca8\u0ccd\u0ca8\u0ca1", "Kannada"],
  mr: ["\u092e\u0930\u093e\u0920\u0940", "Marathi"], gu: ["\u0a97\u0ac1\u0a9c\u0ab0\u0abe\u0aa4\u0ac0", "Gujarati"],
  pa: ["\u0a2a\u0a70\u0a1c\u0a3e\u0a2c\u0a40", "Punjabi"], or: ["\u0b13\u0b21\u0b3c\u0b3f\u0b06", "Odia"],
  as: ["\u0985\u09b8\u09ae\u09c0\u09af\u09bc\u09be", "Assamese"], yi: ["\u05d9\u05d9\u05b4\u05d3\u05d9\u05e9", "Yiddish"],
  yo: ["Yor\u00f9b\u00e1", "Yoruba"], ig: ["Igbo", "Igbo"],
  zu: ["isiZulu", "Zulu"], af: ["Afrikaans", "Afrikaans"],
  ha: ["Hausa", "Hausa"], tl: ["Filipino", "Filipino"],
  mg: ["Malagasy", "Malagasy"], mi: ["Te Reo M\u0101ori", "M\u0101ori"],
  sm: ["Gagana Samoa", "Samoan"], to: ["Lea Faka-Tonga", "Tongan"],
  fj: ["Na Vosa Vakaviti", "Fijian"], haw: ["\u02bb\u014clelo Hawai\u02bbi", "Hawaiian"],
  la: ["Latina", "Latin"], eo: ["Esperanto", "Esperanto"],
};

function getLabel(code: string, mode: "native" | "english"): string {
  const lang = code.split("-")[0].toLowerCase();
  const names = LANG_NAMES[lang];
  if (!names) return code;
  return mode === "native" ? names[0] : names[1];
}

export function LanguageSwitcher({
  locales,
  defaultValue,
  onValueChange,
  showFlags = false,
  label: labelMode = "english",
  className,
}: LanguageSwitcherProps) {
  const [locale, setLocale] = React.useState(defaultValue ?? locales[0]?.code ?? "");
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const ref = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const resolveLabel = (l: Locale) => l.label ?? getLabel(l.code, labelMode);
  const activeLocale = locales.find((l) => l.code === locale);

  const filtered = locales.filter(
    (l) =>
      resolveLabel(l).toLowerCase().includes(search.toLowerCase()) ||
      l.code.toLowerCase().includes(search.toLowerCase()),
  );

  const dir = isRtl(locale) ? "rtl" : "ltr";

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
          "inline-flex items-center gap-2 rounded-lg border border-border bg-secondary px-3 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring/50",
          dir === "rtl" && "flex-row-reverse",
        )}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={`Current language: ${activeLocale ? resolveLabel(activeLocale) : locale}`}
      >
        {showFlags && <span className="text-base">{activeLocale?.flag ?? getFlag(locale)}</span>}
        <span>{activeLocale ? resolveLabel(activeLocale) : locale}</span>
        <svg
          className={cn(
            "size-4 text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
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
          className="absolute z-50 mt-1 min-w-[200px] overflow-hidden rounded-xl border border-border bg-popover shadow-xl"
          role="listbox"
          aria-label="Select language"
        >
          <div className="border-b border-border p-2">
            <input
              ref={inputRef}
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg bg-secondary px-3 py-1.5 text-sm text-secondary-foreground outline-none placeholder:text-muted-foreground focus:ring-1 focus:ring-ring/50"
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
                    setLocale(l.code);
                    onValueChange?.(l.code);
                    setOpen(false);
                    setSearch("");
                  }}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors",
                    itemDir === "rtl" && "flex-row-reverse text-right",
                    isActive
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  {showFlags && <span className="text-base">{l.flag ?? getFlag(l.code)}</span>}
                  <span className="flex-1">{resolveLabel(l)}</span>
                  {isActive && (
                    <svg
                      className="size-4 text-primary"
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
              <div className="px-3 py-2 text-sm text-muted-foreground">
                No results
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
