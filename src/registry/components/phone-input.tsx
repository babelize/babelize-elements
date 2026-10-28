"use client";

import * as React from "react";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useIsPresent,
  type HTMLMotionProps,
} from "motion/react";
import { CheckIcon, ChevronDownIcon, SearchIcon, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useControllableState } from "@/lib/use-controllable-state";
import { useListboxNavigation } from "@/lib/use-listbox-navigation";

export interface Country {
  /** ISO 3166-1 alpha-2 country code (e.g. "US") */
  code: string;
  /** E.164 dial prefix, including the leading "+" */
  dialCode: string;
  /** English country name */
  name: string;
  /** Flag emoji */
  flag: string;
}

/** Built-in UI text. Every key is optional in `labels`; omitted keys keep the English default. */
export interface PhoneInputLabels {
  /** Accessible label for the country trigger (default: "Select country") */
  trigger: string;
  /** Placeholder for the country search field (default: "Search countries...") */
  searchPlaceholder: string;
  /** Accessible label for the country search field (default: "Search countries") */
  searchLabel: string;
  /** Accessible label for the button that clears the search (default: "Clear search") */
  clearSearch: string;
  /** Content shown when the search matches nothing (default: "No countries found.") */
  emptyMessage: React.ReactNode;
  /** Accessible label for the country list (default: "Select country") */
  listbox: string;
}

const DEFAULT_LABELS: PhoneInputLabels = {
  trigger: "Select country",
  searchPlaceholder: "Search countries...",
  searchLabel: "Search countries",
  clearSearch: "Clear search",
  emptyMessage: "No countries found.",
  listbox: "Select country",
};

/** Per-part class overrides, merged after the defaults with `cn`. */
export interface PhoneInputClassNames {
  /** The outer wrapper that positions the menu */
  root?: string;
  /** The bordered field holding the country trigger and the number input */
  field?: string;
  /** The country trigger segment */
  trigger?: string;
  /** The number `<input>` */
  input?: string;
  /** The floating country menu panel */
  content?: string;
  /** The search row, including its icon */
  search?: string;
  /** The scrolling country list */
  list?: string;
  /** Each country row */
  item?: string;
  /** The empty-state message */
  empty?: string;
}

export interface PhoneInputProps extends Omit<
  React.ComponentPropsWithoutRef<"input">,
  "value" | "defaultValue" | "onChange" | "type" | "size"
> {
  /** Phone number. Provide this to control the component. */
  value?: string;
  /** Initial phone number when uncontrolled */
  defaultValue?: string;
  /** Callback when the number or the selected country changes */
  onValueChange?: (phone: string, country: Country) => void;
  /**
   * Selected country code (ISO 3166-1 alpha-2). Provide this to control the
   * component — pair it with `onCountryChange`.
   */
  country?: string;
  /** Callback when the selected country changes — from the menu or dial-code detection */
  onCountryChange?: (country: Country) => void;
  /** Initial selected country code when uncontrolled (default: "US") */
  defaultCountry?: string;
  /**
   * Countries offered in the menu, in display order (default: `COUNTRIES`).
   * Pass a subset to restrict the list or reorder it to put common ones first.
   */
  countries?: Country[];
  /** Show the flag emoji beside the dial code (default: true) */
  showFlags?: boolean;
  /** Accessible label for the field (default: "Phone number") */
  label?: string;
  /** Max height of the scrolling country list, before it scrolls (default: "15rem") */
  maxHeight?: number | string;
  /** Field size (default: "default") */
  size?: "sm" | "default" | "lg";
  /** Edge of the field the menu lines up with, in reading direction (default: "start") */
  align?: "start" | "end";
  /**
   * Preferred side for the menu (default: "bottom"). It flips to the other side
   * when there is not enough room in the viewport.
   */
  side?: "top" | "bottom";
  /** Placeholder for the country search field. Alias of `labels.searchPlaceholder`, wins over it */
  searchPlaceholder?: string;
  /** Empty-search content. Alias of `labels.emptyMessage`, wins over it */
  emptyMessage?: React.ReactNode;
  /** Override the built-in English UI text — any key you omit keeps its default */
  labels?: Partial<PhoneInputLabels>;
  /** BCP 47 locale used to display country names, e.g. "fr" (default: English names) */
  displayLocale?: string;
  /** Per-part class overrides. `className` still targets the root. */
  classNames?: PhoneInputClassNames;
}

