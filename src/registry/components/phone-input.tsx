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
  /** The divider between the preferred countries and the rest of the list */
  preferredDivider?: string;
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
   * Each entry is a full `Country` object or a bare ISO code (`"IN"`); pass a
   * subset to restrict the list or reorder it to put common ones first.
   */
  countries?: (Country | string)[];
  /**
   * Countries pinned above a divider at the top of the menu, in order. Entries
   * are added to the menu even when they are not in `countries`, and are
   * deduplicated against it. Accepts `Country` objects or bare ISO codes.
   */
  preferredCountries?: (Country | string)[];
  /** Show the flag emoji beside the dial code (default: true) */
  showFlags?: boolean;
  /**
   * Mark the input `aria-invalid` when a non-empty number is malformed
   * (unexpected characters, or more than 15 digits including the country code).
   * Off by default; an empty field is never marked invalid. See
   * `onValidityChange` for the validity itself.
   */
  validate?: boolean;
  /**
   * Callback with the current basic E.164 validity and the normalized number
   * (`"+"` plus every digit, country code included). Fires whenever the digits
   * change — not on mount, and not for an edit that leaves the number untouched
   * (formatting). A well-formed but possibly incomplete number is valid; this
   * checks shape (digits-only, ≤ 15 digits), not per-country length rules.
   */
  onValidityChange?: (valid: boolean, e164: string) => void;
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

/**
 * The full ITU-T E.164 assignment set as `[ISO code, country calling code]`
 * pairs. The country's English name and flag are derived from the ISO code at
 * runtime (`Intl.DisplayNames` and the regional-indicator symbols), which keeps
 * ~244 stored strings out of the bundle. Order matters: the component's
 * original 50 countries come first, the rest follow alphabetically.
 */
