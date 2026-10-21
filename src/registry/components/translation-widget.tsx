"use client";

import * as React from "react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { ArrowLeftRightIcon, CheckIcon, CopyIcon, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useControllableState } from "@/lib/use-controllable-state";
import { LanguageSwitcher, type LanguageSwitcherLabels } from "./language-switcher";
import type { Locale } from "./types";
import { getLanguageName, isRtl } from "./locale-data";

export type { Locale };

/** Built-in UI text. Every key is optional in `labels`; omitted keys keep the English default. */
export interface TranslationWidgetLabels {
  /** Accessible label for the swap button (default: "Swap languages") */
  swap: string;
  /** Accessible label for the copy button (default: "Copy translation") */
  copy: string;
  /** Accessible label for the copy button right after a copy (default: "Copied") */
  copied: string;
  /** Screen reader announcement after a copy (default: "Translation copied to clipboard") */
  copiedStatus: string;
  /** Accessible label for the clear button (default: "Clear source text") */
  clearSource: string;
  /**
   * Screen reader word read after the character count (default: "characters").
   * Receives the count, so it can return the right plural form.
   */
  characters: (count: number) => string;
  /** UI text for both language pickers, passed through as their `labels` */
  languageSwitcher?: Partial<LanguageSwitcherLabels>;
}

const DEFAULT_LABELS: TranslationWidgetLabels = {
  swap: "Swap languages",
  copy: "Copy translation",
  copied: "Copied",
  copiedStatus: "Translation copied to clipboard",
  clearSource: "Clear source text",
  characters: () => "characters",
};

/** Per-part class overrides, merged after the defaults with `cn`. */
export interface TranslationWidgetClassNames {
  /** The outer card */
  root?: string;
  /** The header bar holding both language pickers and the swap button */
  header?: string;
  /** Each text pane (source and target) */
  pane?: string;
  /** Both textareas */
  textarea?: string;
  /** The toolbar under each pane */
  footer?: string;
  /** The swap button */
  swap?: string;
  /** The static language chip shown when a locale is not pickable */
  chip?: string;
}

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
  /** Initial source text when uncontrolled */
  defaultSourceText?: string;
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
  /** Show the character count under the source pane (default: true) */
  showCount?: boolean;
  /** Show a copy-to-clipboard button under the target pane (default: true) */
  showCopy?: boolean;
  /** Show a clear button under an editable source pane (default: true) */
  showClear?: boolean;
  /** Maximum characters in either pane; the count shows `n / max` when set */
  maxLength?: number;
  /** Show a loading skeleton in the target pane, e.g. while a translation is fetched */
  loading?: boolean;
  /** Called with the target text after it is copied to the clipboard */
  onTargetCopy?: (text: string) => void;
  /** Override the built-in English UI text — any key you omit keeps its default */
  labels?: Partial<TranslationWidgetLabels>;
  /** Per-part class overrides */
  classNames?: TranslationWidgetClassNames;
}

function getLocaleLabel(code: string): string {
  return getLanguageName(code, "english") ?? code;
}

const ICON_BUTTON_CLASS = cn(
  "inline-flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-[color,background-color,box-shadow] outline-none",
  "hover:bg-accent hover:text-accent-foreground",
  "focus-visible:ring-[3px] focus-visible:ring-ring/50",
  "disabled:pointer-events-none disabled:opacity-50",
);

