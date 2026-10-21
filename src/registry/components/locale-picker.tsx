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
import { getFlag, isRtl } from "./locale-data";

export type { Locale };

/** Per-part class overrides, merged after the defaults with `cn`. */
export interface LocalePickerClassNames {
  /** The button that opens the region list */
  trigger?: string;
  /** The floating popup panel */
  content?: string;
  /** The search row, including its icon and clear button */
  search?: string;
  /** The scrolling option list */
  list?: string;
  /** Each option row */
  item?: string;
  /** The empty-state message */
  empty?: string;
  /** The summary card of derived locale preferences */
  summary?: string;
}

/** Built-in UI text. Every key is optional in `labels`; omitted keys keep the English default. */
export interface LocalePickerLabels {
  /** Placeholder for the search field (default: "Search regions...") */
  searchPlaceholder: string;
  /** Accessible label for the search field (default: "Search regions") */
  searchLabel: string;
  /** Accessible label for the button that clears the search (default: "Clear search") */
  clearSearch: string;
  /** Content shown when the search matches nothing (default: "No results") */
  emptyMessage: React.ReactNode;
  /** Accessible label for the option list (default: "Select region") */
  listbox: string;
  /** Accessible label for the trigger (default: "Current region: {name}") */
  current: (name: string) => string;
  /** Summary row label for the currency preview (default: "Currency") */
  currency: string;
  /** Summary row label for the date preview (default: "Date format") */
  dateFormat: string;
  /** Summary row label for the number preview (default: "Number format") */
  numberFormat: string;
  /** Summary row label for the first day of week (default: "Week starts on") */
  weekStart: string;
}

const DEFAULT_LABELS: LocalePickerLabels = {
  searchPlaceholder: "Search regions...",
  searchLabel: "Search regions",
  clearSearch: "Clear search",
  emptyMessage: "No results",
  listbox: "Select region",
  current: (name) => `Current region: ${name}`,
  currency: "Currency",
  dateFormat: "Date format",
  numberFormat: "Number format",
  weekStart: "Week starts on",
};

/**
 * The popup panel. While it plays its exit animation it is still mounted, so it
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

/** Sample amount behind the currency and number previews. */
const SAMPLE_AMOUNT = 1234567.89;
/**
 * Sample date behind the date preview. Built in local time, so every timezone
 * renders 15 January 2026 and the server and the client agree byte for byte.
 */
const SAMPLE_DATE = new Date(2026, 0, 15);
/** Locale used for formatting when the selected value is not a well-formed tag. */
const FALLBACK_LOCALE = "en";

/**
 * ISO 4217 code for a region. Regions outside the table — territories that
 * share a currency, the odd unrecognized code — show "—" rather than a guess.
 */
const REGION_CURRENCY: Record<string, string> = {
  AE: "AED",
  AF: "AFN",
  AL: "ALL",
  AM: "AMD",
  AR: "ARS",
  AT: "EUR",
  AU: "AUD",
  AZ: "AZN",
  BA: "BAM",
  BD: "BDT",
  BE: "EUR",
  BG: "EUR",
  BH: "BHD",
  BR: "BRL",
  BY: "BYN",
  BZ: "BZD",
  CA: "CAD",
  CH: "CHF",
  CL: "CLP",
  CN: "CNY",
  CO: "COP",
  CR: "CRC",
  CY: "EUR",
  CZ: "CZK",
  DE: "EUR",
  DK: "DKK",
  DO: "DOP",
  DZ: "DZD",
  EC: "USD",
  EE: "EUR",
  EG: "EGP",
  ES: "EUR",
  ET: "ETB",
  FI: "EUR",
  FR: "EUR",
  GB: "GBP",
  GE: "GEL",
  GH: "GHS",
  GR: "EUR",
  GT: "GTQ",
  HK: "HKD",
  HR: "EUR",
  HU: "HUF",
  ID: "IDR",
  IE: "EUR",
  IL: "ILS",
  IN: "INR",
  IS: "ISK",
  IT: "EUR",
  JO: "JOD",
  JP: "JPY",
  KE: "KES",
  KR: "KRW",
  KW: "KWD",
  KZ: "KZT",
  LB: "LBP",
  LK: "LKR",
  LT: "EUR",
  LU: "EUR",
  LV: "EUR",
  MA: "MAD",
  MD: "MDL",
  MK: "MKD",
  MN: "MNT",
  MO: "MOP",
  MT: "EUR",
  MX: "MXN",
  MY: "MYR",
  MV: "MVR",
  NG: "NGN",
  NO: "NOK",
  NP: "NPR",
  NZ: "NZD",
  OM: "OMR",
  PH: "PHP",
  PK: "PKR",
  PL: "PLN",
  PR: "USD",
  PT: "EUR",
  QA: "QAR",
  RO: "RON",
  RS: "RSD",
  RU: "RUB",
  SA: "SAR",
  SE: "SEK",
  SG: "SGD",
  SI: "EUR",
  SK: "EUR",
  TH: "THB",
  TN: "TND",
  TR: "TRY",
  TW: "TWD",
  TZ: "TZS",
  UA: "UAH",
  UG: "UGX",
  US: "USD",
  UY: "UYU",
  UZ: "UZS",
  VE: "VES",
  VN: "VND",
  ZA: "ZAR",
};