const COUNTRIES: Country[] = [
  { code: "US", dialCode: "+1", name: "United States", flag: "\u{1F1FA}\u{1F1F8}" },
  { code: "GB", dialCode: "+44", name: "United Kingdom", flag: "\u{1F1EC}\u{1F1E7}" },
  { code: "IN", dialCode: "+91", name: "India", flag: "\u{1F1EE}\u{1F1F3}" },
  { code: "CA", dialCode: "+1", name: "Canada", flag: "\u{1F1E8}\u{1F1E6}" },
  { code: "AU", dialCode: "+61", name: "Australia", flag: "\u{1F1E6}\u{1F1FA}" },
  { code: "DE", dialCode: "+49", name: "Germany", flag: "\u{1F1E9}\u{1F1EA}" },
  { code: "FR", dialCode: "+33", name: "France", flag: "\u{1F1EB}\u{1F1F7}" },
  { code: "JP", dialCode: "+81", name: "Japan", flag: "\u{1F1EF}\u{1F1F5}" },
  { code: "BR", dialCode: "+55", name: "Brazil", flag: "\u{1F1E7}\u{1F1F7}" },
  { code: "CN", dialCode: "+86", name: "China", flag: "\u{1F1E8}\u{1F1F3}" },
  { code: "RU", dialCode: "+7", name: "Russia", flag: "\u{1F1F7}\u{1F1FA}" },
  { code: "KR", dialCode: "+82", name: "South Korea", flag: "\u{1F1F0}\u{1F1F7}" },
  { code: "IT", dialCode: "+39", name: "Italy", flag: "\u{1F1EE}\u{1F1F9}" },
  { code: "ES", dialCode: "+34", name: "Spain", flag: "\u{1F1EA}\u{1F1F8}" },
  { code: "MX", dialCode: "+52", name: "Mexico", flag: "\u{1F1F2}\u{1F1FD}" },
  { code: "NL", dialCode: "+31", name: "Netherlands", flag: "\u{1F1F3}\u{1F1F1}" },
  { code: "SE", dialCode: "+46", name: "Sweden", flag: "\u{1F1F8}\u{1F1EA}" },
  { code: "CH", dialCode: "+41", name: "Switzerland", flag: "\u{1F1E8}\u{1F1ED}" },
  { code: "PL", dialCode: "+48", name: "Poland", flag: "\u{1F1F5}\u{1F1F1}" },
  { code: "AR", dialCode: "+54", name: "Argentina", flag: "\u{1F1E6}\u{1F1F7}" },
  { code: "ZA", dialCode: "+27", name: "South Africa", flag: "\u{1F1FF}\u{1F1E6}" },
  { code: "NG", dialCode: "+234", name: "Nigeria", flag: "\u{1F1F3}\u{1F1EC}" },
  { code: "EG", dialCode: "+20", name: "Egypt", flag: "\u{1F1EA}\u{1F1EC}" },
  { code: "SA", dialCode: "+966", name: "Saudi Arabia", flag: "\u{1F1F8}\u{1F1E6}" },
  { code: "AE", dialCode: "+971", name: "United Arab Emirates", flag: "\u{1F1E6}\u{1F1EA}" },
  { code: "SG", dialCode: "+65", name: "Singapore", flag: "\u{1F1F8}\u{1F1EC}" },
  { code: "MY", dialCode: "+60", name: "Malaysia", flag: "\u{1F1F2}\u{1F1FE}" },
  { code: "TH", dialCode: "+66", name: "Thailand", flag: "\u{1F1F9}\u{1F1ED}" },
  { code: "PH", dialCode: "+63", name: "Philippines", flag: "\u{1F1F5}\u{1F1ED}" },
  { code: "ID", dialCode: "+62", name: "Indonesia", flag: "\u{1F1EE}\u{1F1E9}" },
  { code: "VN", dialCode: "+84", name: "Vietnam", flag: "\u{1F1FB}\u{1F1F3}" },
  { code: "TR", dialCode: "+90", name: "Turkey", flag: "\u{1F1F9}\u{1F1F7}" },
  { code: "PK", dialCode: "+92", name: "Pakistan", flag: "\u{1F1F5}\u{1F1F0}" },
  { code: "BD", dialCode: "+880", name: "Bangladesh", flag: "\u{1F1E7}\u{1F1E9}" },
  { code: "KE", dialCode: "+254", name: "Kenya", flag: "\u{1F1F0}\u{1F1EA}" },
  { code: "GH", dialCode: "+233", name: "Ghana", flag: "\u{1F1EC}\u{1F1ED}" },
  { code: "ET", dialCode: "+251", name: "Ethiopia", flag: "\u{1F1EA}\u{1F1F9}" },
  { code: "TZ", dialCode: "+255", name: "Tanzania", flag: "\u{1F1F9}\u{1F1FF}" },
  { code: "IL", dialCode: "+972", name: "Israel", flag: "\u{1F1EE}\u{1F1F1}" },
  { code: "HK", dialCode: "+852", name: "Hong Kong", flag: "\u{1F1ED}\u{1F1F0}" },
  { code: "NZ", dialCode: "+64", name: "New Zealand", flag: "\u{1F1F3}\u{1F1FF}" },
  { code: "IE", dialCode: "+353", name: "Ireland", flag: "\u{1F1EE}\u{1F1EA}" },
  { code: "PT", dialCode: "+351", name: "Portugal", flag: "\u{1F1F5}\u{1F1F9}" },
  { code: "CL", dialCode: "+56", name: "Chile", flag: "\u{1F1E8}\u{1F1F1}" },
  { code: "CO", dialCode: "+57", name: "Colombia", flag: "\u{1F1E8}\u{1F1F4}" },
  { code: "FI", dialCode: "+358", name: "Finland", flag: "\u{1F1EB}\u{1F1EE}" },
  { code: "NO", dialCode: "+47", name: "Norway", flag: "\u{1F1F3}\u{1F1F4}" },
  { code: "DK", dialCode: "+45", name: "Denmark", flag: "\u{1F1E9}\u{1F1F0}" },
  { code: "AT", dialCode: "+43", name: "Austria", flag: "\u{1F1E6}\u{1F1F9}" },
  { code: "BE", dialCode: "+32", name: "Belgium", flag: "\u{1F1E7}\u{1F1EA}" },
];

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

