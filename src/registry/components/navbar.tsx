"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface NavLink {
  label: string;
  href: string;
}

export interface Locale {
  code: string;
  label?: string;
  flag?: string;
}

export interface NavBarProps {
  logo?: React.ReactNode;
  links?: NavLink[];
  locales?: Locale[];
  currentLocale?: string;
  onLocaleChange?: (code: string) => void;
  cta?: { label: string; href: string };
  showGitHub?: boolean;
  githubUrl?: string;
  sticky?: boolean;
  className?: string;
  showFlags?: boolean;
}

const LOCALE_MAP: Record<string, { label: string; flag: string }> = {
  en: { label: "English", flag: "\u{1F1FA}\u{1F1F8}" },
  fr: { label: "Fran\u00e7ais", flag: "\u{1F1EB}\u{1F1F7}" },
  es: { label: "Espa\u00f1ol", flag: "\u{1F1EA}\u{1F1F8}" },
  de: { label: "Deutsch", flag: "\u{1F1E9}\u{1F1EA}" },
  ja: { label: "\u65e5\u672c\u8a9e", flag: "\u{1F1EF}\u{1F1F5}" },
  ko: { label: "\ud55c\uad6d\uc5b4", flag: "\u{1F1F0}\u{1F1F7}" },
  zh: { label: "\u4e2d\u6587", flag: "\u{1F1E8}\u{1F1F3}" },
  ar: { label: "\u0627\u0644\u0639\u0631\u0628\u064a\u0629", flag: "\u{1F1F8}\u{1F1E6}" },
  pt: { label: "Portugu\u00eas", flag: "\u{1F1E7}\u{1F1F7}" },
  it: { label: "Italiano", flag: "\u{1F1EE}\u{1F1F9}" },
  nl: { label: "Nederlands", flag: "\u{1F1F3}\u{1F1F1}" },
  ru: { label: "\u0420\u0443\u0441\u0441\u043a\u0438\u0439", flag: "\u{1F1F7}\u{1F1FA}" },
  pl: { label: "Polski", flag: "\u{1F1F5}\u{1F1F1}" },
  tr: { label: "T\u00fcrk\u00e7e", flag: "\u{1F1F9}\u{1F1F7}" },
  vi: { label: "Ti\u1ebfng Vi\u1ec7t", flag: "\u{1F1FB}\u{1F1F3}" },
  th: { label: "\u0e44\u0e17\u0e22", flag: "\u{1F1F9}\u{1F1ED}" },
  id: { label: "Bahasa Indonesia", flag: "\u{1F1EE}\u{1F1E9}" },
  hi: { label: "\u0939\u093f\u0928\u094d\u0926\u0940", flag: "\u{1F1EE}\u{1F1F3}" },
  sv: { label: "Svenska", flag: "\u{1F1F8}\u{1F1EA}" },
  da: { label: "Dansk", flag: "\u{1F1E9}\u{1F1F0}" },
  fi: { label: "Suomi", flag: "\u{1F1EB}\u{1F1EE}" },
  no: { label: "Norsk", flag: "\u{1F1F3}\u{1F1F4}" },
  el: { label: "\u0395\u03bb\u03bb\u03b7\u03bd\u03b9\u03ba\u03ac", flag: "\u{1F1EC}\u{1F1F7}" },
  he: { label: "\u05e2\u05d1\u05e8\u05d9\u05ea", flag: "\u{1F1EE}\u{1F1F1}" },
  ro: { label: "Rom\u00e2n\u0103", flag: "\u{1F1F7}\u{1F1F4}" },
  hu: { label: "Magyar", flag: "\u{1F1ED}\u{1F1FA}" },
  cs: { label: "\u010ce\u0161tina", flag: "\u{1F1E8}\u{1F1FF}" },
  uk: { label: "\u0423\u043a\u0440\u0430\u0457\u043d\u0441\u044c\u043a\u0430", flag: "\u{1F1FA}\u{1F1E6}" },
  bg: { label: "\u0411\u044a\u043b\u0433\u0430\u0440\u0441\u043a\u0438", flag: "\u{1F1E7}\u{1F1EC}" },
  hr: { label: "Hrvatski", flag: "\u{1F1ED}\u{1F1F7}" },
  sk: { label: "Sloven\u010dina", flag: "\u{1F1F8}\u{1F1F0}" },
  sl: { label: "Sloven\u0161\u010dina", flag: "\u{1F1F8}\u{1F1EE}" },
  lt: { label: "Lietuvi\u0173", flag: "\u{1F1F1}\u{1F1F9}" },
  lv: { label: "Latvie\u0161u", flag: "\u{1F1F1}\u{1F1FB}" },
  et: { label: "Eesti", flag: "\u{1F1EA}\u{1F1EA}" },
  ca: { label: "Catal\u00e0", flag: "\u{1F1E6}\u{1F1F8}" },
  af: { label: "Afrikaans", flag: "\u{1F1E6}\u{1F1FF}" },
  sw: { label: "Kiswahili", flag: "\u{1F1F9}\u{1F1FF}" },
};

