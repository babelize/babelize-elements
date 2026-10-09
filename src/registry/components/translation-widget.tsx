"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useControllableState } from "@/lib/use-controllable-state";
import { LanguageSwitcher } from "./language-switcher";
import type { Locale } from "./types";

export type { Locale };

export interface TranslationWidgetProps extends Omit<
  React.ComponentPropsWithoutRef<"div">,
  "defaultValue" | "onChange"
> {
  /** Available locales for the per-pane language pickers. Omit to show static chips. */
  locales?: Locale[];
  /** BCP 47 code of the source locale (e.g. "en"). Provide this to control it. */
  sourceLocale?: string;
  /** Initial source locale when uncontrolled */
  defaultSourceLocale?: string;
  /** Callback when the source locale changes */
  onSourceLocaleChange?: (code: string) => void;
  /** BCP 47 code of the target locale (e.g. "fr", "ar"). Provide this to control it. */
  targetLocale?: string;
  /** Initial target locale when uncontrolled */
  defaultTargetLocale?: string;
  /** Callback when the target locale changes */
  onTargetLocaleChange?: (code: string) => void;
  /** Source text. Provide this to control the source pane. */
  sourceText?: string;
  /** Callback when the source text changes. Makes the source pane editable. */
  onSourceChange?: (text: string) => void;
  /** Target text. Provide this to control the target pane. */
  targetText?: string;
  /** Initial target text when uncontrolled */
  defaultTargetText?: string;
  /** Callback when the target text changes */
  onTargetChange?: (text: string) => void;
  /** Placeholder for the source pane (default: "Source text") */
  sourcePlaceholder?: string;
  /** Placeholder for the target pane (default: "Translation") */
  targetPlaceholder?: string;
  /** Accessible label for the source pane (default: "Source text") */
  sourceLabel?: string;
  /** Accessible label for the target pane (default: "Target text") */
  targetLabel?: string;
  /** Keep the source pane read-only even when `onSourceChange` is set */
  readOnlySource?: boolean;
  /** Called after the swap button exchanges locales and texts */
  onSwap?: () => void;
}

const RTL_LOCALES = new Set(["ar", "he", "fa", "ur", "ps", "sd", "yi"]);

const RTL_SCRIPTS = new Set(["arab", "hebr", "thaa", "nkoo", "adlm", "syrc", "samr"]);

function isRtl(code: string): boolean {
  const subtags = code.toLowerCase().split("-");
  if (subtags.some((s) => RTL_SCRIPTS.has(s))) return true;
  return RTL_LOCALES.has(subtags[0]);
}

const LOCALE_LABELS: Record<string, string> = {
  en: "English",
  fr: "French",
  es: "Spanish",
  de: "German",
  it: "Italian",
  pt: "Portuguese",
  nl: "Dutch",
  ru: "Russian",
  uk: "Ukrainian",
  pl: "Polish",
  tr: "Turkish",
  ar: "Arabic",
  he: "Hebrew",
  fa: "Persian",
  ur: "Urdu",
  hi: "Hindi",
  bn: "Bengali",
  ta: "Tamil",
  te: "Telugu",
  mr: "Marathi",
  gu: "Gujarati",
  kn: "Kannada",
  ml: "Malayalam",
  pa: "Punjabi",
  ja: "Japanese",
  ko: "Korean",
  zh: "Chinese",
  th: "Thai",
  vi: "Vietnamese",
  id: "Indonesian",
  ms: "Malay",
  sw: "Swahili",
  sv: "Swedish",
  da: "Danish",
  fi: "Finnish",
  no: "Norwegian",
  nb: "Norwegian",
  cs: "Czech",
  el: "Greek",
  ro: "Romanian",
  hu: "Hungarian",
  bg: "Bulgarian",
  hr: "Croatian",
  sr: "Serbian",
  sk: "Slovak",
  sl: "Slovenian",
  lt: "Lithuanian",
  lv: "Latvian",
  et: "Estonian",
  ca: "Catalan",
  eu: "Basque",
};

function getLocaleLabel(code: string): string {
  return LOCALE_LABELS[code.split("-")[0].toLowerCase()] ?? code;
}

const CHIP_CLASS = cn(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
  "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
);

const TEXTAREA_CLASS = cn(
  "w-full resize-none rounded-2xl border border-transparent px-3.5 py-3 text-sm transition-shadow",
  "bg-zinc-100 text-zinc-900 placeholder:text-zinc-400",
  "shadow-[inset_0_3px_8px_rgba(15,23,42,0.10),inset_0_-2px_4px_rgba(255,255,255,0.7)]",
  "focus:outline-none focus:ring-2",
  "dark:bg-zinc-800/70 dark:text-zinc-100 dark:placeholder:text-zinc-500",
  "dark:shadow-[inset_0_3px_8px_rgba(0,0,0,0.45),inset_0_-2px_4px_rgba(255,255,255,0.04)]",
);

