"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useControllableState } from "@/lib/use-controllable-state";

export interface TranslationWidgetProps extends Omit<
  React.ComponentPropsWithoutRef<"div">,
  "defaultValue" | "onChange"
> {
  /** BCP 47 code of the source locale (e.g. "en") */
  sourceLocale: string;
  /** BCP 47 code of the target locale (e.g. "fr", "ar") */
  targetLocale: string;
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
}

const RTL_LOCALES = new Set(["ar", "he", "fa", "ur", "ps", "sd", "yi"]);

function isRtl(code: string): boolean {
  return RTL_LOCALES.has(code.split("-")[0].toLowerCase());
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

export const TranslationWidget = React.forwardRef<HTMLDivElement, TranslationWidgetProps>(
  function TranslationWidget(
    {
      sourceLocale,
      targetLocale,
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

    const sourceRtl = isRtl(sourceLocale);
    const targetRtl = isRtl(targetLocale);
    const widgetDir = dir ?? (targetRtl ? "rtl" : "ltr");
    const sourceReadOnly = readOnlySource || !onSourceChange;

    const id = React.useId();
    const sourceId = `${id}-source`;
    const targetId = `${id}-target`;

    return (
      <div
        ref={forwardedRef}
        dir={widgetDir}
        lang={targetLocale}
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
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
                "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
              )}
            >
              {getLocaleLabel(sourceLocale)}
              <span className="opacity-60">{sourceLocale}</span>
            </span>
            <textarea
              id={sourceId}
              value={source}
              onChange={(e) => setSource(e.target.value)}
              readOnly={sourceReadOnly}
              placeholder={sourcePlaceholder}
              aria-label={`${sourceLabel} (${getLocaleLabel(sourceLocale)})`}
              dir={sourceRtl ? "rtl" : "ltr"}
              lang={sourceLocale}
              rows={6}
              className={cn(
                "w-full resize-none rounded-2xl border border-transparent px-3.5 py-3 text-sm transition-shadow",
                "bg-zinc-100 text-zinc-900 placeholder:text-zinc-400",
                "shadow-[inset_0_3px_8px_rgba(15,23,42,0.10),inset_0_-2px_4px_rgba(255,255,255,0.7)]",
                "focus:outline-none focus:ring-2 focus:ring-sky-400/60",
                "dark:bg-zinc-800/70 dark:text-zinc-100 dark:placeholder:text-zinc-500",
                "dark:shadow-[inset_0_3px_8px_rgba(0,0,0,0.45),inset_0_-2px_4px_rgba(255,255,255,0.04)]",
                "dark:focus:ring-sky-400/50",
                sourceReadOnly && "cursor-default",
              )}
            />
          </div>

          <div className="min-w-0 flex-1 space-y-2">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
                "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
              )}
            >
              {getLocaleLabel(targetLocale)}
              <span className="opacity-60">{targetLocale}</span>
            </span>
            <textarea
              id={targetId}
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder={targetPlaceholder}
              aria-label={`${targetLabel} (${getLocaleLabel(targetLocale)})`}
              dir={targetRtl ? "rtl" : "ltr"}
              lang={targetLocale}
              rows={6}
              className={cn(
                "w-full resize-none rounded-2xl border border-transparent px-3.5 py-3 text-sm transition-shadow",
                "bg-zinc-100 text-zinc-900 placeholder:text-zinc-400",
                "shadow-[inset_0_3px_8px_rgba(15,23,42,0.10),inset_0_-2px_4px_rgba(255,255,255,0.7)]",
                "focus:outline-none focus:ring-2 focus:ring-violet-400/60",
                "dark:bg-zinc-800/70 dark:text-zinc-100 dark:placeholder:text-zinc-500",
                "dark:shadow-[inset_0_3px_8px_rgba(0,0,0,0.45),inset_0_-2px_4px_rgba(255,255,255,0.04)]",
                "dark:focus:ring-violet-400/50",
              )}
            />
          </div>
        </div>
      </div>
    );
  },
);