const FIELD_SIZES = {
  sm: "h-8",
  default: "h-9",
  lg: "h-10",
} as const;

const SEGMENT_SIZES = {
  sm: "gap-1 ps-2.5 pe-1.5",
  default: "gap-1.5 ps-3 pe-2",
  lg: "gap-1.5 ps-3.5 pe-2.5",
} as const;

const INPUT_SIZES = {
  sm: "px-2.5",
  default: "px-3",
  lg: "px-3.5",
} as const;

function getCountryByCode(code: string, list: Country[] = COUNTRIES): Country | undefined {
  // Case-insensitive on both sides: the lookup arg arrives in any case
  // ("gb", "GB"), and a hand-written `countries` list may not be uppercase.
  return list.find((c) => c.code.toUpperCase() === code.toUpperCase());
}

/**
 * Detect an explicit `+` dial-code prefix in what the user typed or pasted.
 * Returns the country it resolves to plus the value with the prefix stripped —
 * including any separator that immediately followed the code (`+44 20` leaves
 * `20`, not ` 20`) — or `undefined` when the input does not start with a dial
 * code that is actually offered: detection must never land on a country
 * outside `countries`.
 *
 * The longest matching dial code wins (`+880` beats `+8` for a list that has
 * both). Shared dial codes (`+1`, `+7`) keep `current` when it is one of the
 * sharing countries, otherwise the first one in the offered list wins.
 */