/**
 * First day of week (1 = Monday … 7 = Sunday) for every currency-mapped
 * region whose CLDR week does not start on Monday, consulted only on engines
 * without `Intl.Locale.prototype.getWeekInfo`. Mirrors current CLDR (Monday-
 * starting regions are omitted) and is kept in sync with the runtime's week
 * data by the tests.
 */
const REGION_FIRST_DAY: Record<string, number> = {
  AF: 6,
  BD: 7,
  BH: 6,
  BR: 7,
  BZ: 7,
  CA: 7,
  CO: 7,
  DO: 7,
  DZ: 6,
  EG: 6,
  ET: 7,
  GT: 7,
  HK: 7,
  ID: 7,
  IL: 7,
  IN: 7,
  IS: 7,
  JO: 6,
  JP: 7,
  KE: 7,
  KR: 7,
  KW: 6,
  MO: 7,
  MT: 7,
  MX: 7,
  MV: 5,
  NP: 7,
  OM: 6,
  PH: 7,
  PK: 7,
  PR: 7,
  PT: 7,
  QA: 6,
  SA: 7,
  SG: 7,
  TH: 7,
  TW: 7,
  US: 7,
  VE: 7,
  ZA: 7,
};

/** English weekday names, used only when `Intl.DateTimeFormat` cannot help. */
const WEEKDAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

interface WeekInfo {
  /** 1 = Monday … 7 = Sunday, per the ECMA-402 `WeekInfo` record. */
  firstDay: number;
  weekend?: number[];
  minimalDays?: number;
}

/** `getWeekInfo` is not in the TS lib yet, and Safari shipped it as `weekInfo`. */
type LocaleWithWeekInfo = {
  getWeekInfo?(): WeekInfo;
  readonly weekInfo?: WeekInfo;
};

/** Canonicalizes a BCP 47 tag, falling back to `"en"` for malformed input. */
function canonicalize(locale: string): string {
  try {
    return Intl.getCanonicalLocales(locale)[0] ?? FALLBACK_LOCALE;
  } catch {
    return FALLBACK_LOCALE;
  }
}

/** The tag's region subtag, or undefined when it has none. */
function regionOf(locale: string): string | undefined {
  try {
    const parsed = new Intl.Locale(locale);
    if (parsed.region) return parsed.region.toUpperCase();
  } catch {
    // Fall through to the structural guess below.
  }
  // In a well-formed tag only a region subtag is exactly two letters, so a
  // successful parse that found none still cannot be second-guessed here.
  const parts = locale.split("-");
  const last = parts[parts.length - 1];
  return parts.length > 1 && /^[A-Za-z]{2}$/.test(last) ? last.toUpperCase() : undefined;
}

/** The same tag with its region replaced — `en-IN` + US → `en-US`. */
function withRegion(locale: string, region: string): string {
  try {
    return new Intl.Locale(locale, { region: region.toUpperCase() }).toString();
  } catch {
    return `${locale}-${region.toUpperCase()}`;
  }
}

/** Localized display name for a region, or undefined when there is no region. */
function regionDisplayName(
  region: string | undefined,
  locale: string,
  mode: "native" | "english",
): string | undefined {
  if (!region) return undefined;
  const locales = mode === "english" ? ["en"] : [locale];
  try {
    return new Intl.DisplayNames(locales, { type: "region" }).of(region) ?? region;
  } catch {
    return region;
  }
}

