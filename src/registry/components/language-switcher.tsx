"use client";

import * as React from "react";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useIsPresent,
  type HTMLMotionProps,
} from "motion/react";
import { CheckIcon, ChevronDownIcon, GlobeIcon, SearchIcon, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useControllableState } from "@/lib/use-controllable-state";
import { useListboxNavigation } from "@/lib/use-listbox-navigation";
import type { Locale } from "./types";
import { getFlag, getLanguageName, isRtl } from "./locale-data";

export type { Locale };

/** Per-part class overrides, merged after the defaults with `cn`. */
export interface LanguageSwitcherClassNames {
  /** The button that opens the menu */
  trigger?: string;
  /** The floating menu panel */
  content?: string;
  /** The search row, including its icon */
  search?: string;
  /** The scrolling option list */
  list?: string;
  /** Each option row */
  item?: string;
  /** The empty-state message */
  empty?: string;
}

/** State passed to `renderOption`. */
export interface LanguageSwitcherOptionState {
  /** The option is the selected locale */
  selected: boolean;
  /** The option is highlighted by the keyboard or pointer */
  active: boolean;
  /** Resolved display label */
  label: string;
  /** Resolved flag emoji */
  flag: string;
}

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
  /** Show the locale code beside each option, e.g. `fr` (default: false) */
  showCode?: boolean;
  /** Display labels in native language or English (default: "english") */
  label?: "native" | "english";
  /** Max height of the scrolling option list, before it scrolls (default: "15rem") */
  maxHeight?: number | string;
  /** Trigger style (default: "outline") */
  variant?: "outline" | "ghost" | "secondary";
  /** Trigger size (default: "default") */
  size?: "sm" | "default" | "lg";
  /** Edge of the trigger the menu lines up with, in reading direction (default: "start") */
  align?: "start" | "end";
  /**
   * Preferred side for the menu (default: "bottom"). It flips to the other side
   * when there is not enough room in the viewport.
   */
  side?: "top" | "bottom";
  /** Show the search field (default: true) */
  searchable?: boolean;
  /** Placeholder for the search field (default: "Search languages...") */
  searchPlaceholder?: string;
  /** Content shown when the search matches nothing (default: "No languages found.") */
  emptyMessage?: React.ReactNode;
  /** Disable the trigger */
  disabled?: boolean;
  /** Replace the content of each option row. The row keeps its button, role and state. */
  renderOption?: (locale: Locale, state: LanguageSwitcherOptionState) => React.ReactNode;
  /** Per-part class overrides */
  classNames?: LanguageSwitcherClassNames;
}

/**
 * The menu panel. While it plays its exit animation it is still mounted, so it
 * leaves the accessibility tree first: a closing menu is not a menu.
 */
const MenuPanel = React.forwardRef<HTMLDivElement, HTMLMotionProps<"div">>(
  function MenuPanel(props, ref) {
    const isPresent = useIsPresent();
    return (
      <motion.div
        ref={ref}
        aria-hidden={isPresent ? undefined : true}
        {...props}
        // Set on render rather than animated: a panel reopened mid-exit is the
        // same element, and must take clicks again immediately.
        style={{ ...props.style, pointerEvents: isPresent ? undefined : "none" }}
      />
    );
  },
);

const TRIGGER_VARIANTS = {
  outline:
    "border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground aria-expanded:bg-accent aria-expanded:text-accent-foreground dark:bg-input/30 dark:hover:bg-input/50 dark:aria-expanded:bg-input/50",
  ghost:
    "hover:bg-accent hover:text-accent-foreground aria-expanded:bg-accent aria-expanded:text-accent-foreground dark:hover:bg-accent/50",
  secondary:
    "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80 aria-expanded:bg-secondary/80",
} as const;

const TRIGGER_SIZES = {
  sm: "h-8 gap-1.5 rounded-md px-2.5",
  default: "h-9 gap-2 rounded-md px-3",
  lg: "h-10 gap-2 rounded-md px-4",
} as const;

