import * as React from "react";

/**
 * Where DOM focus lives while a listbox popup is open.
 *
 * - `"activedescendant"` keeps focus in the popup's search field and points at
 *   the highlighted option through `aria-activedescendant`. The field carries
 *   `role="combobox"`, which is the only role the ARIA spec allows the attribute
 *   on besides composites and text inputs.
 * - `"roving"` moves focus onto the highlighted option itself. This is the
 *   WAI-ARIA listbox pattern, and the right fit for a popup opened from a plain
 *   `<button>` trigger with no text field: `aria-activedescendant` is not valid
 *   on a button, and the trigger keeps its `button` role so existing queries,
 *   labels, and click handling stay put.
 */
export type ListboxStrategy = "activedescendant" | "roving";

export interface UseListboxNavigationOptions {
  /** Options currently rendered, after any client-side filtering. */
  count: number;
  /** Whether the popup is open. */
  open: boolean;
  /** Closes the popup. Components reset their own search state here. */
  onClose: () => void;
  /** Opens the popup. Called when the trigger receives ArrowDown / ArrowUp. */
  onOpen?: () => void;
  /**
   * Runs when the active option is picked (Enter, or a click on an option).
   * The hook closes the popup and restores focus once it returns.
   */
  onSelect?: (index: number) => void;
  /**
   * Option highlighted when the popup opens without a keyboard nudge — usually
   * the currently selected one. ArrowDown / ArrowUp on the trigger override it
   * with the first / last option. Clamped into range; defaults to `0`.
   */
  initialIndex?: number;
  /** Defaults to `"activedescendant"`. */
  strategy?: ListboxStrategy;
  /**
   * Whether picking an option returns focus to the trigger (default: true).
   * Opt out when the component moves focus elsewhere itself after a pick —
   * `PhoneInput` focuses its number field, since typing the number is the next
   * step. Escape still returns focus to the trigger.
   */
  restoreFocusOnSelect?: boolean;
  /**
   * The element that opens the popup. Read through a getter because a component
   * may own more than one trigger (the NavBar's desktop and mobile bars).
   */
  triggerRef: () => HTMLElement | null;
}

export interface ListboxComboboxProps {
  role: "combobox";
  "aria-expanded": boolean;
  "aria-controls": string | undefined;
  "aria-autocomplete": "list";
  "aria-activedescendant": string | undefined;
}

export interface ListboxOptionProps {
  id: string;
  /** Focusable under roving focus, skipped by Tab under `aria-activedescendant`. */
  tabIndex: number;
  "data-active": "true" | undefined;
  onMouseEnter: () => void;
  onFocus: () => void;
}

export interface ListboxNavigation {
  /** Spread onto the container that owns the options. */
  listboxProps: { id: string };
  /** Spread onto the search field when using `activedescendant` focus. */
  comboboxProps: ListboxComboboxProps;
  /** `-1` when the popup is closed or the option list is empty. */
  activeIndex: number;
  /** Spread onto every option, after the component's own `role` / `onClick`. */
  optionProps: (index: number) => ListboxOptionProps;
  /** Attach to an ancestor of both the trigger and the options. */
  onKeyDown: (event: React.KeyboardEvent) => void;
  /**
   * Highlights an option. The component's option `onClick` should call it.
   * Closes the popup and — unless `restoreFocusOnSelect` is false — returns
   * focus to the trigger.
   */
  select: (index: number) => void;
  /** Restarts the highlight at the top — call it whenever a filter changes. */
  resetActive: () => void;
  /**
   * Closes the popup, optionally returning focus to the trigger. No-ops when the
   * popup is already closed, so an always-on document Escape listener can call it
   * unconditionally without stealing focus from elsewhere on the page.
   */
  close: (restoreFocus?: boolean) => void;
}

function clamp(index: number, count: number): number {
  if (count === 0) return -1;
  return Math.min(Math.max(index, 0), count - 1);
}

/** Distance from the listbox's top edge to the option's top, in layout pixels. */
function offsetInViewport(option: HTMLElement, listbox: HTMLElement): number {
  return option.getBoundingClientRect().top - listbox.getBoundingClientRect().top;
}

/**
 * Keyboard navigation for the listbox popups in `LanguageSwitcher`,
 * `PhoneInput`, and `NavBar`.
 *
 * Handled keys: ArrowDown / ArrowUp (wrap around), Home / End, Enter to pick,
 * Escape to close and return focus to the trigger, and ArrowDown / ArrowUp on the
 * closed trigger to open with the first / last option highlighted. The highlight
 * stays on the row where it appeared when the menu opened — the list scrolls
 * beneath it, like a native menu — and the page itself never scrolls.
 *
 * The hook owns the highlight only — selection, filtering, and open state stay
 * with the component through `onSelect`, `onClose`, and `onOpen`.
 */
