"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useControllableState } from "@/lib/use-controllable-state";
import type { Locale } from "./types";
import { getFlag, getLanguageName, isRtl } from "./locale-data";

export type { Locale };

export interface LanguageSwitcherProps extends Omit<
  React.ComponentPropsWithoutRef<"div">,
  "defaultValue" | "onChange"
> {
  /** Array of available locales — only `code` is required */
  locales: Locale[];
  /** Selected locale code. Provide this to control the component. */
  value?: string;
  /** Initial selected locale code when uncontrolled (default: first locale's code) */
  defaultValue?: string;
  /** Callback when locale changes */
  onValueChange?: (code: string) => void;
  /** Show flag emojis next to locale names (default: false) */
  showFlags?: boolean;
  /** Display labels in native language or English (default: "english") */
  label?: "native" | "english";
}

export const LanguageSwitcher = React.forwardRef<HTMLDivElement, LanguageSwitcherProps>(
  function LanguageSwitcher(
    {
      locales,
      value,
      defaultValue,
      onValueChange,
      showFlags = false,
      label: labelMode = "english",
      className,
      ...rest
    },
    forwardedRef,
  ) {
    const [locale, setLocale] = useControllableState(
      value,
      defaultValue ?? locales[0]?.code ?? "",
      onValueChange,
    );
    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = React.useState("");
    const ref = React.useRef<HTMLDivElement>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useImperativeHandle(forwardedRef, () => ref.current as HTMLDivElement);

    const resolveLabel = (l: Locale) => l.label ?? getLanguageName(l.code, labelMode) ?? l.code;
    const activeLocale = locales.find((l) => l.code === locale);

    const filtered = locales.filter(
      (l) =>
        resolveLabel(l).toLowerCase().includes(search.toLowerCase()) ||
        l.code.toLowerCase().includes(search.toLowerCase()),
    );

    const dir = (activeLocale?.rtl ?? isRtl(locale)) ? "rtl" : "ltr";

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
      <div
        ref={ref}
        dir={dir}
        className={cn("relative inline-block text-sm z-50", className)}
        {...rest}
      >
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className={cn(
            "inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100 hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700 dark:hover:text-zinc-50",
          )}
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-label={`Current language: ${activeLocale ? resolveLabel(activeLocale) : locale}`}
        >
          {showFlags && <span className="text-base">{activeLocale?.flag ?? getFlag(locale)}</span>}
          <span>{activeLocale ? resolveLabel(activeLocale) : locale}</span>
          <svg
            className={cn(
              "size-4 text-zinc-500 transition-transform dark:text-zinc-400",
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
            className="absolute z-50 mt-1 min-w-[200px] overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-950"
            role="listbox"
            aria-label="Select language"
          >
            <div className="border-b border-zinc-200 p-2 dark:border-zinc-800">
              <input
                ref={inputRef}
                type="text"
                placeholder="Search..."
                aria-label="Search languages"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg bg-zinc-100 px-3 py-1.5 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:ring-1 focus:ring-emerald-500/50 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500"
              />
            </div>
            <div className="max-h-60 overflow-y-auto p-1">
              {filtered.map((l) => {
                const isActive = l.code === locale;
                const itemDir = (l.rtl ?? isRtl(l.code)) ? "rtl" : "ltr";
                return (
                  <button
                    key={l.code}
                    type="button"
                    role="option"
                    aria-selected={isActive}
                    dir={itemDir}
                    onClick={() => {
                      setLocale(l.code);
                      setOpen(false);
                      setSearch("");
                    }}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-start text-sm transition-colors",
                      isActive
                        ? "bg-emerald-500/10 text-emerald-600 font-medium dark:text-emerald-400"
                        : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100",
                    )}
                  >
                    {showFlags && <span className="text-base">{l.flag ?? getFlag(l.code)}</span>}
                    <span className="flex-1">{resolveLabel(l)}</span>
                    {isActive && (
                      <svg
                        className="size-4 text-emerald-600 dark:text-emerald-400"
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
                <div className="px-3 py-2 text-sm text-zinc-500 dark:text-zinc-400">No results</div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  },
);