const DIAL_CODES: readonly (readonly [string, string])[] = [
  ["US", "+1"],
  ["GB", "+44"],
  ["IN", "+91"],
  ["CA", "+1"],
  ["AU", "+61"],
  ["DE", "+49"],
  ["FR", "+33"],
  ["JP", "+81"],
  ["BR", "+55"],
  ["CN", "+86"],
  ["RU", "+7"],
  ["KR", "+82"],
  ["IT", "+39"],
  ["ES", "+34"],
  ["MX", "+52"],
  ["NL", "+31"],
  ["SE", "+46"],
  ["CH", "+41"],
  ["PL", "+48"],
  ["AR", "+54"],
  ["ZA", "+27"],
  ["NG", "+234"],
  ["EG", "+20"],
  ["SA", "+966"],
  ["AE", "+971"],
  ["SG", "+65"],
  ["MY", "+60"],
  ["TH", "+66"],
  ["PH", "+63"],
  ["ID", "+62"],
  ["VN", "+84"],
  ["TR", "+90"],
  ["PK", "+92"],
  ["BD", "+880"],
  ["KE", "+254"],
  ["GH", "+233"],
  ["ET", "+251"],
  ["TZ", "+255"],
  ["IL", "+972"],
  ["HK", "+852"],
  ["NZ", "+64"],
  ["IE", "+353"],
  ["PT", "+351"],
  ["CL", "+56"],
  ["CO", "+57"],
  ["FI", "+358"],
  ["NO", "+47"],
  ["DK", "+45"],
  ["AT", "+43"],
  ["BE", "+32"],
  ["AF", "+93"],
  ["AX", "+358"],
  ["AL", "+355"],
  ["DZ", "+213"],
  ["AS", "+1"],
  ["AD", "+376"],
  ["AO", "+244"],
  ["AI", "+1"],
  ["AG", "+1"],
  ["AM", "+374"],
  ["AW", "+297"],
  ["AZ", "+994"],
  ["BS", "+1"],
  ["BH", "+973"],
  ["BB", "+1"],
  ["BY", "+375"],
  ["BZ", "+501"],
  ["BJ", "+229"],
  ["BM", "+1"],
  ["BT", "+975"],
  ["BO", "+591"],
  ["BA", "+387"],
  ["BW", "+267"],
  ["IO", "+246"],
  ["VG", "+1"],
  ["BN", "+673"],
  ["BG", "+359"],
  ["BF", "+226"],
  ["BI", "+257"],
  ["KH", "+855"],
  ["CM", "+237"],
  ["CV", "+238"],
  ["BQ", "+599"],
  ["KY", "+1"],
  ["CF", "+236"],
  ["TD", "+235"],
  ["CX", "+61"],
  ["CC", "+61"],
  ["KM", "+269"],
  ["CG", "+242"],
  ["CD", "+243"],
  ["CK", "+682"],
  ["CR", "+506"],
  ["CI", "+225"],
  ["HR", "+385"],
  ["CU", "+53"],
  ["CW", "+599"],
  ["CY", "+357"],
  ["CZ", "+420"],
  ["DJ", "+253"],
  ["DM", "+1"],
  ["DO", "+1"],
  ["EC", "+593"],
  ["SV", "+503"],
  ["GQ", "+240"],
  ["ER", "+291"],
  ["EE", "+372"],
  ["SZ", "+268"],
  ["FK", "+500"],
  ["FO", "+298"],
  ["FJ", "+679"],
  ["GF", "+594"],
  ["PF", "+689"],
  ["GA", "+241"],
  ["GM", "+220"],
  ["GE", "+995"],
  ["GI", "+350"],
  ["GR", "+30"],
  ["GL", "+299"],
  ["GD", "+1"],
  ["GP", "+590"],
  ["GU", "+1"],
  ["GT", "+502"],
  ["GG", "+44"],
  ["GN", "+224"],
  ["GW", "+245"],
  ["GY", "+592"],
  ["HT", "+509"],
  ["HN", "+504"],
  ["HU", "+36"],
  ["IS", "+354"],
  ["IR", "+98"],
  ["IQ", "+964"],
  ["IM", "+44"],
  ["JM", "+1"],
  ["JE", "+44"],
  ["JO", "+962"],
  ["KZ", "+7"],
  ["KI", "+686"],
  ["XK", "+383"],
  ["KW", "+965"],
  ["KG", "+996"],
  ["LA", "+856"],
  ["LV", "+371"],
  ["LB", "+961"],
  ["LS", "+266"],
  ["LR", "+231"],
  ["LY", "+218"],
  ["LI", "+423"],
  ["LT", "+370"],
  ["LU", "+352"],
  ["MO", "+853"],
  ["MG", "+261"],
  ["MW", "+265"],
  ["MV", "+960"],
  ["ML", "+223"],
  ["MT", "+356"],
  ["MH", "+692"],
  ["MQ", "+596"],
  ["MR", "+222"],
  ["MU", "+230"],
  ["YT", "+262"],
  ["FM", "+691"],
  ["MD", "+373"],
  ["MC", "+377"],
  ["MN", "+976"],
  ["ME", "+382"],
  ["MS", "+1"],
  ["MA", "+212"],
  ["MZ", "+258"],
  ["MM", "+95"],
  ["NA", "+264"],
  ["NR", "+674"],
  ["NP", "+977"],
  ["NC", "+687"],
  ["NI", "+505"],
  ["NE", "+227"],
  ["NU", "+683"],
  ["NF", "+672"],
  ["KP", "+850"],
  ["MK", "+389"],
  ["MP", "+1"],
  ["OM", "+968"],
  ["PW", "+680"],
  ["PS", "+970"],
  ["PA", "+507"],
  ["PG", "+675"],
  ["PY", "+595"],
  ["PE", "+51"],
  ["PN", "+64"],
  ["PR", "+1"],
  ["QA", "+974"],
  ["RE", "+262"],
  ["RO", "+40"],
  ["RW", "+250"],
  ["WS", "+685"],
  ["SM", "+378"],
  ["ST", "+239"],
  ["SN", "+221"],
  ["RS", "+381"],
  ["SC", "+248"],
  ["SL", "+232"],
  ["SX", "+1"],
  ["SK", "+421"],
  ["SI", "+386"],
  ["SB", "+677"],
  ["SO", "+252"],
  ["SS", "+211"],
  ["LK", "+94"],
  ["BL", "+590"],
  ["SH", "+290"],
  ["KN", "+1"],
  ["LC", "+1"],
  ["MF", "+590"],
  ["PM", "+508"],
  ["VC", "+1"],
  ["SD", "+249"],
  ["SR", "+597"],
  ["SJ", "+47"],
  ["SY", "+963"],
  ["TW", "+886"],
  ["TJ", "+992"],
  ["TL", "+670"],
  ["TG", "+228"],
  ["TK", "+690"],
  ["TO", "+676"],
  ["TT", "+1"],
  ["TN", "+216"],
  ["TM", "+993"],
  ["TC", "+1"],
  ["TV", "+688"],
  ["VI", "+1"],
  ["UG", "+256"],
  ["UA", "+380"],
  ["UY", "+598"],
  ["UZ", "+998"],
  ["VU", "+678"],
  ["VA", "+39"],
  ["VE", "+58"],
  ["WF", "+681"],
  ["EH", "+212"],
  ["YE", "+967"],
  ["ZM", "+260"],
  ["ZW", "+263"],
];

