"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { LanguageSwitcher, type Locale, type LanguageSwitcherThemeColors } from "@/registry/components/language-switcher";

const locales: Locale[] = [
  { code: "en" },
  { code: "fr" },
  { code: "es" },
  { code: "de" },
  { code: "ja" },
  { code: "ar" },
];

const greetings: Record<string, string> = {
  en: "Hello, world!",
  fr: "Bonjour, le monde !",
  es: "\u00a1Hola, mundo!",
  de: "Hallo, Welt!",
  ja: "\u4eca\u65e5\u306f\u4e16\u754c\uff01",
  ar: "\u0645\u0631\u062d\u0628\u0627 \u0628\u0627\u0644\u0639\u0627\u0644\u0645!",
};

const themeNames = ["emerald", "ocean", "sunset", "midnight", "arctic", "rose", "forest", "phantom", "retro"] as const;
type ThemeName = (typeof themeNames)[number];

interface ThemeColors {
  bg: string;
  chrome: string;
  border: string;
  dot: string;
  text: string;
  muted: string;
  code: string;
  codeText: string;
  comp: LanguageSwitcherThemeColors;
}

const themes: Record<ThemeName, { light: ThemeColors; dark: ThemeColors }> = {
  emerald: {
    light: {
      bg: "#f9f9f9", chrome: "rgba(0,0,0,0.02)", border: "rgba(0,0,0,0.08)", dot: "black",
      text: "#111111", muted: "rgba(0,0,0,0.35)", code: "rgba(0,0,0,0.04)", codeText: "#009764",
      comp: {
        btnBg: "rgba(0,0,0,0.04)", btnBorder: "rgba(0,0,0,0.08)", btnText: "rgba(0,0,0,0.8)",
        iconColor: "rgba(0,0,0,0.4)", dropdownBg: "#ffffff", dropdownBorder: "rgba(0,0,0,0.08)",
        itemText: "rgba(0,0,0,0.6)", itemHoverBg: "rgba(0,0,0,0.04)", itemHoverText: "#111111",
        activeBg: "rgba(0,189,125,0.08)", activeText: "#009764",
        inputBg: "rgba(0,0,0,0.04)", inputText: "#111111", inputPlaceholder: "rgba(0,0,0,0.3)",
        inputBorder: "rgba(0,0,0,0.05)", noResultsText: "rgba(0,0,0,0.3)",
      },
    },
    dark: {
      bg: "#09090b", chrome: "rgba(255,255,255,0.02)", border: "rgba(255,255,255,0.08)", dot: "white",
      text: "#ededed", muted: "rgba(255,255,255,0.3)", code: "rgba(255,255,255,0.05)", codeText: "#00bd7d",
      comp: {
        btnBg: "rgba(255,255,255,0.05)", btnBorder: "rgba(255,255,255,0.1)", btnText: "rgba(255,255,255,0.8)",
        iconColor: "rgba(255,255,255,0.4)", dropdownBg: "#111111", dropdownBorder: "rgba(255,255,255,0.1)",
        itemText: "rgba(255,255,255,0.7)", itemHoverBg: "rgba(255,255,255,0.05)", itemHoverText: "#ededed",
        activeBg: "rgba(0,189,125,0.1)", activeText: "#00bd7d",
        inputBg: "rgba(255,255,255,0.05)", inputText: "#ededed", inputPlaceholder: "rgba(255,255,255,0.3)",
        inputBorder: "rgba(255,255,255,0.05)", noResultsText: "rgba(255,255,255,0.3)",
      },
    },
  },
  ocean: {
    light: {
      bg: "#f8fafc", chrome: "rgba(15,23,42,0.02)", border: "rgba(15,23,42,0.08)", dot: "#0f172a",
      text: "#0f172a", muted: "rgba(15,23,42,0.35)", code: "rgba(15,23,42,0.04)", codeText: "#0284c7",
      comp: {
        btnBg: "rgba(15,23,42,0.04)", btnBorder: "rgba(15,23,42,0.08)", btnText: "rgba(15,23,42,0.8)",
        iconColor: "rgba(15,23,42,0.4)", dropdownBg: "#ffffff", dropdownBorder: "rgba(15,23,42,0.08)",
        itemText: "rgba(15,23,42,0.6)", itemHoverBg: "rgba(15,23,42,0.04)", itemHoverText: "#0f172a",
        activeBg: "rgba(2,132,199,0.08)", activeText: "#0284c7",
        inputBg: "rgba(15,23,42,0.04)", inputText: "#0f172a", inputPlaceholder: "rgba(15,23,42,0.3)",
        inputBorder: "rgba(15,23,42,0.05)", noResultsText: "rgba(15,23,42,0.3)",
      },
    },
    dark: {
      bg: "#0a0f1a", chrome: "rgba(56,189,248,0.02)", border: "rgba(56,189,248,0.08)", dot: "#38bdf8",
      text: "#e2e8f0", muted: "rgba(148,163,184,0.6)", code: "rgba(56,189,248,0.05)", codeText: "#38bdf8",
      comp: {
        btnBg: "rgba(56,189,248,0.06)", btnBorder: "rgba(56,189,248,0.12)", btnText: "rgba(226,232,240,0.85)",
        iconColor: "rgba(148,163,184,0.5)", dropdownBg: "#111827", dropdownBorder: "rgba(56,189,248,0.12)",
        itemText: "rgba(226,232,240,0.7)", itemHoverBg: "rgba(56,189,248,0.06)", itemHoverText: "#e2e8f0",
        activeBg: "rgba(56,189,248,0.12)", activeText: "#38bdf8",
        inputBg: "rgba(56,189,248,0.06)", inputText: "#e2e8f0", inputPlaceholder: "rgba(148,163,184,0.5)",
        inputBorder: "rgba(56,189,248,0.06)", noResultsText: "rgba(148,163,184,0.4)",
      },
    },
  },
  sunset: {
    light: {
      bg: "#fffbf5", chrome: "rgba(234,88,12,0.02)", border: "rgba(234,88,12,0.08)", dot: "#ea580c",
      text: "#1c1917", muted: "rgba(28,25,23,0.35)", code: "rgba(234,88,12,0.04)", codeText: "#ea580c",
      comp: {
        btnBg: "rgba(234,88,12,0.05)", btnBorder: "rgba(234,88,12,0.1)", btnText: "rgba(28,25,23,0.8)",
        iconColor: "rgba(28,25,23,0.4)", dropdownBg: "#ffffff", dropdownBorder: "rgba(234,88,12,0.1)",
        itemText: "rgba(28,25,23,0.6)", itemHoverBg: "rgba(234,88,12,0.05)", itemHoverText: "#1c1917",
        activeBg: "rgba(234,88,12,0.08)", activeText: "#ea580c",
        inputBg: "rgba(234,88,12,0.04)", inputText: "#1c1917", inputPlaceholder: "rgba(28,25,23,0.3)",
        inputBorder: "rgba(234,88,12,0.05)", noResultsText: "rgba(28,25,23,0.3)",
      },
    },
    dark: {
      bg: "#1a0f05", chrome: "rgba(251,146,60,0.02)", border: "rgba(251,146,60,0.08)", dot: "#fb923c",
      text: "#fef3c7", muted: "rgba(168,162,158,0.6)", code: "rgba(251,146,60,0.05)", codeText: "#fb923c",
      comp: {
        btnBg: "rgba(251,146,60,0.06)", btnBorder: "rgba(251,146,60,0.12)", btnText: "rgba(254,243,199,0.85)",
        iconColor: "rgba(168,162,158,0.5)", dropdownBg: "#292524", dropdownBorder: "rgba(251,146,60,0.12)",
        itemText: "rgba(254,243,199,0.7)", itemHoverBg: "rgba(251,146,60,0.06)", itemHoverText: "#fef3c7",
        activeBg: "rgba(251,146,60,0.12)", activeText: "#fb923c",
        inputBg: "rgba(251,146,60,0.06)", inputText: "#fef3c7", inputPlaceholder: "rgba(168,162,158,0.5)",
        inputBorder: "rgba(251,146,60,0.06)", noResultsText: "rgba(168,162,158,0.4)",
      },
    },
  },
  midnight: {
    light: {
      bg: "#f8fafc", chrome: "rgba(30,64,175,0.02)", border: "rgba(30,64,175,0.08)", dot: "#1e40af",
      text: "#0f172a", muted: "rgba(15,23,42,0.35)", code: "rgba(30,64,175,0.04)", codeText: "#1e40af",
      comp: {
        btnBg: "rgba(30,64,175,0.05)", btnBorder: "rgba(30,64,175,0.1)", btnText: "rgba(15,23,42,0.8)",
        iconColor: "rgba(15,23,42,0.4)", dropdownBg: "#ffffff", dropdownBorder: "rgba(30,64,175,0.1)",
        itemText: "rgba(15,23,42,0.6)", itemHoverBg: "rgba(30,64,175,0.05)", itemHoverText: "#0f172a",
        activeBg: "rgba(30,64,175,0.08)", activeText: "#1e40af",
        inputBg: "rgba(30,64,175,0.04)", inputText: "#0f172a", inputPlaceholder: "rgba(15,23,42,0.3)",
        inputBorder: "rgba(30,64,175,0.05)", noResultsText: "rgba(15,23,42,0.3)",
      },
    },
    dark: {
      bg: "#020617", chrome: "rgba(129,140,248,0.02)", border: "rgba(129,140,248,0.08)", dot: "#818cf8",
      text: "#e2e8f0", muted: "rgba(148,163,184,0.6)", code: "rgba(129,140,248,0.05)", codeText: "#818cf8",
      comp: {
        btnBg: "rgba(129,140,248,0.06)", btnBorder: "rgba(129,140,248,0.12)", btnText: "rgba(226,232,240,0.85)",
        iconColor: "rgba(148,163,184,0.5)", dropdownBg: "#0f172a", dropdownBorder: "rgba(129,140,248,0.12)",
        itemText: "rgba(226,232,240,0.7)", itemHoverBg: "rgba(129,140,248,0.06)", itemHoverText: "#e2e8f0",
        activeBg: "rgba(129,140,248,0.12)", activeText: "#818cf8",
        inputBg: "rgba(129,140,248,0.06)", inputText: "#e2e8f0", inputPlaceholder: "rgba(148,163,184,0.5)",
        inputBorder: "rgba(129,140,248,0.06)", noResultsText: "rgba(148,163,184,0.4)",
      },
    },
  },
  arctic: {
    light: {
      bg: "#f0f9ff", chrome: "rgba(8,145,178,0.02)", border: "rgba(8,145,178,0.08)", dot: "#0891b2",
      text: "#0c4a6e", muted: "rgba(12,74,110,0.35)", code: "rgba(8,145,178,0.04)", codeText: "#0891b2",
      comp: {
        btnBg: "rgba(8,145,178,0.05)", btnBorder: "rgba(8,145,178,0.1)", btnText: "rgba(12,74,110,0.8)",
        iconColor: "rgba(12,74,110,0.4)", dropdownBg: "#ffffff", dropdownBorder: "rgba(8,145,178,0.1)",
        itemText: "rgba(12,74,110,0.6)", itemHoverBg: "rgba(8,145,178,0.05)", itemHoverText: "#0c4a6e",
        activeBg: "rgba(8,145,178,0.08)", activeText: "#0891b2",
        inputBg: "rgba(8,145,178,0.04)", inputText: "#0c4a6e", inputPlaceholder: "rgba(12,74,110,0.3)",
        inputBorder: "rgba(8,145,178,0.05)", noResultsText: "rgba(12,74,110,0.3)",
      },
    },
    dark: {
      bg: "#021a23", chrome: "rgba(34,211,238,0.02)", border: "rgba(34,211,238,0.08)", dot: "#22d3ee",
      text: "#cffafe", muted: "rgba(165,243,252,0.6)", code: "rgba(34,211,238,0.05)", codeText: "#22d3ee",
      comp: {
        btnBg: "rgba(34,211,238,0.06)", btnBorder: "rgba(34,211,238,0.12)", btnText: "rgba(207,250,254,0.85)",
        iconColor: "rgba(165,243,252,0.5)", dropdownBg: "#083344", dropdownBorder: "rgba(34,211,238,0.12)",
        itemText: "rgba(207,250,254,0.7)", itemHoverBg: "rgba(34,211,238,0.06)", itemHoverText: "#cffafe",
        activeBg: "rgba(34,211,238,0.12)", activeText: "#22d3ee",
        inputBg: "rgba(34,211,238,0.06)", inputText: "#cffafe", inputPlaceholder: "rgba(165,243,252,0.5)",
        inputBorder: "rgba(34,211,238,0.06)", noResultsText: "rgba(165,243,252,0.4)",
      },
    },
  },
  rose: {
    light: {
      bg: "#fff1f2", chrome: "rgba(225,29,72,0.02)", border: "rgba(225,29,72,0.08)", dot: "#e11d48",
      text: "#1f1215", muted: "rgba(31,18,21,0.35)", code: "rgba(225,29,72,0.04)", codeText: "#e11d48",
      comp: {
        btnBg: "rgba(225,29,72,0.05)", btnBorder: "rgba(225,29,72,0.1)", btnText: "rgba(31,18,21,0.8)",
        iconColor: "rgba(31,18,21,0.4)", dropdownBg: "#ffffff", dropdownBorder: "rgba(225,29,72,0.1)",
        itemText: "rgba(31,18,21,0.6)", itemHoverBg: "rgba(225,29,72,0.05)", itemHoverText: "#1f1215",
        activeBg: "rgba(225,29,72,0.08)", activeText: "#e11d48",
        inputBg: "rgba(225,29,72,0.04)", inputText: "#1f1215", inputPlaceholder: "rgba(31,18,21,0.3)",
        inputBorder: "rgba(225,29,72,0.05)", noResultsText: "rgba(31,18,21,0.3)",
      },
    },
    dark: {
      bg: "#1a0a0f", chrome: "rgba(251,113,133,0.02)", border: "rgba(251,113,133,0.08)", dot: "#fb7185",
      text: "#fff1f2", muted: "rgba(212,160,160,0.6)", code: "rgba(251,113,133,0.05)", codeText: "#fb7185",
      comp: {
        btnBg: "rgba(251,113,133,0.06)", btnBorder: "rgba(251,113,133,0.12)", btnText: "rgba(255,241,242,0.85)",
        iconColor: "rgba(212,160,160,0.5)", dropdownBg: "#2a1018", dropdownBorder: "rgba(251,113,133,0.12)",
        itemText: "rgba(255,241,242,0.7)", itemHoverBg: "rgba(251,113,133,0.06)", itemHoverText: "#fff1f2",
        activeBg: "rgba(251,113,133,0.12)", activeText: "#fb7185",
        inputBg: "rgba(251,113,133,0.06)", inputText: "#fff1f2", inputPlaceholder: "rgba(212,160,160,0.5)",
        inputBorder: "rgba(251,113,133,0.06)", noResultsText: "rgba(212,160,160,0.4)",
      },
    },
  },
  forest: {
    light: {
      bg: "#f7fdf4", chrome: "rgba(21,128,61,0.02)", border: "rgba(21,128,61,0.08)", dot: "#15803d",
      text: "#14210d", muted: "rgba(20,33,13,0.35)", code: "rgba(21,128,61,0.04)", codeText: "#15803d",
      comp: {
        btnBg: "rgba(21,128,61,0.05)", btnBorder: "rgba(21,128,61,0.1)", btnText: "rgba(20,33,13,0.8)",
        iconColor: "rgba(20,33,13,0.4)", dropdownBg: "#ffffff", dropdownBorder: "rgba(21,128,61,0.1)",
        itemText: "rgba(20,33,13,0.6)", itemHoverBg: "rgba(21,128,61,0.05)", itemHoverText: "#14210d",
        activeBg: "rgba(21,128,61,0.08)", activeText: "#15803d",
        inputBg: "rgba(21,128,61,0.04)", inputText: "#14210d", inputPlaceholder: "rgba(20,33,13,0.3)",
        inputBorder: "rgba(21,128,61,0.05)", noResultsText: "rgba(20,33,13,0.3)",
      },
    },
    dark: {
      bg: "#0a1a05", chrome: "rgba(74,222,128,0.02)", border: "rgba(74,222,128,0.08)", dot: "#4ade80",
      text: "#dcfce7", muted: "rgba(160,216,160,0.6)", code: "rgba(74,222,128,0.05)", codeText: "#4ade80",
      comp: {
        btnBg: "rgba(74,222,128,0.06)", btnBorder: "rgba(74,222,128,0.12)", btnText: "rgba(220,252,231,0.85)",
        iconColor: "rgba(160,216,160,0.5)", dropdownBg: "#14331c", dropdownBorder: "rgba(74,222,128,0.12)",
        itemText: "rgba(220,252,231,0.7)", itemHoverBg: "rgba(74,222,128,0.06)", itemHoverText: "#dcfce7",
        activeBg: "rgba(74,222,128,0.12)", activeText: "#4ade80",
        inputBg: "rgba(74,222,128,0.06)", inputText: "#dcfce7", inputPlaceholder: "rgba(160,216,160,0.5)",
        inputBorder: "rgba(74,222,128,0.06)", noResultsText: "rgba(160,216,160,0.4)",
      },
    },
  },
  phantom: {
    light: {
      bg: "#f5f5f5", chrome: "rgba(0,0,0,0.03)", border: "rgba(0,0,0,0.1)", dot: "#1a1a1a",
      text: "#0a0a0a", muted: "rgba(0,0,0,0.4)", code: "rgba(0,0,0,0.05)", codeText: "#6b21a8",
      comp: {
        btnBg: "rgba(107,33,168,0.06)", btnBorder: "rgba(107,33,168,0.12)", btnText: "rgba(10,10,10,0.85)",
        iconColor: "rgba(10,10,10,0.4)", dropdownBg: "#ffffff", dropdownBorder: "rgba(107,33,168,0.12)",
        itemText: "rgba(10,10,10,0.6)", itemHoverBg: "rgba(107,33,168,0.06)", itemHoverText: "#0a0a0a",
        activeBg: "rgba(107,33,168,0.1)", activeText: "#7c3aed",
        inputBg: "rgba(107,33,168,0.04)", inputText: "#0a0a0a", inputPlaceholder: "rgba(10,10,10,0.3)",
        inputBorder: "rgba(107,33,168,0.06)", noResultsText: "rgba(10,10,10,0.3)",
      },
    },
    dark: {
      bg: "#050505", chrome: "rgba(139,92,246,0.02)", border: "rgba(139,92,246,0.1)", dot: "#8b5cf6",
      text: "#e8e8e8", muted: "rgba(200,200,200,0.45)", code: "rgba(139,92,246,0.06)", codeText: "#a78bfa",
      comp: {
        btnBg: "rgba(139,92,246,0.08)", btnBorder: "rgba(139,92,246,0.15)", btnText: "rgba(232,232,232,0.9)",
        iconColor: "rgba(200,200,200,0.4)", dropdownBg: "#0a0a0a", dropdownBorder: "rgba(139,92,246,0.15)",
        itemText: "rgba(232,232,232,0.65)", itemHoverBg: "rgba(139,92,246,0.08)", itemHoverText: "#e8e8e8",
        activeBg: "rgba(139,92,246,0.15)", activeText: "#a78bfa",
        inputBg: "rgba(139,92,246,0.06)", inputText: "#e8e8e8", inputPlaceholder: "rgba(200,200,200,0.4)",
        inputBorder: "rgba(139,92,246,0.08)", noResultsText: "rgba(200,200,200,0.3)",
      },
    },
  },
  retro: {
    light: {
      bg: "#faf8f5", chrome: "rgba(139,115,85,0.03)", border: "rgba(139,115,85,0.12)", dot: "#5c4a3a",
      text: "#2c2416", muted: "rgba(44,36,22,0.4)", code: "rgba(139,115,85,0.06)", codeText: "#8b5e3c",
      comp: {
        btnBg: "rgba(180,83,9,0.06)", btnBorder: "rgba(180,83,9,0.12)", btnText: "rgba(44,36,22,0.85)",
        iconColor: "rgba(44,36,22,0.4)", dropdownBg: "#ffffff", dropdownBorder: "rgba(180,83,9,0.12)",
        itemText: "rgba(44,36,22,0.6)", itemHoverBg: "rgba(180,83,9,0.06)", itemHoverText: "#2c2416",
        activeBg: "rgba(180,83,9,0.1)", activeText: "#b45309",
        inputBg: "rgba(180,83,9,0.04)", inputText: "#2c2416", inputPlaceholder: "rgba(44,36,22,0.3)",
        inputBorder: "rgba(180,83,9,0.06)", noResultsText: "rgba(44,36,22,0.3)",
      },
    },
    dark: {
      bg: "#1a1410", chrome: "rgba(217,168,104,0.03)", border: "rgba(217,168,104,0.1)", dot: "#d9a868",
      text: "#f5ede4", muted: "rgba(217,196,164,0.5)", code: "rgba(217,168,104,0.06)", codeText: "#d9a868",
      comp: {
        btnBg: "rgba(217,168,104,0.08)", btnBorder: "rgba(217,168,104,0.15)", btnText: "rgba(245,237,228,0.9)",
        iconColor: "rgba(217,196,164,0.45)", dropdownBg: "#231c14", dropdownBorder: "rgba(217,168,104,0.15)",
        itemText: "rgba(245,237,228,0.65)", itemHoverBg: "rgba(217,168,104,0.08)", itemHoverText: "#f5ede4",
        activeBg: "rgba(217,168,104,0.15)", activeText: "#d9a868",
        inputBg: "rgba(217,168,104,0.06)", inputText: "#f5ede4", inputPlaceholder: "rgba(217,196,164,0.4)",
        inputBorder: "rgba(217,168,104,0.08)", noResultsText: "rgba(217,196,164,0.35)",
      },
    },
  },
};