function detectCountryPrefix(
  input: string,
  countries: Country[],
  current: Country,
): { country: Country; rest: string } | undefined {
  if (!input.startsWith("+")) return undefined;
  let bestDialCode: string | undefined;
  for (const c of countries) {
    if (input.startsWith(c.dialCode) && c.dialCode.length > (bestDialCode?.length ?? 0)) {
      bestDialCode = c.dialCode;
    }
  }
  if (!bestDialCode) return undefined;
  const withCode = countries.filter((c) => c.dialCode === bestDialCode);
  const country = withCode.find((c) => c.code === current.code) ?? withCode[0];
  if (!country) return undefined;
  return {
    country,
    rest: input.slice(bestDialCode.length).replace(/^[\s.-]+/, ""),
  };
}

/**
 * Describe how `prev` became `next` as one insertion and one deletion at the
 * same index: the common prefix comes off the front, the common suffix off
 * the back. Digit ambiguity ("9192" → "+99192" aligns at 1 or 2) biases `at`
 * to the right, which under-counts fresh characters — the safe direction,
 * because an under-count skips detection instead of eating a digit.
 */
function diffAt(prev: string, next: string): { at: number; inserted: string; deleted: string } {
  let at = 0;
  const front = Math.min(prev.length, next.length);
  while (at < front && prev[at] === next[at]) at += 1;
  let back = 0;
  while (
    back < prev.length - at &&
    back < next.length - at &&
    prev[prev.length - 1 - back] === next[next.length - 1 - back]
  ) {
    back += 1;
  }
  return {
    at,
    inserted: next.slice(at, next.length - back),
    deleted: prev.slice(at, prev.length - back),
  };
}