/** English region names, resolved once and shared across every `Country`. */
const ENGLISH_REGION_NAMES = (() => {
  try {
    return new Intl.DisplayNames(["en"], { type: "region" });
  } catch {
    return undefined;
  }
})();

/** Flag emoji derived from an ISO 3166-1 alpha-2 code's regional indicators. */
function flagOf(code: string): string {
  return String.fromCodePoint(0x1f1e6 + code.charCodeAt(0) - 65, 0x1f1e6 + code.charCodeAt(1) - 65);
}

/** English country name for an ISO code, falling back to the code itself. */
function nameOf(code: string): string {
  try {
    return ENGLISH_REGION_NAMES?.of(code) ?? code;
  } catch {
    return code;
  }
}

const COUNTRIES: Country[] = DIAL_CODES.map(([code, dialCode]) => ({
  code,
  dialCode,
  name: nameOf(code),
  flag: flagOf(code),
}));

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
 * Turn a mixed list of full `Country` objects and bare ISO codes into resolved
 * `Country` entries. Bare codes are looked up in the built-in table, unknown
 * codes are dropped, and duplicates (by code) collapse to the first occurrence.
 */
function resolveCountries(
  input: readonly (Country | string)[] | undefined,
  fallback: Country[],
): Country[] {
  const source = input ?? fallback;
  const out: Country[] = [];
  const seen = new Set<string>();
  for (const entry of source) {
    const resolved = typeof entry === "string" ? getCountryByCode(entry) : entry;
    const key = resolved?.code.toUpperCase();
    if (!resolved || !key || seen.has(key)) continue;
    seen.add(key);
    out.push(resolved);
  }
  return out;
}

// Characters a user may legitimately type as visual formatting are stripped
// before the digits-only check; anything beyond those and a leading "+" makes
// the number malformed. The leading "+" is removed first, so any "+" that
// remains (e.g. "1+2") is unexpected.
const FORMATTING = /[ \-().]/g;
const UNEXPECTED = /[^0-9 ]/;

/**
 * Basic E.164 normalization. Formatting characters are stripped, the result
 * must be digits-only, and the total (country code included) may not exceed 15
 * digits. A leading `+` is treated as a self-declared country code, so the
 * selected country's dial code is not prepended on top of it.
 */
