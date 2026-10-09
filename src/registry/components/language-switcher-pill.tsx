"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useControllableState } from "@/lib/use-controllable-state";
import type { Locale } from "./types";

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
}

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

const RTL_LOCALES = new Set(["ar", "he", "fa", "ur", "ps", "sd", "yi"]);

function isRtl(locale: Locale): boolean {
  if (locale.rtl !== undefined) return locale.rtl;

  return RTL_LOCALES.has(locale.code.split("-")[0].toLowerCase());
}

export const LanguageSwitcherPill = React.forwardRef<HTMLDivElement, LanguageSwitcherPillProps>(
  function LanguageSwitcherPill(
    { locale: localeProp, defaultLocale, locales, onLocaleChange, className, ...rest },
    forwardedRef,
  ) {
    const [locale, setLocale] = useControllableState(
      localeProp,
      defaultLocale ?? locales[0]?.code ?? "",
      onLocaleChange,
    );

    const rootRef = React.useRef<HTMLDivElement>(null);
    const buttonRefs = React.useRef<(HTMLButtonElement | null)[]>([]);

    const [indicator, setIndicator] = React.useState({
      width: 0,
      offset: 0,
    });

    React.useImperativeHandle(forwardedRef, () => rootRef.current as HTMLDivElement);

    const hasSelectedLocale = locales.some((item) => item.code === locale);

    const selectedLocale = hasSelectedLocale ? locale : (locales[0]?.code ?? "");

    const activeIndex = locales.findIndex((item) => item.code === selectedLocale);

    const activeLocale = activeIndex >= 0 ? locales[activeIndex] : undefined;

    const direction = activeLocale && isRtl(activeLocale) ? "rtl" : "ltr";

    const updateIndicator = React.useCallback(() => {
      const index = locales.findIndex((item) => item.code === selectedLocale);
      const button = buttonRefs.current[index];
      const root = rootRef.current;

      if (!button || !root) return;

      const buttonRect = button.getBoundingClientRect();
      const rootRect = root.getBoundingClientRect();
      const rootStyle = window.getComputedStyle(root);
      const paddingLeft = Number.parseFloat(rootStyle.paddingLeft) || 0;
      const paddingRight = Number.parseFloat(rootStyle.paddingRight) || 0;

      setIndicator({
        width: buttonRect.width,
        offset:
          direction === "rtl"
            ? rootRect.right - paddingRight - buttonRect.right
            : buttonRect.left - rootRect.left - paddingLeft,
      });
    }, [selectedLocale, locales, direction]);
    useIsomorphicLayoutEffect(() => {
      updateIndicator();
    }, [updateIndicator]);

    React.useEffect(() => {
      const root = rootRef.current;

      if (!root) return;

      const observer = new ResizeObserver(() => {
        updateIndicator();
      });

      observer.observe(root);

      return () => {
        observer.disconnect();
      };
    }, [updateIndicator]);

    const selectLocale = (code: string) => {
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
      <div
        ref={rootRef}
        dir={direction}
        className={cn(
          "relative inline-flex flex-row rounded-full border border-zinc-200 bg-zinc-100 p-1 dark:border-zinc-800 dark:bg-zinc-900",
          className,
        )}
        role="radiogroup"
        aria-label="Select language"
        {...rest}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-1 rounded-full bg-white shadow-sm transition-[left,right,width] duration-200 ease-out dark:bg-zinc-800"
          style={{
            width: indicator.width,
            ...(direction === "rtl" ? { right: indicator.offset } : { left: indicator.offset }),
          }}
        />

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
              tabIndex={isActive ? 0 : -1}
              onClick={() => selectLocale(item.code)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              className={cn(
                "relative z-10 rounded-full px-3 py-1.5 text-sm font-medium transition-colors duration-200",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50",
                "disabled:pointer-events-none disabled:opacity-50",
                isActive
                  ? "text-zinc-900 dark:text-zinc-50"
                  : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100",
              )}
            >
              {item.label ?? item.code}
            </button>
          );
        })}
      </div>
    );
  },
);