export const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(function PhoneInput(
  {
    value,
    defaultValue,
    onValueChange,
    country,
    onCountryChange,
    defaultCountry = "US",
    countries = COUNTRIES,
    placeholder = "Phone number",
    disabled = false,
    className,
    showFlags = true,
    label = "Phone number",
    maxHeight = "15rem",
    size = "default",
    align = "start",
    side: preferredSide = "bottom",
    searchPlaceholder,
    emptyMessage,
    labels,
    displayLocale,
    classNames,
    ...rest
  },
  forwardedRef,
) {
  const [countryCode, setCountryCode] = useControllableState(country, defaultCountry, (code) => {
    // An unknown code resolves the same way the display does, so a callback
    // never reports a country the field is not showing.
    onCountryChange?.(getCountryByCode(code, countries) ?? countries[0] ?? COUNTRIES[0]);
  });
  const selectedCountry = React.useMemo(
    () => getCountryByCode(countryCode, countries) ?? countries[0] ?? COUNTRIES[0],
    [countryCode, countries],
  );
  // Report a country change only on a real transition: re-picking the current
  // country, or keeping it across a shared dial code, is not a change.
  const pickCountry = React.useCallback(
    (next: Country) => {
      // Compare against what is displayed, not the raw code: `country="gb"`
      // resolves to GB, and an unknown code falls back to `countries[0]` —
      // either way the visible country must match before we report a change.
      if (next.code !== selectedCountry.code) setCountryCode(next.code);
    },
    [selectedCountry.code, setCountryCode],
  );
  const [inputValue, setInputValue] = useControllableState(value, defaultValue ?? "", undefined);
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [side, setSide] = React.useState(preferredSide);
  const ref = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  // The country search box needs its own ref. Sharing `inputRef` meant the search
  // field overwrote it whenever the dropdown opened, which pointed the forwarded
  // ref at the wrong element and sent focus to a node that was about to unmount.
  const searchRef = React.useRef<HTMLInputElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const popupRef = React.useRef<HTMLDivElement>(null);
  // Characters entered after the current leading "+". Dial-code detection may
  // only consume a code whose digits all live in that zone: digits that were
  // already in the field when the "+" was typed are part of the number, not a
  // prefix the user declared. See handleInputChange.
  const freshDigitsRef = React.useRef(0);
  // The last value this handler wrote. When the next event sees a different
  // one, the value changed externally (a controlled `value` prop, a
  // programmatic set) and its "+"-run has unknown provenance — restart the
  // fresh count at 0 rather than trusting a stale one.
  const handledValueRef = React.useRef<string | null>(null);
  // True when the last thing we did was strip a dial code, so the separator
  // the user types next — one event later, once the value is already empty —
  // still belongs to the prefix rather than opening the number.
  const stripJustHappenedRef = React.useRef(false);

  React.useImperativeHandle(forwardedRef, () => inputRef.current as HTMLInputElement);

  const text: PhoneInputLabels = {
    trigger: labels?.trigger ?? DEFAULT_LABELS.trigger,
    searchPlaceholder:
      searchPlaceholder ?? labels?.searchPlaceholder ?? DEFAULT_LABELS.searchPlaceholder,
    searchLabel: labels?.searchLabel ?? DEFAULT_LABELS.searchLabel,
    clearSearch: labels?.clearSearch ?? DEFAULT_LABELS.clearSearch,
    // `null` is a valid empty message (it renders nothing), so only `undefined` falls through.
    emptyMessage:
      emptyMessage !== undefined
        ? emptyMessage
        : labels?.emptyMessage !== undefined
          ? labels.emptyMessage
          : DEFAULT_LABELS.emptyMessage,
    listbox: labels?.listbox ?? DEFAULT_LABELS.listbox,
  };
  const regionNames = React.useMemo(() => {
    if (!displayLocale) return undefined;
    // A malformed locale tag throws; fall back to the English names instead.
    try {
      return new Intl.DisplayNames([displayLocale], { type: "region", fallback: "none" });
    } catch {
      return undefined;
    }
  }, [displayLocale]);
  const getCountryName = (c: Country) => regionNames?.of(c.code) ?? c.name;

  // Lowercase with the display locale's rules, so a Turkish "İsrail" matches "israil".
  // Without a display locale, keep plain lowercasing: the user's own locale could
  // turn "India" into "ındia".
  const caseLocale = regionNames?.resolvedOptions().locale;
  const lower = (s: string) => (caseLocale ? s.toLocaleLowerCase(caseLocale) : s.toLowerCase());
  const query = lower(search.trim());
  // ISO codes are ASCII, so match them without locale rules ("ID" must not become "ıd").
  const codeQuery = search.trim().toLowerCase();
  const filtered = countries.filter(
    (c) =>
      lower(getCountryName(c)).includes(query) ||
      c.dialCode.includes(query) ||
      c.code.toLowerCase().includes(codeQuery),
  );

  const nav = useListboxNavigation({
    count: filtered.length,
    open,
    // Land on the current selection when the popup opens.
    initialIndex: filtered.findIndex((c) => c.code === selectedCountry.code),
    onClose: () => {
      setOpen(false);
      setSearch("");
    },
    onOpen: () => !disabled && setOpen(true),
    // Picking a country is half the task — typing the number is the other
    // half, so focus lands in the number field instead of back on the trigger.
    restoreFocusOnSelect: false,
    onSelect: (index) => {
      const picked = filtered[index];
      if (!picked) return;
      pickCountry(picked);
      onValueChange?.(inputValue, picked);
      inputRef.current?.focus();
    },
    triggerRef: () => triggerRef.current,
  });

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
    if (open) searchRef.current?.focus();
  }, [open]);

  // Flip to the other side when the preferred one has no room. Measured before
  // paint, so the menu never flashes on the wrong side.
  React.useLayoutEffect(() => {
    if (!open) return;
    const field = ref.current;
    const popup = popupRef.current;
    if (!field || !popup) return;
    const rect = field.getBoundingClientRect();
    const needed = popup.offsetHeight + 8;
    const below = window.innerHeight - rect.bottom;
    const above = rect.top;
    if (preferredSide === "bottom" && below < needed && above > below) setSide("top");
    else if (preferredSide === "top" && above < needed && below > above) setSide("bottom");
    else setSide(preferredSide);
  }, [open, preferredSide]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    const prev = inputValue;
    const wroteBefore = handledValueRef.current;
    handledValueRef.current = next;

    // A separator typed right after the dial code was stripped belongs to the
    // prefix the code just claimed: drop it instead of letting it open the
    // number. Only a separator arriving at the front of an otherwise empty,
    // unbroken value counts — a dash typed mid-number is the user's own
    // formatting, and a value we did not write is not ours to swallow.
    if (
      stripJustHappenedRef.current &&
      wroteBefore !== null &&
      wroteBefore === prev &&
      prev === "" &&
      /^[\s.-]+$/.test(next)
    ) {
      handledValueRef.current = "";
      return;
    }
    stripJustHappenedRef.current = false;

    // Keep the count of characters typed after the leading "+" in step with
    // the edit, before any detection runs on the result.
    let fresh = wroteBefore === null || wroteBefore === prev ? freshDigitsRef.current : 0;
    if (!next.startsWith("+")) {
      fresh = 0;
    } else if (!prev.startsWith("+")) {
      // The leading "+" just appeared. Everything the value already held was
      // revealed under it — except characters this same event inserted after
      // it, which is how a pasted code counts as declared.
      const { inserted } = diffAt(prev, next);
      fresh = inserted.startsWith("+") ? Math.max(0, inserted.length - 1) : 0;
    } else {
      const { at, inserted, deleted } = diffAt(prev, next);
      const boundary = 1 + fresh; // first index of the pre-existing tail
      if (inserted && deleted) {
        // Replacement: grow for the new characters only when they land at or
        // before the boundary, and only give back the deleted part that was
        // inside the fresh zone.
        if (at <= boundary) {
          fresh += inserted.length - Math.min(deleted.length, Math.max(0, boundary - at));
          fresh = Math.max(0, fresh);
        }
      } else if (inserted) {
        if (at <= boundary) fresh += inserted.length;
      } else if (deleted) {
        if (at < boundary) fresh = Math.max(0, fresh - deleted.length);
      }
    }
    freshDigitsRef.current = fresh;

    const match = detectCountryPrefix(next, countries, selectedCountry);
    if (!match) {
      setInputValue(next);
      onValueChange?.(next, selectedCountry);
      return;
    }
    const dialLen = next.length - match.rest.length;
    if (dialLen > 1 + fresh) {
      // The digits of this "code" were already in the field before the "+":
      // they belong to the number, so the "+" is an ordinary character here.
      // Leave the value and the country alone — no switch, no strip.
      setInputValue(next);
      onValueChange?.(next, selectedCountry);
      return;
    }
    // An explicit `+` prefix outranks a manually picked country: switch (or
    // confirm, for a shared dial code), then strip what the trigger now shows.
    // With `country` controlled, the parent's next `country` prop has the final
    // say — `onCountryChange` fires with the intended country either way.
    pickCountry(match.country);
    setInputValue(match.rest);
    handledValueRef.current = match.rest;
    stripJustHappenedRef.current = true;
    // The strip leaves a new run behind: if it still starts with "+", that
    // plus now sits at index 0 with the not-yet-consumed typed digits after it.
    freshDigitsRef.current = match.rest.startsWith("+") ? Math.max(0, fresh - dialLen) : 0;
    onValueChange?.(match.rest, match.country);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    // While the menu is open the number field is still focusable: arrows and
    // Home / End belong to the caret there, and Enter is not a request to pick
    // a country. Escape and everything else keep going to the listbox.
    if (
      open &&
      event.target === inputRef.current &&
      (event.key === "ArrowUp" ||
        event.key === "ArrowDown" ||
        event.key === "Home" ||
        event.key === "End" ||
        event.key === "Enter")
    ) {
      return;
    }
    nav.onKeyDown(event);
  };

  const offset = side === "bottom" ? -4 : 4;

  return (
    <MotionConfig reducedMotion="user">
      <div
        ref={ref}
        className={cn("relative inline-block text-sm", className, classNames?.root)}
        onKeyDown={handleKeyDown}
      >
        <div
          data-disabled={disabled ? "" : undefined}
          className={cn(
            "flex w-full min-w-0 items-stretch overflow-hidden rounded-md border border-input bg-transparent shadow-xs transition-[color,border-color,box-shadow] dark:bg-input/30",
            "focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50",
            "has-[input[aria-invalid=true]]:border-destructive has-[input[aria-invalid=true]]:ring-destructive/20 dark:has-[input[aria-invalid=true]]:ring-destructive/40",
            "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
            FIELD_SIZES[size],
            classNames?.field,
          )}
        >
          <button
            ref={triggerRef}
            type="button"
            onClick={() => !disabled && setOpen(!open)}
            disabled={disabled}
            data-state={open ? "open" : "closed"}
            className={cn(
              "flex shrink-0 items-center border-e border-input text-sm text-foreground transition-colors outline-none select-none",
              "hover:bg-accent/60 focus-visible:bg-accent aria-expanded:bg-accent/60 dark:hover:bg-input/50 dark:aria-expanded:bg-input/50",
              "disabled:pointer-events-none",
              SEGMENT_SIZES[size],
              classNames?.trigger,
            )}
            aria-label={text.trigger}
            aria-expanded={open}
            aria-haspopup="listbox"
          >
            {showFlags && <span className="text-base leading-none">{selectedCountry.flag}</span>}
            <span className="text-sm font-medium tabular-nums">{selectedCountry.dialCode}</span>
            <ChevronDownIcon
              aria-hidden="true"
              className={cn(
                "size-3.5 shrink-0 text-muted-foreground opacity-70 transition-transform duration-200",
                open && "rotate-180",
              )}
            />
          </button>

          <input
            ref={inputRef}
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            value={inputValue}
            onChange={handleInputChange}
            placeholder={placeholder}
            disabled={disabled}
            {...rest}
            className={cn(
              "w-full min-w-0 flex-1 bg-transparent text-sm text-foreground tabular-nums outline-none placeholder:text-muted-foreground",
              "disabled:cursor-not-allowed",
              INPUT_SIZES[size],
              classNames?.input,
            )}
            aria-label={label}
          />
        </div>

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
                "absolute z-50 w-max min-w-full overflow-hidden rounded-lg border bg-popover text-popover-foreground shadow-lg sm:min-w-72",
                side === "bottom" ? "top-full mt-1.5" : "bottom-full mb-1.5",
                align === "end" ? "end-0" : "start-0",
                classNames?.content,
              )}
            >
              <div className={cn("flex items-center gap-2 border-b px-3", classNames?.search)}>
                <SearchIcon aria-hidden="true" className="size-4 shrink-0 opacity-50" />
                <input
                  ref={searchRef}
                  type="text"
                  placeholder={text.searchPlaceholder}
                  aria-label={text.searchLabel}
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
                    aria-label={text.clearSearch}
                    onClick={() => {
                      setSearch("");
                      nav.resetActive();
                      searchRef.current?.focus();
                    }}
                    className="-me-1 inline-flex size-6 shrink-0 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    <XIcon aria-hidden="true" className="size-3.5" />
                  </button>
                )}
              </div>

              {/* The listbox owns the options only — the search field above sits
                  outside it, per ARIA. It scrolls on its own: the page never does. */}
              <div
                className={cn("overflow-y-auto overscroll-contain p-1", classNames?.list)}
                style={{ maxHeight }}
                role="listbox"
                aria-label={text.listbox}
                {...nav.listboxProps}
              >
                {filtered.map((country, index) => {
                  const isCurrent = country.code === selectedCountry.code;
                  return (
                    <button
                      key={country.code}
                      type="button"
                      role="option"
                      aria-selected={isCurrent}
                      onClick={() => nav.select(index)}
                      {...nav.optionProps(index)}
                      className={cn(
                        "relative flex w-full cursor-default items-center gap-2.5 rounded-sm px-2 py-1.5 text-start text-sm outline-none select-none",
                        "data-[active=true]:bg-accent data-[active=true]:text-accent-foreground",
                        classNames?.item,
                      )}
                    >
                      <span className="text-base leading-none">{country.flag}</span>
                      <span className="flex-1 truncate">{getCountryName(country)}</span>
                      <span className="text-xs text-muted-foreground tabular-nums">
                        {country.dialCode}
                      </span>
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
      </div>
    </MotionConfig>
  );
});

export { COUNTRIES };