export const TranslationWidget = React.forwardRef<HTMLDivElement, TranslationWidgetProps>(
  function TranslationWidget(
    {
      locales,
      sourceLocale,
      defaultSourceLocale,
      onSourceLocaleChange,
      targetLocale,
      defaultTargetLocale,
      onTargetLocaleChange,
      sourceText,
      onSourceChange,
      targetText,
      defaultTargetText,
      onTargetChange,
      sourcePlaceholder = "Source text",
      targetPlaceholder = "Translation",
      sourceLabel = "Source text",
      targetLabel = "Target text",
      readOnlySource = false,
      onSwap,
      dir,
      className,
      ...rest
    },
    forwardedRef,
  ) {
    const [source, setSource] = useControllableState(sourceText, "", onSourceChange);
    const [target, setTarget] = useControllableState(
      targetText,
      defaultTargetText ?? "",
      onTargetChange,
    );
    const [activeSourceLocale, setActiveSourceLocale] = useControllableState(
      sourceLocale,
      defaultSourceLocale ?? locales?.[0]?.code ?? "en",
      onSourceLocaleChange,
    );
    const [activeTargetLocale, setActiveTargetLocale] = useControllableState(
      targetLocale,
      defaultTargetLocale ?? locales?.[1]?.code ?? locales?.[0]?.code ?? "en",
      onTargetLocaleChange,
    );

    const sourceRtl = isRtl(activeSourceLocale);
    const targetRtl = isRtl(activeTargetLocale);
    const sourceReadOnly = readOnlySource || !onSourceChange;
    const targetReadOnly = targetText !== undefined && !onTargetChange;
    const sourceTextChangeable = sourceText === undefined || onSourceChange !== undefined;
    const targetTextChangeable = targetText === undefined || onTargetChange !== undefined;
    const sourceLocaleChangeable = sourceLocale === undefined || onSourceLocaleChange !== undefined;
    const targetLocaleChangeable = targetLocale === undefined || onTargetLocaleChange !== undefined;
    const canPickSourceLocale = locales !== undefined && sourceLocaleChangeable;
    const canPickTargetLocale = locales !== undefined && targetLocaleChangeable;
    // Swap is all-or-nothing: exchanging only locales or only texts would leave
    // each pane showing a text in the wrong language.
    const canSwap =
      sourceTextChangeable &&
      targetTextChangeable &&
      sourceLocaleChangeable &&
      targetLocaleChangeable;

    const handleSwap = () => {
      // Locales first: any caller side effect on a locale change (e.g. re-translating)
      // runs before the text exchange, so the swapped texts win.
      const prevSourceLocale = activeSourceLocale;
      const prevTargetLocale = activeTargetLocale;
      const prevSource = source;
      const prevTarget = target;
      setActiveSourceLocale(prevTargetLocale);
      setActiveTargetLocale(prevSourceLocale);
      setSource(prevTarget);
      setTarget(prevSource);
      onSwap?.();
    };

    const id = React.useId();
    const sourceId = `${id}-source`;
    const targetId = `${id}-target`;

    return (
      <div
        ref={forwardedRef}
        dir={dir}
        className={cn(
          "w-full rounded-3xl border p-4 transition-shadow sm:p-5",
          "border-zinc-200 bg-white",
          "shadow-[0_20px_45px_-20px_rgba(15,23,42,0.30),inset_0_1px_0_rgba(255,255,255,0.9)]",
          "dark:border-zinc-800 dark:bg-zinc-900",
          "dark:shadow-[0_20px_45px_-20px_rgba(0,0,0,0.65),inset_0_1px_0_rgba(255,255,255,0.08)]",
          className,
        )}
        {...rest}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
          <div className="min-w-0 flex-1 space-y-2">
            {canPickSourceLocale ? (
              <LanguageSwitcher
                locales={locales}
                value={activeSourceLocale}
                onValueChange={setActiveSourceLocale}
              />
            ) : (
              <span className={CHIP_CLASS}>
                {getLocaleLabel(activeSourceLocale)}
                <span className="opacity-60">{activeSourceLocale}</span>
              </span>
            )}
            <textarea
              id={sourceId}
              value={source}
              onChange={(e) => setSource(e.target.value)}
              readOnly={sourceReadOnly}
              placeholder={sourcePlaceholder}
              aria-label={`${sourceLabel} (${getLocaleLabel(activeSourceLocale)})`}
              dir={sourceRtl ? "rtl" : "ltr"}
              lang={activeSourceLocale}
              rows={6}
              className={cn(
                TEXTAREA_CLASS,
                "focus:ring-sky-400/60 dark:focus:ring-sky-400/50",
                sourceReadOnly && "cursor-default",
              )}
            />
          </div>

          <button
            type="button"
            onClick={handleSwap}
            disabled={!canSwap}
            aria-label="Swap languages"
            className={cn(
              "inline-flex size-9 shrink-0 items-center justify-center self-center rounded-full border transition-colors",
              "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900",
              "focus:outline-none focus:ring-2 focus:ring-emerald-500/50",
              "disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white",
              "dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400",
              "dark:hover:bg-zinc-800 dark:hover:text-zinc-50",
              "dark:disabled:hover:bg-zinc-900",
            )}
          >
            <svg
              aria-hidden="true"
              className="size-4 rotate-90 sm:rotate-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m16 3 4 4-4 4" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7H4" />
              <path strokeLinecap="round" strokeLinejoin="round" d="m8 21-4-4 4-4" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 17h16" />
            </svg>
          </button>

          <div className="min-w-0 flex-1 space-y-2">
            {canPickTargetLocale ? (
              <LanguageSwitcher
                locales={locales}
                value={activeTargetLocale}
                onValueChange={setActiveTargetLocale}
              />
            ) : (
              <span className={CHIP_CLASS}>
                {getLocaleLabel(activeTargetLocale)}
                <span className="opacity-60">{activeTargetLocale}</span>
              </span>
            )}
            <textarea
              id={targetId}
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              readOnly={targetReadOnly}
              placeholder={targetPlaceholder}
              aria-label={`${targetLabel} (${getLocaleLabel(activeTargetLocale)})`}
              dir={targetRtl ? "rtl" : "ltr"}
              lang={activeTargetLocale}
              rows={6}
              className={cn(
                TEXTAREA_CLASS,
                "focus:ring-violet-400/60 dark:focus:ring-violet-400/50",
                targetReadOnly && "cursor-default",
              )}
            />
          </div>
        </div>
      </div>
    );
  },
);