export const LanguageSwitcher = React.forwardRef<HTMLDivElement, LanguageSwitcherProps>(
  function LanguageSwitcher(
    {
      locales,
      value,
      defaultValue,
      onValueChange,
      showFlags = false,
      showCode = false,
      label: labelMode = "english",
      maxHeight = "15rem",
      variant = "outline",
      size = "default",
      align = "start",
      side: preferredSide = "bottom",
      searchable = true,
      searchPlaceholder = "Search languages...",
      emptyMessage = "No languages found.",
      disabled = false,
      renderOption,
      classNames,
      className,
      onKeyDown,
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
    const [side, setSide] = React.useState(preferredSide);
    const ref = React.useRef<HTMLDivElement>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const triggerRef = React.useRef<HTMLButtonElement>(null);
    const popupRef = React.useRef<HTMLDivElement>(null);

    React.useImperativeHandle(forwardedRef, () => ref.current as HTMLDivElement);

    const resolveLabel = (l: Locale) => l.label ?? getLanguageName(l.code, labelMode) ?? l.code;
    const activeLocale = locales.find((l) => l.code === locale);
    const activeLabel = activeLocale ? resolveLabel(activeLocale) : locale;

    const query = search.trim().toLowerCase();
    const filtered = locales.filter(
      (l) => resolveLabel(l).toLowerCase().includes(query) || l.code.toLowerCase().includes(query),
    );

    const nav = useListboxNavigation({
      count: filtered.length,
      open,
      // Without a search field there is nothing to hold `aria-activedescendant`,
      // so focus moves onto the options themselves.
      strategy: searchable ? "activedescendant" : "roving",
      // Land on the current selection when the popup opens.
      initialIndex: filtered.findIndex((l) => l.code === locale),
      onClose: () => {
        setOpen(false);
        setSearch("");
      },
      onOpen: () => !disabled && setOpen(true),
      onSelect: (index) => {
        const picked = filtered[index];
        if (picked) setLocale(picked.code);
      },
      triggerRef: () => triggerRef.current,
    });

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
      if (open && searchable) inputRef.current?.focus();
    }, [open, searchable]);

    // Flip to the other side when the preferred one has no room. Measured before
    // paint, so the menu never flashes on the wrong side.
    React.useLayoutEffect(() => {
      if (!open) return;
      const trigger = triggerRef.current;
      const popup = popupRef.current;
      if (!trigger || !popup) return;
      const rect = trigger.getBoundingClientRect();
      const needed = popup.offsetHeight + 8;
      const below = window.innerHeight - rect.bottom;
      const above = rect.top;
      if (preferredSide === "bottom" && below < needed && above > below) setSide("top");
      else if (preferredSide === "top" && above < needed && below > above) setSide("bottom");
      else setSide(preferredSide);
    }, [open, preferredSide]);

    const offset = side === "bottom" ? -4 : 4;

    return (
      <MotionConfig reducedMotion="user">
        <div
          ref={ref}
          dir={dir}
          className={cn("relative inline-block text-sm", className)}
          onKeyDown={(event) => {
            nav.onKeyDown(event);
            onKeyDown?.(event);
          }}
          {...rest}
        >
          <button
            ref={triggerRef}
            type="button"
            disabled={disabled}
            onClick={() => setOpen(!open)}
            data-state={open ? "open" : "closed"}
            className={cn(
              "inline-flex items-center text-sm font-medium whitespace-nowrap transition-[color,background-color,border-color,box-shadow] outline-none select-none",
              "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
              "disabled:pointer-events-none disabled:opacity-50",
              TRIGGER_VARIANTS[variant],
              TRIGGER_SIZES[size],
              classNames?.trigger,
            )}
            aria-expanded={open}
            aria-haspopup="listbox"
            aria-label={`Current language: ${activeLabel}`}
          >
            {showFlags ? (
              <span className="text-base leading-none">
                {activeLocale?.flag ?? getFlag(locale)}
              </span>
            ) : (
              <GlobeIcon aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
            )}
            <span>{activeLabel}</span>
            <ChevronDownIcon
              aria-hidden="true"
              className={cn(
                "-me-1 size-4 shrink-0 text-muted-foreground opacity-70 transition-transform duration-200",
                open && "rotate-180",
              )}
            />
          </button>

          <AnimatePresence>
            {open && (
              <MenuPanel
                ref={popupRef}
                data-side={side}
                initial={{ opacity: 0, y: offset }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: offset }}
                transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className={cn(
                  "absolute z-50 w-max min-w-full overflow-hidden rounded-lg border bg-popover text-popover-foreground shadow-lg sm:min-w-56",
                  side === "bottom" ? "top-full mt-1.5" : "bottom-full mb-1.5",
                  align === "end" ? "end-0" : "start-0",
                  classNames?.content,
                )}
              >
                {searchable && (
                  <div className={cn("flex items-center gap-2 border-b px-3", classNames?.search)}>
                    <SearchIcon aria-hidden="true" className="size-4 shrink-0 opacity-50" />
                    <input
                      ref={inputRef}
                      type="text"
                      placeholder={searchPlaceholder}
                      aria-label="Search languages"
                      autoComplete="off"
                      spellCheck={false}
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                        nav.resetActive();
                      }}
                      {...nav.comboboxProps}
                      className="h-10 w-full min-w-0 bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
                    />
                    {search && (
                      <button
                        type="button"
                        tabIndex={-1}
                        aria-label="Clear search"
                        onClick={() => {
                          setSearch("");
                          nav.resetActive();
                          inputRef.current?.focus();
                        }}
                        className="-me-1 inline-flex size-6 shrink-0 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                      >
                        <XIcon aria-hidden="true" className="size-3.5" />
                      </button>
                    )}
                  </div>
                )}
                {/* The listbox owns the options only — the search field above sits
                    outside it, per ARIA. It scrolls on its own: the page never does. */}
                <div
                  className={cn("overflow-y-auto overscroll-contain p-1", classNames?.list)}
                  style={{ maxHeight }}
                  role="listbox"
                  aria-label="Select language"
                  {...nav.listboxProps}
                >
                  {filtered.map((l, index) => {
                    const isCurrent = l.code === locale;
                    const isActive = index === nav.activeIndex;
                    const itemDir = (l.rtl ?? isRtl(l.code)) ? "rtl" : "ltr";
                    const itemLabel = resolveLabel(l);
                    const itemFlag = l.flag ?? getFlag(l.code);
                    return (
                      <button
                        key={l.code}
                        type="button"
                        role="option"
                        aria-selected={isCurrent}
                        dir={itemDir}
                        onClick={() => nav.select(index)}
                        {...nav.optionProps(index)}
                        className={cn(
                          "relative flex w-full cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-start text-sm outline-none select-none",
                          "data-[active=true]:bg-accent data-[active=true]:text-accent-foreground",
                          classNames?.item,
                        )}
                      >
                        {renderOption ? (
                          renderOption(l, {
                            selected: isCurrent,
                            active: isActive,
                            label: itemLabel,
                            flag: itemFlag,
                          })
                        ) : (
                          <>
                            {showFlags && (
                              <span className="text-base leading-none">{itemFlag}</span>
                            )}
                            <span className="flex-1 truncate">{itemLabel}</span>
                            {showCode && (
                              <span className="font-mono text-xs text-muted-foreground">
                                {l.code}
                              </span>
                            )}
                            <CheckIcon
                              aria-hidden="true"
                              className={cn(
                                "size-4 shrink-0 text-primary",
                                isCurrent ? "opacity-100" : "opacity-0",
                              )}
                            />
                          </>
                        )}
                      </button>
                    );
                  })}
                  {filtered.length === 0 && (
                    <div
                      className={cn(
                        "py-6 text-center text-sm text-muted-foreground",
                        classNames?.empty,
                      )}
                    >
                      {emptyMessage}
                    </div>
                  )}
                </div>
              </MenuPanel>
            )}
          </AnimatePresence>
        </div>
      </MotionConfig>
    );
  },
);