const CODE_SNIPPET = `"use client";

import { LanguageSwitcher } from "@babelize/elements";

const locales = [
  { code: "en" },
  { code: "fr" },
  { code: "es" },
  { code: "de" },
  { code: "ja" },
  { code: "ar" },
];

export default function App() {
  return (
    <LanguageSwitcher
      locales={locales}
      defaultValue="en"
      onValueChange={(code) => console.log(code)}
    />
  );
}`;

function ThemeDropdown({
  value,
  onChange,
}: {
  value: ThemeName;
  onChange: (t: ThemeName) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-2.5 py-1.5 text-xs font-medium capitalize text-black/50 dark:text-white/50 transition-colors hover:bg-black/10 dark:hover:bg-white/10 hover:text-black dark:hover:text-white"
      >
        <div className="size-2.5 rounded-full" style={{ background: themes[value].dark.comp.activeText }} />
        {value}
        <svg className={cn("size-3 transition-transform", open && "rotate-180")} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-1 w-40 overflow-hidden rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#111] shadow-xl">
          <div className="p-1">
            {themeNames.map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => { onChange(name); setOpen(false); }}
                className={cn(
                  "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs capitalize transition-colors",
                  name === value
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "text-black/60 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5",
                )}
              >
                <div className="size-2.5 rounded-full" style={{ background: themes[name].dark.comp.activeText }} />
                {name}
                {name === value && (
                  <svg className="ml-auto size-3 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function LanguageSwitcherDemo() {
  const [locale, setLocale] = useState("en");
  const [previewDark, setPreviewDark] = useState(true);
  const [theme, setTheme] = useState<ThemeName>("emerald");
  const [tab, setTab] = useState<"preview" | "code">("preview");
  const t = themes[theme][previewDark ? "dark" : "light"];
  const isRetro = theme === "retro";

  return (
    <div className="space-y-0">
      {/* Retro font */}
      {isRetro && (
        <style
          dangerouslySetInnerHTML={{
            __html: `
              @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Fira+Code:wght@300;400;500;600;700&display=swap');
              .retro-preview, .retro-preview * { font-family: 'Space Grotesk', sans-serif !important; }
              .retro-preview code, .retro-preview pre { font-family: 'Fira Code', monospace !important; }
            `,
          }}
        />
      )}

      {/* Toolbar — all controls in one line */}
      <div className="flex items-center justify-between rounded-t-2xl border border-b-0 border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] px-3 py-2">
        {/* Left: Preview / Code tabs */}
        <div className="flex items-center gap-0.5 rounded-lg bg-black/5 dark:bg-white/5 p-0.5">
          <button
            type="button"
            onClick={() => setTab("preview")}
            className={cn(
              "rounded-md px-3 py-1 text-xs font-medium transition-colors",
              tab === "preview"
                ? "bg-white dark:bg-[#111] text-black/80 dark:text-white/80 shadow-sm"
                : "text-black/40 dark:text-white/40 hover:text-black/60 dark:hover:text-white/60",
            )}
          >
            Preview
          </button>
          <button
            type="button"
            onClick={() => setTab("code")}
            className={cn(
              "rounded-md px-3 py-1 text-xs font-medium transition-colors",
              tab === "code"
                ? "bg-white dark:bg-[#111] text-black/80 dark:text-white/80 shadow-sm"
                : "text-black/40 dark:text-white/40 hover:text-black/60 dark:hover:text-white/60",
            )}
          >
            Code
          </button>
        </div>

        {/* Right: Theme + Light/Dark */}
        <div className="flex items-center gap-1.5">
          <ThemeDropdown value={theme} onChange={setTheme} />
          <button
            type="button"
            onClick={() => setPreviewDark(!previewDark)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-2.5 py-1.5 text-xs font-medium text-black/50 dark:text-white/50 transition-colors hover:bg-black/10 dark:hover:bg-white/10 hover:text-black dark:hover:text-white"
          >
            {previewDark ? (
              <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
              </svg>
            ) : (
              <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
              </svg>
            )}
            {previewDark ? "Light" : "Dark"}
          </button>
        </div>
      </div>

      {/* Content */}
      {tab === "preview" ? (
        <div
          className={cn(
            "relative overflow-visible rounded-b-2xl border border-t-0 border-black/10 dark:border-white/10 shadow-2xl transition-colors",
            isRetro && "retro-preview",
          )}
          style={{ background: t.bg, borderColor: t.border }}
        >
          {/* Browser chrome */}
          <div
            className="flex items-center justify-between border-b px-4 py-3"
            style={{ borderColor: t.border, background: t.chrome }}
          >
            <div className="flex items-center gap-2">
              <span className="size-3 rounded-full bg-[#ff5f57]" />
              <span className="size-3 rounded-full bg-[#febc2e]" />
              <span className="size-3 rounded-full bg-[#28c840]" />
            </div>
            <div
              className="flex items-center gap-2 rounded-lg border px-3 py-1"
              style={{ borderColor: t.border, background: t.code }}
            >
              <svg className="size-3" style={{ color: t.muted }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5a17.92 17.92 0 0 1-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
              </svg>
              <span className="text-xs" style={{ color: t.muted }}>elements.babelize.co/docs/language-switcher</span>
            </div>
            <div className="w-16" />
          </div>

          {/* Preview content */}
          <div className="relative flex flex-col items-center justify-center gap-8 px-6 py-16 sm:px-12">
            {/* Grid */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.02]"
              style={{
                backgroundImage: `radial-gradient(circle, ${t.dot} 1px, transparent 1px)`,
                backgroundSize: "24px 24px",
              }}
            />

            {/* Glow */}
            <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full blur-[100px]" style={{ background: `${themes[theme][previewDark ? "dark" : "light"].comp.activeText}15` }} />

            {/* Component */}
            <div className="relative z-50">
              <LanguageSwitcher
                locales={locales}
                defaultValue="en"
                onValueChange={setLocale}
                showFlags
                themeColors={t.comp}
              />
            </div>

            {/* Greeting */}
            <div className="relative z-10 text-center">
              <p className="text-4xl font-bold tracking-tight sm:text-5xl" style={{ color: t.text }}>
                {greetings[locale] ?? "Hello, world!"}
              </p>
              <p className="mt-3 text-sm" style={{ color: t.muted }}>
                locale:{" "}
                <code className="rounded px-1.5 py-0.5 font-mono" style={{ background: t.code, color: t.codeText }}>
                  {locale}
                </code>
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-b-2xl border border-t-0 border-black/10 dark:border-white/10 bg-[#1e1e1e]">
          <pre className="overflow-x-auto p-4 text-sm leading-relaxed">
            <code className="text-[#d4d4d4]">{CODE_SNIPPET}</code>
          </pre>
        </div>
      )}
    </div>
  );
}
