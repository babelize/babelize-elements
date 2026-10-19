"use client";

import * as React from "react";
import { LayoutGroup, MotionConfig, motion } from "motion/react";
import { cn } from "@/lib/utils";
import { useControllableState } from "@/lib/use-controllable-state";
import type { Locale } from "./types";
import { getFlag } from "./locale-data";

/** Per-part class overrides, merged after the defaults with `cn`. */
export interface LanguageSwitcherPillClassNames {
  /** The track that holds every pill */
  root?: string;
  /** Each locale pill */
  item?: string;
  /** The selected pill */
  activeItem?: string;
  /** The sliding indicator behind the selected pill */
  indicator?: string;
  /** The flag shown when `showFlags` is set */
  flag?: string;
}

export interface LanguageSwitcherPillProps extends Omit<
  React.ComponentPropsWithoutRef<"div">,
  "defaultValue" | "onChange"
> {
  /** Currently selected locale code. */
  locale?: string;

  /** Initial selected locale when uncontrolled. */
  defaultLocale?: string;

  /** Available locales. */
  locales: Locale[];

  /** Called when the selected locale changes. */
  onLocaleChange?: (code: string) => void;

  /** Track style: a muted segmented track, or a bordered one (default: "default"). */
  variant?: "default" | "outline";

  /** Pill size (default: "default"). */
  size?: "sm" | "default" | "lg";

  /** Show the locale's flag emoji before its label (default: false). */
  showFlags?: boolean;

  /** Disable every pill. */
  disabled?: boolean;

  /** Accessible label for the radio group (default: "Select language"). */
  "aria-label"?: string;

  /** Per-part class overrides. */
  classNames?: LanguageSwitcherPillClassNames;
}

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

const RTL_LOCALES = new Set(["ar", "he", "fa", "ur", "ps", "sd", "yi"]);

function isRtl(locale: Locale): boolean {
  if (locale.rtl !== undefined) return locale.rtl;

  return RTL_LOCALES.has(locale.code.split("-")[0].toLowerCase());
}

const TRACK_VARIANTS = {
  default: "bg-muted",
  outline: "border border-input bg-background shadow-xs dark:bg-input/30",
} as const;

const INDICATOR_VARIANTS = {
  default: "bg-background shadow-sm ring-1 ring-black/5 dark:bg-input/60 dark:ring-white/10",
  outline: "bg-accent dark:bg-input/60",
} as const;

const TRACK_SIZES = {
  sm: "gap-0.5 p-0.5",
  default: "gap-0.5 p-1",
  lg: "gap-1 p-1",
} as const;

const ITEM_SIZES = {
  sm: "h-6 gap-1 px-2.5 text-xs",
  default: "h-7 gap-1.5 px-3 text-sm",
  lg: "h-9 gap-2 px-4 text-sm",
} as const;