/** First day of week from `Intl`, else the table, else Monday. */
function firstDayOfWeek(locale: string, region: string | undefined): number {
  try {
    const tag = new Intl.Locale(locale) as Intl.Locale & LocaleWithWeekInfo;
    const info = tag.getWeekInfo?.() ?? tag.weekInfo;
    if (info && Number.isInteger(info.firstDay)) return info.firstDay;
  } catch {
    // Fall through to the table below.
  }
  if (region) return REGION_FIRST_DAY[region] ?? 1;
  return 1;
}

/** Localized name of the weekday the week starts on. */
function firstWeekdayName(locale: string, firstDay: number): string {
  // `firstDay` is 1 = Monday … 7 = Sunday; `Date#getDay` is 0 = Sunday … 6 = Saturday.
  const offset = firstDay === 7 ? 0 : firstDay;
  // 4 January 2026 is a Sunday — a fixed anchor keeps SSR and client identical.
  const date = new Date(2026, 0, 4 + offset);
  try {
    return new Intl.DateTimeFormat(locale, { weekday: "long" }).format(date);
  } catch {
    return WEEKDAY_NAMES[offset];
  }
}

interface LocalePreferences {
  /** ISO 4217 code for the region, when the table has one. */
  currency?: string;
  /** Sample amount as currency — empty when the currency is unknown. */
  currencyPreview: string;
  /** Sample date in the locale's medium date style. */
  datePreview: string;
  /** Sample amount in the locale's default number style. */
  numberPreview: string;
  /** Localized name of the weekday the week starts on. */
  firstWeekday: string;
}

/** Everything the summary card shows, derived through `Intl` from the locale. */
function derivePreferences(locale: string, region: string | undefined): LocalePreferences {
  const currency = region ? REGION_CURRENCY[region] : undefined;
  return {
    currency,
    currencyPreview: currency
      ? new Intl.NumberFormat(locale, { style: "currency", currency }).format(SAMPLE_AMOUNT)
      : "",
    datePreview: new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(SAMPLE_DATE),
    numberPreview: new Intl.NumberFormat(locale).format(SAMPLE_AMOUNT),
    firstWeekday: firstWeekdayName(locale, firstDayOfWeek(locale, region)),
  };
}

export interface LocalePickerProps extends Omit<
  React.ComponentPropsWithoutRef<"div">,
  "defaultValue" | "onChange"
> {
  /** Regions to choose from, as ISO 3166-1 alpha-2 codes (e.g. `["IN", "US", "DE"]`). */
  regions: string[];
  /**
   * Selected locale as a BCP 47 tag (e.g. `"en-IN"`). Its region subtag is the
   * selected region; its language subtag survives region changes. Provide this
   * to control the component.
   */
  value?: string;
  /**
   * Initial selected locale when uncontrolled. Falls back to `en-<first region>`
   * when omitted.
   */
  defaultValue?: string;
  /** Callback when the region changes — receives the full new BCP 47 tag. */
  onValueChange?: (locale: string) => void;
  /**
   * Region display names in English (default), or localized to the selected
   * locale with `"native"`.
   */
  label?: "native" | "english";
  /** Show the region's flag emoji next to its name (default: true). */
  showFlags?: boolean;
  /** Max height of the scrolling option list, before it scrolls (default: "15rem"). */
  maxHeight?: number | string;
  /** Trigger style (default: "outline") */
  variant?: "outline" | "ghost" | "secondary";
  /** Trigger size (default: "default") */
  size?: "sm" | "default" | "lg";
  /** Edge of the trigger the popup lines up with, in reading direction (default: "start") */
  align?: "start" | "end";
  /**
   * Preferred side for the popup (default: "bottom"). It flips to the other side
   * when there is not enough room in the viewport.
   */
  side?: "top" | "bottom";
  /** Show the search field (default: true) */
  searchable?: boolean;
  /** Placeholder for the search field (default: "Search regions...") */
  searchPlaceholder?: string;
  /** Content shown when the search matches nothing (default: "No results") */
  emptyMessage?: React.ReactNode;
  /** Disable the trigger */
  disabled?: boolean;
  /** Per-part class overrides */
  classNames?: LocalePickerClassNames;
  /** Show the summary card of derived locale defaults (default: true) */
  showSummary?: boolean;
  /** Override the built-in English UI text; omitted keys keep their default */
  labels?: Partial<LocalePickerLabels>;
}

