"use client";

import { useSyncExternalStore } from "react";

type Vars = Record<`--${string}`, string>;

export interface PreviewTheme {
  name: string;
  label: string;
  /** Swatch colour for the picker. */
  swatch: string;
  /** Token overrides on top of the site's base palette (see globals.css). */
  light: Vars;
  dark: Vars;
}

/**
 * Accent palettes from shadcn/ui's theme set. Each overrides only the tokens an
 * accent touches, so the neutral surfaces stay the site's own. "Babelize" is the
 * base palette and overrides nothing.
 */
export const PREVIEW_THEMES: PreviewTheme[] = [
  { name: "babelize", label: "Babelize", swatch: "#00bd7d", light: {}, dark: {} },
  {
    name: "neutral",
    label: "Neutral",
    swatch: "oklch(0.205 0 0)",
    light: {
      "--primary": "oklch(0.205 0 0)",
      "--primary-foreground": "oklch(0.985 0 0)",
      "--ring": "oklch(0.708 0 0)",
    },
    dark: {
      "--primary": "oklch(0.922 0 0)",
      "--primary-foreground": "oklch(0.205 0 0)",
      "--ring": "oklch(0.556 0 0)",
    },
  },
  {
    name: "blue",
    label: "Blue",
    swatch: "oklch(0.488 0.243 264.376)",
    light: {
      "--primary": "oklch(0.488 0.243 264.376)",
      "--primary-foreground": "oklch(0.97 0.014 254.604)",
      "--ring": "oklch(0.623 0.214 259.815)",
    },
    dark: {
      "--primary": "oklch(0.546 0.245 262.881)",
      "--primary-foreground": "oklch(0.97 0.014 254.604)",
      "--ring": "oklch(0.488 0.243 264.376)",
    },
  },
  {
    name: "violet",
    label: "Violet",
    swatch: "oklch(0.541 0.281 293.009)",
    light: {
      "--primary": "oklch(0.541 0.281 293.009)",
      "--primary-foreground": "oklch(0.969 0.016 293.756)",
      "--ring": "oklch(0.702 0.183 293.541)",
    },
    dark: {
      "--primary": "oklch(0.606 0.25 292.717)",
      "--primary-foreground": "oklch(0.969 0.016 293.756)",
      "--ring": "oklch(0.541 0.281 293.009)",
    },
  },
  {
    name: "rose",
    label: "Rose",
    swatch: "oklch(0.645 0.246 16.439)",
    light: {
      "--primary": "oklch(0.645 0.246 16.439)",
      "--primary-foreground": "oklch(0.969 0.015 12.422)",
      "--ring": "oklch(0.712 0.194 13.428)",
    },
    dark: {
      "--primary": "oklch(0.645 0.246 16.439)",
      "--primary-foreground": "oklch(0.969 0.015 12.422)",
      "--ring": "oklch(0.645 0.246 16.439)",
    },
  },
  {
    name: "orange",
    label: "Orange",
    swatch: "oklch(0.646 0.222 41.116)",
    light: {
      "--primary": "oklch(0.646 0.222 41.116)",
      "--primary-foreground": "oklch(0.98 0.016 73.684)",
      "--ring": "oklch(0.75 0.183 55.934)",
    },
    dark: {
      "--primary": "oklch(0.705 0.213 47.604)",
      "--primary-foreground": "oklch(0.98 0.016 73.684)",
      "--ring": "oklch(0.646 0.222 41.116)",
    },
  },
];

interface PreviewPrefs {
  theme: string;
  dark: boolean;
}

const STORAGE_KEY = "elements-preview";
const DEFAULT_PREFS: PreviewPrefs = { theme: "babelize", dark: true };

let prefs: PreviewPrefs = DEFAULT_PREFS;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded) return;
  loaded = true;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) prefs = { ...DEFAULT_PREFS, ...JSON.parse(raw) };
  } catch {
    // Storage blocked or corrupt: keep the defaults.
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  load();
  return prefs;
}

function setPrefs(next: Partial<PreviewPrefs>) {
  prefs = { ...prefs, ...next };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // Not persisted; the in-memory value still applies for this visit.
  }
  for (const listener of listeners) listener();
}

/**
 * Preview theme and colour scheme, shared by every preview on the page and
 * remembered across visits — switching one switches them all.
 */
export function usePreviewPrefs() {
  const current = useSyncExternalStore(subscribe, getSnapshot, () => DEFAULT_PREFS);
  const theme = PREVIEW_THEMES.find((t) => t.name === current.theme) ?? PREVIEW_THEMES[0];
  return {
    theme,
    dark: current.dark,
    setTheme: (name: string) => setPrefs({ theme: name }),
    setDark: (dark: boolean) => setPrefs({ dark }),
  };
}
