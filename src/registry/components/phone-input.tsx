"use client";

import * as React from "react";
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

export interface PhoneInputProps extends Omit<
  React.ComponentPropsWithoutRef<"input">,
  "value" | "defaultValue" | "onChange" | "type"
> {
  /** Phone number. Provide this to control the component. */
  value?: string;
  /** Initial phone number when uncontrolled */
  defaultValue?: string;
  /** Callback when the number or the selected country changes */
  onValueChange?: (phone: string, country: Country) => void;
  /** ISO 3166-1 alpha-2 code of the initially selected country (default: "US") */
  defaultCountry?: string;
  /** Show the flag emoji beside the dial code (default: true) */
  showFlags?: boolean;
  /** Accessible label for the field (default: "Phone number") */
  label?: string;
  /** Max height of the scrolling country list, before it scrolls (default: "15rem") */
  maxHeight?: number | string;
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

function getCountryByCode(code: string): Country | undefined {
  return COUNTRIES.find((c) => c.code === code.toUpperCase());
}

export const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(function PhoneInput(
  {
    value,
    defaultValue,
    onValueChange,
    defaultCountry = "US",
    placeholder = "Phone number",
    disabled = false,
    className,
    showFlags = true,
    label = "Phone number",
    maxHeight = "15rem",
    ...rest
  },
  forwardedRef,
) {
  const [selectedCountry, setSelectedCountry] = React.useState<Country>(
    () => getCountryByCode(defaultCountry) ?? COUNTRIES[0],
  );
  const [inputValue, setInputValue] = useControllableState(value, defaultValue ?? "", undefined);
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const ref = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  // The country search box needs its own ref. Sharing `inputRef` meant the search
  // field overwrote it whenever the dropdown opened, which pointed the forwarded
  // ref at the wrong element and sent focus to a node that was about to unmount.
  const searchRef = React.useRef<HTMLInputElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  React.useImperativeHandle(forwardedRef, () => inputRef.current as HTMLInputElement);

  const filtered = COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.dialCode.includes(search) ||
      c.code.toLowerCase().includes(search.toLowerCase()),
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
    onOpen: () => setOpen(true),
    // Picking a country is half the task — typing the number is the other
    // half, so focus lands in the number field instead of back on the trigger.
    restoreFocusOnSelect: false,
    onSelect: (index) => {
      const picked = filtered[index];
      if (!picked) return;
      setSelectedCountry(picked);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onValueChange?.(newValue, selectedCountry);
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

  return (
    <div
      ref={ref}
      className={cn("relative inline-block text-sm", className)}
      onKeyDown={handleKeyDown}
    >
      <div
        className={cn(
          "flex items-center overflow-hidden rounded-lg border transition-colors",
          "bg-white border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800",
          disabled && "opacity-50 cursor-not-allowed",
        )}
      >
        <button
          ref={triggerRef}
          type="button"
          onClick={() => !disabled && setOpen(!open)}
          disabled={disabled}
          className={cn(
            "flex items-center gap-1.5 border-r px-3 py-2.5 text-sm transition-colors",
            "border-zinc-200 text-zinc-900 hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-800 dark:hover:text-zinc-100",
            disabled && "cursor-not-allowed",
          )}
          aria-label="Select country"
          aria-expanded={open}
          aria-haspopup="listbox"
        >
          {showFlags && <span className="text-base leading-none">{selectedCountry.flag}</span>}
          <span className="font-mono text-xs">{selectedCountry.dialCode}</span>
          <svg
            className={cn(
              "size-3 text-zinc-500 transition-transform dark:text-zinc-400",
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

        <input
          ref={inputRef}
          type="tel"
          value={inputValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          disabled={disabled}
          {...rest}
          className={cn(
            "flex-1 bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-500",
            "text-zinc-900 dark:text-zinc-100",
            "focus:ring-1 focus:ring-emerald-500/50",
            disabled && "cursor-not-allowed",
          )}
          aria-label={label}
        />
      </div>

      {open && (
        <div className="absolute z-50 mt-1 min-w-[280px] overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-950">
          <div className="border-b border-zinc-200 p-2 dark:border-zinc-800">
            <input
              ref={searchRef}
              type="text"
              placeholder="Search countries..."
              aria-label="Search countries"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                nav.resetActive();
              }}
              {...nav.comboboxProps}
              className="w-full rounded-lg bg-zinc-100 px-3 py-1.5 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:ring-1 focus:ring-emerald-500/50 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500"
            />
          </div>

          {/* The listbox owns the options only — the search field above sits
              outside it, per ARIA. It scrolls on its own: the page never does. */}
          <div
            className="overflow-y-auto p-1"
            style={{ maxHeight }}
            role="listbox"
            aria-label="Select country"
            {...nav.listboxProps}
          >
            {filtered.map((country, index) => {
              const isCurrent = country.code === selectedCountry.code;
              const isActive = index === nav.activeIndex;
              return (
                <button
                  key={country.code}
                  type="button"
                  role="option"
                  aria-selected={isCurrent}
                  onClick={() => nav.select(index)}
                  {...nav.optionProps(index)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors",
                    isCurrent
                      ? "bg-emerald-500/10 text-emerald-600 font-medium dark:text-emerald-400"
                      : isActive
                        ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
                        : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100",
                  )}
                >
                  <span className="text-base leading-none">{country.flag}</span>
                  <span className="flex-1">{country.name}</span>
                  <span className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
                    {country.dialCode}
                  </span>
                  {isCurrent && (
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
              <div className="px-3 py-2 text-sm text-zinc-500 dark:text-zinc-400">
                No countries found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

export { COUNTRIES };