export function useListboxNavigation(options: UseListboxNavigationOptions): ListboxNavigation {
  const { count, open, initialIndex, strategy = "activedescendant" } = options;

  const [activeIndex, setActiveIndex] = React.useState(-1);
  // Highlight requested by ArrowDown / ArrowUp on the closed trigger, consumed by
  // the render that opens the popup. State rather than a ref: render may read it.
  const [seed, setSeed] = React.useState<number | null>(null);
  // Bumped alongside the highlight so the roving-focus effect re-runs even when a
  // wrap lands back on the same index (a one-option list, say).
  const [focusTick, setFocusTick] = React.useState(0);
  // Deliberately not the current `{ open, count }`: the mismatch makes the
  // adjustment below run on mount too, seeding the highlight for a popup that
  // starts open.
  const [prev, setPrev] = React.useState({ open: false, count: 0 });
  const listboxId = React.useId();

  const optionsRef = React.useRef(options);
  const pendingFocusRef = React.useRef(false);
  const closingRef = React.useRef(false);
  // The row, in pixels from the listbox's top edge, the highlight is pinned to.
  const anchorRef = React.useRef<number | null>(null);
  // The option count the anchor was captured for, so a new list (a filter pass,
  // the popup reopening) re-anchors instead of pinning against stale geometry.
  const anchoredCountRef = React.useRef<number | null>(null);
  // Whether the highlight last moved from the keyboard. Mouse hover and focus
  // re-highlight without scrolling: pinning on them would drag the list out from
  // under the cursor.
  const keyboardMoveRef = React.useRef(false);

  const optionId = React.useCallback(
    (index: number) => `${listboxId}-option-${index}`,
    [listboxId],
  );

  // Seed the highlight when the popup opens, clear it when it closes, and keep it
  // in range when filtering shrinks the list. Adjusted during render rather than
  // in an effect: an effect would paint the un-seeded highlight for a frame.
  if (prev.open !== open || prev.count !== count) {
    setPrev({ open, count });
    setSeed(null);
    if (!open) {
      setActiveIndex(-1);
    } else {
      const start = prev.open ? activeIndex : (seed ?? initialIndex ?? 0);
      setActiveIndex(clamp(start, count));
    }
  }

  // Refreshed before every other effect in this hook, so they all read the
  // current render's options.
  React.useEffect(() => {
    optionsRef.current = options;
    closingRef.current = false;
  });

  // Remember the row the highlight is pinned to: the active option's position
  // when the popup opens, or when a new option list appears (opening, closing,
  // or a filter pass).
  //
  // A fresh list starts unscrolled, and the seeded option can sit below the
  // first screenful — a menu opened on a selection far down a long list. The
  // anchor is therefore clamped into the visible box, and the list scrolled so
  // the option actually occupies that row: the highlight must never start life
  // parked somewhere the user cannot see.
  React.useEffect(() => {
    if (!open || activeIndex < 0) {
      anchorRef.current = null;
      anchoredCountRef.current = null;
      return;
    }
    if (anchoredCountRef.current === count) return;
    const option = document.getElementById(optionId(activeIndex));
    const listbox = document.getElementById(listboxId);
    if (!option || !listbox) return;
    listbox.scrollTop = 0;
    const offset = offsetInViewport(option, listbox);
    const maxAnchor = Math.max(0, listbox.clientHeight - option.getBoundingClientRect().height);
    const anchor = Math.min(Math.max(offset, 0), maxAnchor);
    listbox.scrollTop = offset - anchor;
    anchorRef.current = anchor;
    anchoredCountRef.current = count;
  }, [open, count, activeIndex, optionId, listboxId]);

  // Roving focus: move real DOM focus onto the highlighted option, but only after
  // a keyboard nudge — opening with the mouse leaves focus on the trigger.
  React.useEffect(() => {
    if (!open || strategy !== "roving" || !pendingFocusRef.current) return;
    // Wait for the highlight to be seeded on open before moving focus.
    if (activeIndex < 0) return;
    pendingFocusRef.current = false;
    // `preventScroll`: the browser would otherwise scroll every scrollable
    // ancestor — the page included — to reveal the option, and fight the pinned
    // scroll below.
    document.getElementById(optionId(activeIndex))?.focus({ preventScroll: true });
  }, [open, strategy, activeIndex, focusTick, optionId]);

  // Keep the highlight on its anchored row by scrolling the popup's own list
  // container beneath it, the way a native menu does.
  //
  // Adjusted by hand rather than with `scrollIntoView`: that method walks every
  // scrollable ancestor, so a menu near the bottom of the page dragged the whole
  // window along with it. Adjusting `scrollTop` moves one element and nothing
  // above it. Rects rather than `offsetTop`, because the options' `offsetParent`
  // is the positioned popup wrapper, not the listbox. Clamping to the scrollable
  // range is the browser's job, which is what pins the highlight to the first or
  // last row at the ends of the list.
  React.useEffect(() => {
    if (!open || activeIndex < 0 || !keyboardMoveRef.current) return;
    const anchor = anchorRef.current;
    if (anchor == null) return;
    const option = document.getElementById(optionId(activeIndex));
    const listbox = document.getElementById(listboxId);
    if (!option || !listbox) return;
    listbox.scrollTop += offsetInViewport(option, listbox) - anchor;
  }, [open, activeIndex, count, optionId, listboxId]);

  const close = React.useCallback((restoreFocus = true) => {
    const current = optionsRef.current;
    if (!current.open || closingRef.current) return;
    closingRef.current = true;
    current.onClose();
    if (restoreFocus) current.triggerRef()?.focus();
  }, []);

  const select = React.useCallback(
    (index: number) => {
      const current = optionsRef.current;
      if (index < 0 || index >= current.count) return;
      current.onSelect?.(index);
      // A component that moves focus itself after a pick (PhoneInput focuses
      // its number field) opts out of the restore; Escape still returns to the
      // trigger through `close`.
      close(current.restoreFocusOnSelect ?? true);
    },
    [close],
  );

  const resetActive = React.useCallback(() => {
    keyboardMoveRef.current = false;
    setActiveIndex(0);
  }, []);

  const moveActive = (next: number) => {
    keyboardMoveRef.current = true;
    if (strategy === "roving") {
      pendingFocusRef.current = true;
      setFocusTick((tick) => tick + 1);
    }
    setActiveIndex(next);
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (!open) {
      if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
      // Only the trigger opens the popup: ArrowDown inside a text field is a
      // caret movement, not a request for the menu.
      if (event.target !== optionsRef.current.triggerRef()) return;
      event.preventDefault();
      keyboardMoveRef.current = true;
      setSeed(event.key === "ArrowUp" ? count - 1 : 0);
      if (strategy === "roving") {
        pendingFocusRef.current = true;
        setFocusTick((tick) => tick + 1);
      }
      optionsRef.current.onOpen?.();
      return;
    }

    switch (event.key) {
      case "ArrowDown": {
        event.preventDefault();
        if (count === 0) return;
        moveActive(activeIndex >= count - 1 ? 0 : activeIndex + 1);
        return;
      }
      case "ArrowUp": {
        event.preventDefault();
        if (count === 0) return;
        moveActive(activeIndex <= 0 ? count - 1 : activeIndex - 1);
        return;
      }
      case "Home": {
        event.preventDefault();
        if (count === 0) return;
        moveActive(0);
        return;
      }
      case "End": {
        event.preventDefault();
        if (count === 0) return;
        moveActive(count - 1);
        return;
      }
      case "Enter": {
        // An option is a `<button>`, and the browser fires its click for us.
        // Selecting here too would run `onSelect` twice.
        if ((event.target as HTMLElement).getAttribute("role") === "option") return;
        // Enter during an IME composition commits the composition — not a request
        // to pick the highlighted option. Composing events report `isComposing`;
        // older browsers only report the legacy 229 keyCode. Checked before
        // `preventDefault`, which must not stall the IME's own commit either.
        if (event.nativeEvent.isComposing || event.nativeEvent.keyCode === 229) return;
        if (activeIndex < 0 || activeIndex >= count) return;
        event.preventDefault();
        select(activeIndex);
        return;
      }
      case "Escape": {
        event.preventDefault();
        close(true);
        return;
      }
    }
  };

  return {
    listboxProps: { id: listboxId },
    comboboxProps: {
      role: "combobox",
      "aria-expanded": open,
      "aria-controls": open ? listboxId : undefined,
      "aria-autocomplete": "list",
      "aria-activedescendant": open && activeIndex >= 0 ? optionId(activeIndex) : undefined,
    },
    activeIndex,
    optionProps: (index: number) => ({
      id: optionId(index),
      tabIndex: strategy === "roving" && index === activeIndex ? 0 : -1,
      "data-active": index === activeIndex ? "true" : undefined,
      // Re-highlighting the option that is already active is a no-op — and must
      // stay one: under roving focus the hook's own `focus()` fires `onFocus`
      // right before the pinned scroll, which would demote a keyboard move.
      onMouseEnter: () => {
        if (index === activeIndex) return;
        keyboardMoveRef.current = false;
        setActiveIndex(index);
      },
      onFocus: () => {
        if (index === activeIndex) return;
        keyboardMoveRef.current = false;
        setActiveIndex(index);
      },
    }),
    onKeyDown,
    select,
    resetActive,
    close,
  };
}