const SKELETON_WIDTHS = ["w-11/12", "w-4/5", "w-3/5"];

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
      defaultSourceText,
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
      showCount = true,
      showCopy = true,
      showClear = true,
      maxLength,
      loading = false,
      onTargetCopy,
      labels,
      classNames,
      dir,
      className,
      ...rest
    },
    forwardedRef,
  ) {
    const [source, setSource] = useControllableState(
      sourceText,
      defaultSourceText ?? "",
      onSourceChange,
    );
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
    // Each swap turns the icon another half revolution, so it always spins the
    // same way instead of rocking back and forth.
    const [swapCount, setSwapCount] = React.useState(0);
    const [copied, setCopied] = React.useState(false);
    const copiedTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
    const sourceRef = React.useRef<HTMLTextAreaElement>(null);

    React.useEffect(
      () => () => {
        if (copiedTimer.current) clearTimeout(copiedTimer.current);
      },
      [],
    );

    const text: TranslationWidgetLabels = {
      swap: labels?.swap ?? DEFAULT_LABELS.swap,
      copy: labels?.copy ?? DEFAULT_LABELS.copy,
      copied: labels?.copied ?? DEFAULT_LABELS.copied,
      copiedStatus: labels?.copiedStatus ?? DEFAULT_LABELS.copiedStatus,
      clearSource: labels?.clearSource ?? DEFAULT_LABELS.clearSource,
      characters: labels?.characters ?? DEFAULT_LABELS.characters,
      languageSwitcher: labels?.languageSwitcher,
    };
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
      setSwapCount((n) => n + 1);
      onSwap?.();
    };

    const handleCopy = async () => {
      const clipboard = typeof navigator !== "undefined" ? navigator.clipboard : undefined;
      if (!clipboard?.writeText || !target) return;
      try {
        await clipboard.writeText(target);
      } catch {
        return;
      }
      setCopied(true);
      onTargetCopy?.(target);
      if (copiedTimer.current) clearTimeout(copiedTimer.current);
      copiedTimer.current = setTimeout(() => setCopied(false), 1500);
    };

    const handleClear = () => {
      setSource("");
      sourceRef.current?.focus();
    };

    const id = React.useId();
    const sourceId = `${id}-source`;
    const targetId = `${id}-target`;
    const countId = `${id}-count`;

    const atLimit = maxLength !== undefined && source.length >= maxLength;

    const renderChip = (code: string) => (
      <span
        className={cn(
          "inline-flex h-8 items-center gap-1.5 rounded-md px-2.5 text-sm font-medium",
          classNames?.chip,
        )}
      >
        {getLocaleLabel(code)}
        <span className="font-mono text-xs font-normal text-muted-foreground">{code}</span>
      </span>
    );

    const paneClass = cn(
      "relative flex min-w-0 flex-col transition-shadow",
      "focus-within:ring-[3px] focus-within:ring-ring/20 focus-within:ring-inset",
      classNames?.pane,
    );

    const textareaClass = cn(
      "block min-h-40 w-full flex-1 resize-none bg-transparent px-4 pt-3 pb-1 text-base leading-relaxed outline-none field-sizing-content",
      "placeholder:text-muted-foreground sm:text-[0.9375rem]",
      classNames?.textarea,
    );

    const footerClass = cn("flex h-11 items-center gap-1 px-2.5", classNames?.footer);

    return (
      <MotionConfig reducedMotion="user">
        <div
          ref={forwardedRef}
          dir={dir}
          className={cn(
            "w-full rounded-xl border bg-card text-card-foreground shadow-sm",
            classNames?.root,
            className,
          )}
          {...rest}
        >
          <div
            className={cn(
              "flex items-center gap-2 border-b px-2 py-1.5 sm:grid sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]",
              classNames?.header,
            )}
          >
            <div className="flex min-w-0 flex-1 items-center">
              {canPickSourceLocale ? (
                <LanguageSwitcher
                  locales={locales}
                  value={activeSourceLocale}
                  onValueChange={setActiveSourceLocale}
                  variant="ghost"
                  size="sm"
                  labels={text.languageSwitcher}
                />
              ) : (
                renderChip(activeSourceLocale)
              )}
            </div>

            <motion.button
              type="button"
              onClick={handleSwap}
              disabled={!canSwap}
              aria-label={text.swap}
              whileTap={canSwap ? { scale: 0.92 } : undefined}
              className={cn(
                "inline-flex size-8 shrink-0 items-center justify-center rounded-full border bg-background text-muted-foreground shadow-xs transition-[color,background-color,box-shadow] outline-none",
                "hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:hover:bg-input/50",
                "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
                "disabled:pointer-events-none disabled:opacity-50",
                classNames?.swap,
              )}
            >
              <motion.span
                aria-hidden="true"
                className="inline-flex"
                animate={{ rotate: swapCount * 180 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                <ArrowLeftRightIcon className="size-4" />
              </motion.span>
            </motion.button>

            <div className="flex min-w-0 flex-1 items-center justify-end sm:justify-start sm:ps-2">
              {canPickTargetLocale ? (
                <LanguageSwitcher
                  locales={locales}
                  value={activeTargetLocale}
                  onValueChange={setActiveTargetLocale}
                  variant="ghost"
                  size="sm"
                  align="end"
                  labels={text.languageSwitcher}
                />
              ) : (
                renderChip(activeTargetLocale)
              )}
            </div>
          </div>

          <div className="grid overflow-hidden rounded-b-xl sm:grid-cols-2">
            <div className={cn(paneClass, "border-b sm:border-e sm:border-b-0")}>
              <textarea
                ref={sourceRef}
                id={sourceId}
                value={source}
                onChange={(e) => setSource(e.target.value)}
                readOnly={sourceReadOnly}
                placeholder={sourcePlaceholder}
                aria-label={`${sourceLabel} (${getLocaleLabel(activeSourceLocale)})`}
                aria-describedby={showCount ? countId : undefined}
                maxLength={maxLength}
                dir={sourceRtl ? "rtl" : "ltr"}
                lang={activeSourceLocale}
                rows={5}
                className={cn(textareaClass, sourceReadOnly && "cursor-default")}
              />
              <div className={footerClass}>
                {showCount && (
                  <span
                    id={countId}
                    className={cn(
                      "ps-1.5 text-xs text-muted-foreground tabular-nums",
                      atLimit && "text-destructive",
                    )}
                  >
                    {maxLength !== undefined ? `${source.length} / ${maxLength}` : source.length}
                    <span className="sr-only">{` ${text.characters(source.length)}`}</span>
                  </span>
                )}
                <div className="ms-auto flex items-center gap-0.5">
                  {showClear && !sourceReadOnly && (
                    <button
                      type="button"
                      onClick={handleClear}
                      disabled={!source}
                      aria-label={text.clearSource}
                      className={ICON_BUTTON_CLASS}
                    >
                      <XIcon aria-hidden="true" className="size-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className={cn(paneClass, "bg-muted/40")}>
              <div className="relative flex flex-1 flex-col">
                <textarea
                  id={targetId}
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  readOnly={targetReadOnly}
                  placeholder={loading ? undefined : targetPlaceholder}
                  aria-label={`${targetLabel} (${getLocaleLabel(activeTargetLocale)})`}
                  aria-busy={loading || undefined}
                  maxLength={maxLength}
                  dir={targetRtl ? "rtl" : "ltr"}
                  lang={activeTargetLocale}
                  rows={5}
                  className={cn(
                    textareaClass,
                    targetReadOnly && "cursor-default",
                    loading && "opacity-0",
                  )}
                />
                {loading && (
                  <div
                    aria-hidden="true"
                    data-slot="skeleton"
                    className="pointer-events-none absolute inset-x-4 top-4 space-y-3"
                  >
                    {SKELETON_WIDTHS.map((width) => (
                      <div
                        key={width}
                        className={cn("h-3.5 animate-pulse rounded-full bg-foreground/10", width)}
                      />
                    ))}
                  </div>
                )}
              </div>
              <div className={footerClass}>
                <div className="ms-auto flex items-center gap-0.5">
                  {showCopy && (
                    <button
                      type="button"
                      onClick={handleCopy}
                      disabled={!target || loading}
                      aria-label={copied ? text.copied : text.copy}
                      className={ICON_BUTTON_CLASS}
                    >
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.span
                          key={copied ? "copied" : "copy"}
                          aria-hidden="true"
                          className="inline-flex"
                          initial={{ opacity: 0, scale: 0.6 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.6 }}
                          transition={{ duration: 0.12 }}
                        >
                          {copied ? (
                            <CheckIcon className="size-4 text-primary" />
                          ) : (
                            <CopyIcon className="size-4" />
                          )}
                        </motion.span>
                      </AnimatePresence>
                    </button>
                  )}
                  <span role="status" aria-live="polite" className="sr-only">
                    {copied ? text.copiedStatus : ""}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MotionConfig>
    );
  },
);