function getLocaleInfo(code: string) {
  return LOCALE_MAP[code] ?? { label: code.toUpperCase(), flag: "\u{1F310}" };
}

export function NavBar({
  logo,
  links = [],
  locales = [],
  currentLocale = "en",
  onLocaleChange,
  cta,
  showGitHub = false,
  githubUrl = "https://github.com/babelize/babelize-elements",
  sticky = true,
  className,
  showFlags = true,
}: NavBarProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [langOpen, setLangOpen] = React.useState(false);
  const langRef = React.useRef<HTMLDivElement>(null);
  const mobileLangRef = React.useRef<HTMLDivElement>(null);

  const currentLocaleInfo = getLocaleInfo(currentLocale);

  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  React.useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const langButton = (
    <button
      type="button"
      onClick={() => setLangOpen(!langOpen)}
      className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      aria-expanded={langOpen}
      aria-haspopup="listbox"
      aria-label={`Current language: ${currentLocaleInfo.label}`}
    >
      {showFlags && <span className="text-sm leading-none">{currentLocaleInfo.flag}</span>}
      <span className="hidden sm:inline">{currentLocaleInfo.label}</span>
      <svg
        className={cn("size-3 text-muted-foreground transition-transform", langOpen && "rotate-180")}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );

  const langDropdown = (
    <div
      className="absolute right-0 top-full z-50 mt-1.5 min-w-[170px] rounded-xl border border-border bg-popover py-1.5 shadow-xl"
      role="listbox"
      aria-label="Select language"
    >
      {locales.map((locale) => {
        const info = getLocaleInfo(locale.code);
        const isActive = locale.code === currentLocale;
        return (
          <button
            key={locale.code}
            type="button"
            role="option"
            aria-selected={isActive}
            onClick={() => {
              onLocaleChange?.(locale.code);
              setLangOpen(false);
            }}
            className={cn(
              "flex w-full items-center gap-2.5 px-3 py-2 text-sm rounded-lg mx-1.5 w-[calc(100%-12px)] transition-colors",
              isActive
                ? "bg-primary/10 text-primary font-medium"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            {showFlags && <span className="text-base leading-none">{info.flag}</span>}
            <span className="flex-1">{locale.label ?? info.label}</span>
            {isActive && (
              <svg
                className="size-4 shrink-0 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
        );
      })}
    </div>
  );

  return (
    <nav
      className={cn(
        "z-50 w-full border-b border-border bg-card",
        sticky && "sticky top-0",
        className
      )}
    >
      {/* Desktop */}
      <div className="mx-auto hidden max-w-6xl items-center justify-between px-5 py-3 md:flex">
        {logo && <div className="flex-shrink-0">{logo}</div>}

        <div className="flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-1.5 text-sm transition-colors rounded-md no-underline text-muted-foreground hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-1">
          {locales.length > 0 && (
            <div ref={langRef} className="relative">
              {langButton}
              {langOpen && langDropdown}
            </div>
          )}

          {showGitHub && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex size-8 items-center justify-center rounded-md transition-colors no-underline text-muted-foreground hover:text-foreground"
              aria-label="GitHub"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
            </a>
          )}

          {cta && (
            <Link
              href={cta.href}
              className="rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors no-underline bg-primary text-primary-foreground hover:opacity-90"
            >
              {cta.label}
            </Link>
          )}
        </div>
      </div>

      {/* Mobile */}
      <div className="flex items-center justify-between px-4 py-3 md:hidden">
        {logo && <div className="flex-shrink-0">{logo}</div>}

        <div className="flex items-center gap-1">
          {locales.length > 0 && (
            <div ref={mobileLangRef} className="relative">
              <button
                type="button"
                onClick={() => setLangOpen(!langOpen)}
                className="inline-flex size-8 items-center justify-center rounded-md transition-colors text-muted-foreground hover:text-foreground"
                aria-label={`Current language: ${currentLocaleInfo.label}`}
              >
                {showFlags && <span className="text-base leading-none">{currentLocaleInfo.flag}</span>}
              </button>
              {langOpen && langDropdown}
            </div>
          )}

          <button
            className="inline-flex size-8 items-center justify-center rounded-md transition-colors text-muted-foreground hover:text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      {mobileOpen && (
        <div className="border-t border-border bg-card px-4 py-3 md:hidden">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block py-2.5 text-sm transition-colors no-underline text-muted-foreground hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          {cta && (
            <Link
              href={cta.href}
              onClick={() => setMobileOpen(false)}
              className="mt-2 block rounded-md px-3.5 py-2 text-center text-sm font-medium transition-colors no-underline bg-primary text-primary-foreground hover:opacity-90"
            >
              {cta.label}
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