function toE164(input: string, dialCode: string): { e164: string; valid: boolean } {
  // A leading "+" declares its own country code; strip it (and the formatting
  // characters) before the digits-only / unexpected-character checks.
  const declaresOwn = input.trim().startsWith("+");
  const stripped = input.replace(FORMATTING, "").replace(declaresOwn ? /^\+/ : /^$/, "");
  const digits = stripped.replace(/\D/g, "");
  const hasUnexpected = UNEXPECTED.test(stripped);
  const all = (declaresOwn ? "" : dialCode.replace(/\D/g, "")) + digits;
  // With no digits typed there is no number yet, whatever the dial code says.
  return {
    e164: digits ? `+${all}` : "",
    valid: !hasUnexpected && digits.length > 0 && all.length <= 15,
  };
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
    countries,
    preferredCountries,
    placeholder = "Phone number",
    disabled = false,
    className,
    showFlags = true,
    validate = false,
    onValidityChange,
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
  // The full list of countries the menu offers: `preferredCountries` pinned in
  // front of `countries` (both resolved from bare ISO codes where given), with
  // the preferred ones deduplicated out of the body.
  const baseList = React.useMemo(() => resolveCountries(countries, COUNTRIES), [countries]);
  const preferredList = React.useMemo(
    () => resolveCountries(preferredCountries, []),
    [preferredCountries],
  );
  // One normalized (uppercase) preferred-code set, so a hand-written lowercase
  // `Country.code` still matches its `baseList` twin and is deduplicated out.
  const preferredCodes = React.useMemo(
    () => new Set(preferredList.map((c) => c.code.toUpperCase())),
    [preferredList],
  );
  const offered = React.useMemo(
    () => [...preferredList, ...baseList.filter((c) => !preferredCodes.has(c.code.toUpperCase()))],
    [preferredList, preferredCodes, baseList],
  );

  const [countryCode, setCountryCode] = useControllableState(country, defaultCountry, (code) => {
    // An unknown code resolves the same way the display does, so a callback
    // never reports a country the field is not showing.
    onCountryChange?.(getCountryByCode(code, offered) ?? offered[0] ?? COUNTRIES[0]);
  });
  const selectedCountry = React.useMemo(
    () => getCountryByCode(countryCode, offered) ?? offered[0] ?? COUNTRIES[0],
    [countryCode, offered],
  );
  // Report a country change only on a real transition: re-picking the current
  // country, or keeping it across a shared dial code, is not a change.
  const pickCountry = React.useCallback(
    (next: Country) => {
      // Compare against what is displayed, not the raw code: `country="gb"`
      // resolves to GB, and an unknown code falls back to `offered[0]` —
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
  // field overwrote it whenever the dropdown opened, which points the forwarded
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
  // Resolve every display name once per (locale, list) — one pass when the
  // locale or the offered list changes — instead of once per row per keystroke.
  const translatedNames = React.useMemo(() => {
    const map = new Map<string, string>();
    if (regionNames) {
      for (const c of offered) map.set(c.code, regionNames.of(c.code) ?? c.name);
    }
    return map;
  }, [regionNames, offered]);
  const getCountryName = (c: Country) =>
    regionNames ? (translatedNames.get(c.code) ?? c.name) : c.name;

  // Lowercase with the display locale's rules, so a Turkish "İsrail" matches "israil".
  // Without a display locale, keep plain lowercasing: the user's own locale could
  // turn "India" into "ındia".
  const caseLocale = regionNames?.resolvedOptions().locale;
  const lower = (s: string) => (caseLocale ? s.toLocaleLowerCase(caseLocale) : s.toLowerCase());
  const query = lower(search.trim());
  // ISO codes are ASCII, so match them without locale rules ("ID" must not become "ıd").
  const codeQuery = search.trim().toLowerCase();
  const filtered = offered.filter(
    (c) =>
      lower(getCountryName(c)).includes(query) ||
      c.dialCode.includes(query) ||
      c.code.toLowerCase().includes(codeQuery),
  );
  // How many of the filtered rows are preferred countries. They sit at the
  // front of `offered`, and filtering keeps that order, so they are the leading
  // run of the result — the divider goes right after them.
  const preferredMatched = filtered.reduce((n, c) => (preferredCodes.has(c.code) ? n + 1 : n), 0);

  // Basic E.164 validity, recomputed whenever the number or the country changes.
  const { e164, valid } = React.useMemo(
    () => toE164(inputValue, selectedCountry.dialCode),
    [inputValue, selectedCountry.dialCode],
  );
  // Report validity whenever the digits actually change — not on mount, and
  // not for an edit that leaves the normalized number untouched (formatting).
  // The callback rides in a ref so an inline arrow from the consumer does not
  // re-fire the effect on every render.
  const onValidityChangeRef = React.useRef(onValidityChange);
  onValidityChangeRef.current = onValidityChange;
  const validityMountedRef = React.useRef(false);
  React.useEffect(() => {
    if (!validityMountedRef.current) {
      validityMountedRef.current = true;
      return;
    }
    onValidityChangeRef.current?.(valid, e164);
  }, [valid, e164]);
  // Only a non-empty, malformed number is marked invalid — an empty field is a
  // form's "required" concern, not a malformed one.
  const ariaInvalid = validate && inputValue !== "" && !valid ? true : undefined;

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

    const match = detectCountryPrefix(next, offered, selectedCountry);
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
  const showDivider = preferredMatched > 0 && preferredMatched < filtered.length;

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
            aria-invalid={ariaInvalid}
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
                    <React.Fragment key={country.code}>
                      {showDivider && index === preferredMatched && (
                        <div
                          role="presentation"
                          aria-hidden="true"
                          className={cn("mx-2 my-1 border-t", classNames?.preferredDivider)}
                        />
                      )}
                      <button
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
                    </React.Fragment>
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