/** A region rendered as the shared `Locale` shape, plus search plumbing. */
interface RegionOption extends Locale {
  /** The region this entry stands for. */
  region: string;
  /** Pre-lowered text the search field matches against. */
  search: string;
}

export const LocalePicker = React.forwardRef<HTMLDivElement, LocalePickerProps>(
  function LocalePicker(
    {
      regions,
      value,
      defaultValue,
      onValueChange,
      label: labelMode = "english",
      showFlags = true,
      maxHeight = "15rem",
      variant = "outline",
      size = "default",
      align = "start",
      side: preferredSide = "bottom",
      searchable = true,
      searchPlaceholder,
      emptyMessage,
      disabled = false,
      showSummary = true,
      labels,
      classNames,
      className,
      onKeyDown,
      ...rest
    },
    forwardedRef,
  ) {
    const [locale, setLocale] = useControllableState(
      value,
      defaultValue ?? (regions[0] ? withRegion(FALLBACK_LOCALE, regions[0]) : FALLBACK_LOCALE),
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

    const active = canonicalize(locale);
    const region = regionOf(active);

    const text: LocalePickerLabels = {
      searchPlaceholder:
        searchPlaceholder ?? labels?.searchPlaceholder ?? DEFAULT_LABELS.searchPlaceholder,
      searchLabel: labels?.searchLabel ?? DEFAULT_LABELS.searchLabel,
      clearSearch: labels?.clearSearch ?? DEFAULT_LABELS.clearSearch,
      emptyMessage:
        emptyMessage !== undefined
          ? emptyMessage
          : (labels?.emptyMessage ?? DEFAULT_LABELS.emptyMessage),
      listbox: labels?.listbox ?? DEFAULT_LABELS.listbox,
      current: labels?.current ?? DEFAULT_LABELS.current,
      currency: labels?.currency ?? DEFAULT_LABELS.currency,
      dateFormat: labels?.dateFormat ?? DEFAULT_LABELS.dateFormat,
      numberFormat: labels?.numberFormat ?? DEFAULT_LABELS.numberFormat,
      weekStart: labels?.weekStart ?? DEFAULT_LABELS.weekStart,
    };
    const activeName = regionDisplayName(region, active, labelMode) ?? active;

    // Rebuilt only when the selection, the label mode, or the list itself
    // changes — not on every search keystroke. One `DisplayNames` per mode
    // serves the whole list instead of two instances per region.
    const options: RegionOption[] = React.useMemo(() => {
      const displayNames = (locales: string[]) => {
        try {
          return new Intl.DisplayNames(locales, { type: "region" });
        } catch {
          return undefined;
        }
      };
      const names = displayNames([active]);
      const englishNames = displayNames(["en"]);
      const nameOf = (instance: Intl.DisplayNames | undefined, code: string) => {
        try {
          return instance?.of(code) ?? code;
        } catch {
          return code;
        }
      };
      // Repeated regions — the same code twice, or mixed case — would collide
      // as React keys, so the list keeps one option per distinct code.
      const unique = [...new Set(regions.map((entry) => entry.toUpperCase()))];
      return unique.map((upper) => {
        const code = withRegion(active, upper);
        const label = nameOf(labelMode === "english" ? englishNames : names, upper);
        const english = nameOf(englishNames, upper);
        return {
          code,
          region: upper,
          label,
          // The full tag — `getFlag` resolves flags from a region subtag, and a
          // bare region like "IN" would be read as a language code instead.
          flag: getFlag(code),
          rtl: isRtl(code),
          // The BCP 47 tag is omitted: every option shares the active language
          // subtag, so it would match all of them. The region subtag is `upper`.
          search: `${upper} ${label} ${english}`.toLowerCase(),
        };
      });
    }, [regions, active, labelMode]);

    const query = search.trim().toLowerCase();
    const filtered = query ? options.filter((option) => option.search.includes(query)) : options;

    const nav = useListboxNavigation({
      count: filtered.length,
      open,
      // Without a search field there is nothing to hold `aria-activedescendant`,
      // so focus moves onto the options themselves.
      strategy: searchable ? "activedescendant" : "roving",
      // Land on the current selection when the popup opens.
      initialIndex: filtered.findIndex((option) => option.region === region),
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

    const preferences = React.useMemo(() => derivePreferences(active, region), [active, region]);
    const dir = isRtl(active) ? "rtl" : "ltr";

    React.useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (ref.current && !ref.current.contains(event.target as Node)) {
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
    // paint, so the popup never flashes on the wrong side.
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
          className={cn("relative z-50 text-sm", className)}
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
            onClick={() => {
              if (open) setSearch("");
              setOpen(!open);
            }}
            data-state={open ? "open" : "closed"}
            className={cn(
              "inline-flex w-full items-center justify-between text-sm font-medium whitespace-nowrap transition-[color,background-color,border-color,box-shadow] outline-none select-none",
              "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
              "disabled:pointer-events-none disabled:opacity-50",
              TRIGGER_VARIANTS[variant],
              TRIGGER_SIZES[size],
              classNames?.trigger,
            )}
            aria-expanded={open}
            aria-haspopup="listbox"
            aria-label={text.current(activeName)}
          >
            <span className="inline-flex items-center gap-2">
              {showFlags && region ? (
                <span className="text-base leading-none">{getFlag(active)}</span>
              ) : (
                <GlobeIcon aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
              )}
              <span>{activeName}</span>
            </span>
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
                      placeholder={text.searchPlaceholder}
                      aria-label={text.searchLabel}
                      autoComplete="off"
                      spellCheck={false}
                      value={search}
                      onChange={(event) => {
                        setSearch(event.target.value);
                        nav.resetActive();
                      }}
                      {...nav.comboboxProps}
                      className="h-10 w-full min-w-0 bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
                    />
                    {search && (
                      <button
                        type="button"
                        tabIndex={-1}
                        aria-label={text.clearSearch}
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
                  aria-label={text.listbox}
                  {...nav.listboxProps}
                >
                  {filtered.map((option, index) => {
                    const isCurrent = option.region === region;
                    return (
                      <button
                        key={option.region}
                        type="button"
                        role="option"
                        aria-selected={isCurrent}
                        dir={option.rtl ? "rtl" : "ltr"}
                        data-locale={option.code}
                        onClick={() => nav.select(index)}
                        {...nav.optionProps(index)}
                        className={cn(
                          "relative flex w-full cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-start text-sm outline-none select-none",
                          "data-[active=true]:bg-accent data-[active=true]:text-accent-foreground",
                          isCurrent && "font-medium",
                          classNames?.item,
                        )}
                      >
                        {showFlags && <span className="text-base leading-none">{option.flag}</span>}
                        <span className="flex-1 truncate">{option.label}</span>
                        <CheckIcon
                          aria-hidden="true"
                          className={cn(
                            "size-4 shrink-0 text-primary",
                            isCurrent ? "opacity-100" : "opacity-0",
                          )}
                        />
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
                      {text.emptyMessage}
                    </div>
                  )}
                </div>
              </MenuPanel>
            )}
          </AnimatePresence>

          {showSummary && (
            <dl
              className={cn(
                "mt-3 divide-y divide-border rounded-lg border border-input bg-muted/40 px-3 text-xs",
                classNames?.summary,
              )}
              aria-live="polite"
            >
              <div className="flex items-baseline justify-between gap-4 py-2">
                <dt className="text-muted-foreground">{text.currency}</dt>
                <dd className="flex items-baseline justify-end gap-2 font-medium text-foreground">
                  {preferences.currency ? (
                    <>
                      <span className="font-mono text-[0.7rem] text-muted-foreground">
                        {preferences.currency}
                      </span>
                      <span>{preferences.currencyPreview}</span>
                    </>
                  ) : (
                    <span>—</span>
                  )}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 py-2">
                <dt className="text-muted-foreground">{text.dateFormat}</dt>
                <dd className="font-medium text-foreground">{preferences.datePreview}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 py-2">
                <dt className="text-muted-foreground">{text.numberFormat}</dt>
                <dd className="font-medium text-foreground">{preferences.numberPreview}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 py-2">
                <dt className="text-muted-foreground">{text.weekStart}</dt>
                <dd className="font-medium text-foreground">{preferences.firstWeekday}</dd>
              </div>
            </dl>
          )}
        </div>
      </MotionConfig>
    );
  },
);