export const LanguageSwitcherPill = React.forwardRef<HTMLDivElement, LanguageSwitcherPillProps>(
  function LanguageSwitcherPill(
    {
      locale: localeProp,
      defaultLocale,
      locales,
      onLocaleChange,
      variant = "default",
      size = "default",
      showFlags = false,
      disabled = false,
      classNames,
      className,
      dir: dirProp,
      "aria-label": ariaLabel = "Select language",
      ...rest
    },
    forwardedRef,
  ) {
    const [locale, setLocale] = useControllableState(
      localeProp,
      defaultLocale ?? locales[0]?.code ?? "",
      onLocaleChange,
    );

    const rootRef = React.useRef<HTMLDivElement>(null);
    const buttonRefs = React.useRef<(HTMLButtonElement | null)[]>([]);
    // Scopes the shared-layout indicator to this instance, so two pills on one
    // page never animate into each other.
    const layoutId = React.useId();

    React.useImperativeHandle(forwardedRef, () => rootRef.current as HTMLDivElement);

    const hasSelectedLocale = locales.some((item) => item.code === locale);

    const selectedLocale = hasSelectedLocale ? locale : (locales[0]?.code ?? "");

    const [inheritedDir, setInheritedDir] = React.useState<"ltr" | "rtl">(() => {
      if (
        typeof document !== "undefined" &&
        (document.documentElement?.dir === "rtl" || document.body?.dir === "rtl")
      ) {
        return "rtl";
      }
      return "ltr";
    });

    useIsomorphicLayoutEffect(() => {
      if (dirProp) return;
      const root = rootRef.current;
      if (!root) return;
      const computed = window.getComputedStyle(root).direction;
      if (computed === "rtl" || computed === "ltr") {
        setInheritedDir(computed);
      }
    }, [dirProp]);

    const direction = dirProp === "rtl" || dirProp === "ltr" ? dirProp : inheritedDir;

    const selectLocale = (code: string) => {
      if (disabled) return;
      setLocale(code);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
      let nextIndex = index;

      if (event.key === "Home") {
        nextIndex = 0;
      } else if (event.key === "End") {
        nextIndex = locales.length - 1;
      } else if (event.key === "ArrowRight") {
        nextIndex =
          direction === "rtl"
            ? (index - 1 + locales.length) % locales.length
            : (index + 1) % locales.length;
      } else if (event.key === "ArrowLeft") {
        nextIndex =
          direction === "rtl"
            ? (index + 1) % locales.length
            : (index - 1 + locales.length) % locales.length;
      } else {
        return;
      }

      event.preventDefault();

      const nextLocale = locales[nextIndex];

      if (!nextLocale) return;

      selectLocale(nextLocale.code);
      buttonRefs.current[nextIndex]?.focus();
    };

    return (
      <MotionConfig reducedMotion="user">
        <LayoutGroup id={layoutId}>
          <div
            ref={rootRef}
            dir={dirProp}
            className={cn(
              "relative inline-flex flex-row items-center rounded-full",
              TRACK_VARIANTS[variant],
              TRACK_SIZES[size],
              disabled && "opacity-50",
              classNames?.root,
              className,
            )}
            role="radiogroup"
            aria-label={ariaLabel}
            aria-disabled={disabled || undefined}
            data-disabled={disabled ? "" : undefined}
            {...rest}
          >
            {locales.map((item, index) => {
              const isActive = item.code === selectedLocale;

              return (
                <button
                  key={item.code}
                  ref={(element) => {
                    buttonRefs.current[index] = element;
                  }}
                  dir={isRtl(item) ? "rtl" : "ltr"}
                  type="button"
                  role="radio"
                  aria-checked={isActive}
                  data-state={isActive ? "checked" : "unchecked"}
                  tabIndex={isActive ? 0 : -1}
                  disabled={disabled}
                  onClick={() => selectLocale(item.code)}
                  onKeyDown={(event) => handleKeyDown(event, index)}
                  className={cn(
                    "relative inline-flex items-center justify-center rounded-full font-medium whitespace-nowrap transition-colors duration-200 outline-none select-none",
                    "focus-visible:ring-[3px] focus-visible:ring-ring/50",
                    "disabled:pointer-events-none",
                    ITEM_SIZES[size],
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
                    classNames?.item,
                    isActive && classNames?.activeItem,
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="indicator"
                      aria-hidden="true"
                      data-slot="indicator"
                      className={cn(
                        "pointer-events-none absolute inset-0 rounded-full",
                        INDICATOR_VARIANTS[variant],
                        classNames?.indicator,
                      )}
                      transition={{ type: "spring", bounce: 0.18, duration: 0.45 }}
                    />
                  )}
                  {showFlags && (
                    <span
                      aria-hidden="true"
                      className={cn("relative leading-none", classNames?.flag)}
                    >
                      {item.flag ?? getFlag(item.code)}
                    </span>
                  )}
                  <span className="relative">{item.label ?? item.code}</span>
                </button>
              );
            })}
          </div>
        </LayoutGroup>
      </MotionConfig>
    );
  },
);
