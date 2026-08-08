"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Check, Code, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";

const languages = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "ja", label: "日本語", flag: "🇯🇵" },
  { code: "ar", label: "العربية", flag: "🇸🇦", rtl: true },
];

/* ── Shared app window chrome for realistic previews ── */

function MiniApp({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="relative mx-auto w-full max-w-2xl rounded-2xl border border-white/[0.08] shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
      <div className="absolute inset-0 -z-10 rounded-2xl bg-[#0A0A0A]" />
      <div className="flex items-center justify-between rounded-t-2xl border-b border-white/[0.06] bg-white/[0.02] px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-white/15" />
          <span className="size-2.5 rounded-full bg-white/15" />
          <span className="size-2.5 rounded-full bg-white/15" />
          <span className="ml-2 font-mono text-[11px] text-white/30">{title}</span>
        </div>
        <span className="font-mono text-[11px] text-white/25">preview</span>
      </div>
      {children}
    </div>
  );
}

/* ── Pill Switcher inside an application header ── */

const pillMessages: Record<string, { greeting: string; name: string; desc: string }> = {
  en: { greeting: "Welcome back", name: "Sarah", desc: "Here's what changed while you were away." },
  fr: { greeting: "Bon retour", name: "Sarah", desc: "Voici ce qui a changé pendant votre absence." },
  es: { greeting: "Bienvenida de nuevo", name: "Sarah", desc: "Esto es lo que cambió mientras no estabas." },
  de: { greeting: "Willkommen zurück", name: "Sarah", desc: "Hier ist, was sich geändert hat." },
};

function PillPreview() {
  const [lang, setLang] = useState("en");
  const t = pillMessages[lang] ?? pillMessages.en;

  return (
    <MiniApp title="dashboard.tsx">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] px-5 py-4">
        <div className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10 text-sm font-bold text-emerald-400">
            B
          </span>
          <div>
            <p className="text-sm font-semibold text-white">Babelize Console</p>
            <p className="text-[11px] text-white/40">Localization workspace</p>
          </div>
        </div>
        <div className="inline-flex rounded-full border border-white/10 bg-white/5 p-1">
          {languages.slice(0, 4).map((l) => (
            <button
              key={l.code}
              onClick={() => setLang(l.code)}
              className={cn(
                "relative rounded-full px-4 py-2 text-sm font-medium transition-all duration-300",
                lang === l.code ? "text-black" : "text-white/50 hover:text-white",
              )}
            >
              {lang === l.code && (
                <motion.span
                  layoutId="pill-bg"
                  className="absolute inset-0 rounded-full bg-emerald-500"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <span>{l.flag}</span>
                <span className="hidden sm:inline">{l.label}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4 px-5 py-5">
        <div>
          <p className="text-lg font-semibold text-white">
            {t.greeting}, {t.name}
          </p>
          <p className="text-sm text-white/40">{t.desc}</p>
        </div>
        <div className="flex items-center justify-between gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="h-2 w-16 rounded-full bg-white/15" />
            <span className="h-2 w-10 rounded-full bg-white/10" />
            <span className="h-2 w-12 rounded-full bg-white/10" />
          </div>
          <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-400">
            <span className="size-1.5 rounded-full bg-emerald-400" />
            Live
          </span>
        </div>
        <div className="flex gap-2">
          <span className="h-2 flex-1 rounded-full bg-white/5" />
          <span className="h-2 w-1/3 rounded-full bg-white/5" />
        </div>
      </div>
    </MiniApp>
  );
}

/* ── Dropdown Picker inside a settings screen ── */

function DropdownPreview() {
  const [lang, setLang] = useState("en");
  const [open, setOpen] = useState(false);
  const current = languages.find((l) => l.code === lang)!;

  return (
    <MiniApp title="settings.tsx">
      <div className="border-b border-white/[0.06] px-5 py-4">
        <p className="text-sm font-semibold text-white">Workspace settings</p>
        <p className="text-xs text-white/40">Manage your organization defaults</p>
      </div>

      <div className="divide-y divide-white/[0.06]">
        <div className="flex items-center justify-between gap-4 px-5 py-4">
          <div>
            <p className="text-sm text-white">Language</p>
            <p className="text-xs text-white/40">Interface and content locale</p>
          </div>
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2.5 rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white transition-colors hover:bg-white/10"
            >
              <span className="text-base leading-none">{current.flag}</span>
              <span>{current.label}</span>
              <svg
                className={cn("size-3.5 text-white/40 transition-transform duration-200", open && "rotate-180")}
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M2 4l4 4 4-4" />
              </svg>
            </button>
            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.97 }}
                  transition={{ duration: 0.18 }}
                  className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-lg border border-white/10 bg-[#0d0d0d] shadow-2xl"
                >
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLang(l.code);
                        setOpen(false);
                      }}
                      className={cn(
                        "flex w-full items-center gap-2.5 px-3.5 py-2.5 text-sm transition-colors",
                        lang === l.code ? "bg-emerald-500/10 text-emerald-400" : "text-white/60 hover:bg-white/5 hover:text-white",
                      )}
                    >
                      <span className="text-base leading-none">{l.flag}</span>
                      <span>{l.label}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 px-5 py-4">
          <div>
            <p className="text-sm text-white">Time zone</p>
            <p className="text-xs text-white/40">Region-aware formatting</p>
          </div>
          <span className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3.5 py-2.5 text-sm text-white/50">
            (UTC+05:30) Sindian
          </span>
        </div>

        <div className="flex items-center justify-between gap-4 px-5 py-4">
          <div>
            <p className="text-sm text-white">Theme</p>
            <p className="text-xs text-white/40">Appearance preference</p>
          </div>
          <span className="flex h-9 items-center gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 text-xs text-white/50">
            <span className="size-2 rounded-full bg-emerald-400/70" />
            Dark
          </span>
        </div>
      </div>
    </MiniApp>
  );
}

/* ── In-context editing inside a translation editor ── */

function EditingPreview() {
  const [editing, setEditing] = useState(false);
  return (
    <MiniApp title="translations.tsx">
      <div className="border-b border-white/[0.06] px-5 py-4">
        <p className="text-sm font-semibold text-white">Translations</p>
        <p className="text-xs text-white/40">app dashboard · English → French</p>
      </div>

      <div className="space-y-3 px-5 py-5">
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/40">en</span>
            <span className="rounded-full bg-white/[0.04] px-2 py-0.5 text-[10px] font-medium text-white/40">
              Source
            </span>
          </div>
          <p className="mt-2 text-base text-white">Welcome back, Sarah!</p>
        </div>

        <div className="mx-auto mt-0.5 flex size-6 items-center justify-center rounded-full border border-white/10 bg-[#0d0d0d] text-white/40">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M6 2v8M2 6h8" />
          </svg>
        </div>

        <motion.div
          whileHover={{ scale: 1.01 }}
          className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/40">fr</span>
            <button
              onClick={() => setEditing(!editing)}
              className="text-xs font-medium text-emerald-400 transition-colors hover:text-emerald-300"
            >
              {editing ? "Save" : "Edit"}
            </button>
          </div>
          {editing ? (
            <input
              defaultValue="Bienvenue, Sarah !"
              autoFocus
              className="mt-2 w-full bg-transparent text-base text-white outline-none"
            />
          ) : (
            <p className="mt-2 text-base text-white">Bienvenue, Sarah !</p>
          )}
        </motion.div>

        <p className="pt-1 text-center text-xs text-white/30">
          Click <span className="text-emerald-400">Edit</span> to translate inline
        </p>
      </div>
    </MiniApp>
  );
}

/* ── RTL native ── */

const rtlMessages = {
  greeting: "مرحبا بعودتك",
  desc: "لديك 3 إشعارات جديدة",
};

function RtlPreview() {
  const [dir, setDir] = useState<"ltr" | "rtl">("rtl");
  const isRtl = dir === "rtl";

  return (
    <MiniApp title="activity.tsx">
      <div className="flex items-center justify-between gap-3 border-b border-white/[0.06] px-5 py-3">
        <p className="text-sm font-semibold text-white">Activity</p>
        <div className="flex gap-0.5 rounded-full border border-white/[0.06] bg-white/[0.02] p-0.5">
          {(["ltr", "rtl"] as const).map((d) => (
            <button
              key={d}
              onClick={() => setDir(d)}
              className={cn(
                "rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-wide transition-colors",
                dir === d ? "bg-emerald-500/15 text-emerald-400" : "text-white/40 hover:text-white/80",
              )}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 py-5">
        <div dir={isRtl ? "rtl" : "ltr"} className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-base font-semibold text-white">{rtlMessages.greeting}</p>
              <p className="mt-1 text-sm text-white/40">{rtlMessages.desc}</p>
            </div>
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
              </svg>
            </span>
          </div>

          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs text-white/50">Notifications</span>
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[11px] font-medium text-emerald-400">
                3
              </span>
            </div>
            <div className="flex gap-2">
              <div className="h-2 flex-1 rounded-full bg-white/10" />
              <div className="h-2 w-1/3 rounded-full bg-emerald-500/20" />
            </div>
            <div className="mt-2 flex gap-2">
              <div className="h-2 w-1/4 rounded-full bg-white/10" />
              <div className="h-2 flex-1 rounded-full bg-white/5" />
            </div>
          </div>
        </div>
      </div>
    </MiniApp>
  );
}

/* ── Component code (matches the real implementations) ── */

const PILL_CODE = `export function useLocale() {
  const [locale, setLocale] = useState("en");
  return { locale, setLocale };
}

export function PillSwitcher({ value, onChange }: {
  value: string;
  onChange: (v: string) => void;
}) {
  const locales = [
    { code: "en", label: "English", flag: "🇺🇸" },
    { code: "fr", label: "Français", flag: "🇫🇷" },
    { code: "es", label: "Español", flag: "🇪🇸" },
    { code: "de", label: "Deutsch", flag: "🇩🇪" },
  ];

  return (
    <div className="inline-flex rounded-full border border-white/10 bg-white/5 p-1">
      {locales.map((l) => (
        <button
          key={l.code}
          onClick={() => onChange(l.code)}
          className={cn(
            "relative rounded-full px-4 py-2 text-sm font-medium transition-all",
            value === l.code
              ? "text-black"
              : "text-white/50 hover:text-white",
          )}
        >
          {value === l.code && (
            <span className="absolute inset-0 rounded-full bg-emerald-500" />
          )}
          <span className="relative z-10 flex items-center gap-2">
            <span>{l.flag}</span>
            <span>{l.label}</span>
          </span>
        </button>
      ))}
    </div>
  );
}`;

const DROPDOWN_CODE = `interface LanguageSwitcherProps extends ComponentProps<"select"> {
  locales: { code: string; label: string }[];
  onLocaleChange?: (code: string) => void;
}

export function LanguageSwitcher({
  locales,
  onLocaleChange,
  className,
  ...props
}: LanguageSwitcherProps) {
  return (
    <select
      className={cn(
        "h-10 rounded-md border border-white/10 bg-white/5 px-3 text-sm text-foreground outline-none transition-colors focus:border-emerald-500",
        className,
      )}
      onChange={(e) => onLocaleChange?.(e.target.value)}
      {...props}
    >
      {locales.map((locale) => (
        <option key={locale.code} value={locale.code}>
          {locale.label}
        </option>
      ))}
    </select>
  );
}`;

const EDITING_CODE = `export function TranslationEdit({
  source,
  target,
  locale = "fr",
}: {
  source: string;
  target: string;
  locale?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(target);

  return (
    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs text-white/40">{locale}</span>
        <button
          onClick={() => setEditing((v) => !v)}
          className="text-xs font-medium text-emerald-400 hover:text-emerald-300"
        >
          {editing ? "Save" : "Edit"}
        </button>
      </div>
      {editing ? (
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="mt-2 w-full bg-transparent text-base text-white outline-none"
        />
      ) : (
        <p className="mt-2 text-base text-white">{value}</p>
      )}
    </div>
  );
}`;

const RTL_CODE = `export function RtlCard({ dir = "rtl" }: { dir?: "ltr" | "rtl" }) {
  const isRtl = dir === "rtl";
  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="rounded-xl border border-white/10 bg-white/5 p-6">
      <div className="flex items-center justify-between">
        <span className="text-base font-medium text-white">مرحبا بعودتك</span>
        <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
          3
        </span>
      </div>
      <p className="mt-2 text-sm text-white/40">لديك 3 إشعارات جديدة</p>
    </div>
  );
}`;

/* ── Showcase config ── */

const ITEMS = [
  {
    id: "pill",
    label: "Pill Switcher",
    tagline: "Animated segmented locale switcher.",
    code: PILL_CODE,
    Preview: PillPreview,
  },
  {
    id: "dropdown",
    label: "Dropdown Picker",
    tagline: "Compact, accessible locale selector.",
    code: DROPDOWN_CODE,
    Preview: DropdownPreview,
  },
  {
    id: "editing",
    label: "In-context Editing",
    tagline: "Edit translations right where they render.",
    code: EDITING_CODE,
    Preview: EditingPreview,
  },
  {
    id: "rtl",
    label: "RTL Native",
    tagline: "Automatic mirroring for Arabic, Hebrew, and more.",
    code: RTL_CODE,
    Preview: RtlPreview,
  },
] as const;

export function ComponentShowcase() {
  const [activeId, setActiveId] = useState<(typeof ITEMS)[number]["id"]>("pill");
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);

  const active = ITEMS.find((item) => item.id === activeId)!;

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(active.code);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = active.code;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="components" className="relative overflow-hidden bg-black py-20 md:py-28">
      {/* Soft ambient glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-center">
        <div className="h-64 w-[700px] rounded-full bg-emerald-500/[0.07] blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <Reveal>
          <div className="flex flex-col items-center text-center">
            <h2 className="text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Beautifully crafted{" "}
              <span className="bg-gradient-to-r from-emerald-300 to-emerald-600 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(52,211,153,0.2)]">
                localization components
              </span>
            </h2>
            <p className="mt-5 max-w-xl text-base text-white/50">
              Production-ready React components designed to drop directly into
              modern applications.
            </p>
          </div>
        </Reveal>

        {/* Playground */}
        <Reveal delay={0.1}>
          <div className="mt-14 flex flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] shadow-[0_40px_100px_rgba(0,0,0,0.45)] lg:flex-row">
            {/* Selector */}
            <div className="border-b border-white/[0.06] px-5 py-4 lg:w-72 lg:shrink-0 lg:border-b-0 lg:border-r lg:p-6">
              <p className="mb-3 text-xs font-medium uppercase tracking-widest text-white/40">
                Components
              </p>
              <nav className="flex gap-1.5 overflow-x-auto lg:flex-col lg:overflow-visible">
                {ITEMS.map((item) => {
                  const isActive = item.id === activeId;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveId(item.id);
                        setShowCode(false);
                      }}
                      className={cn(
                        "flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm transition-colors lg:w-full",
                        isActive
                          ? "bg-emerald-500/10 text-emerald-300"
                          : "text-white/50 hover:bg-white/[0.03] hover:text-white/80",
                      )}
                    >
                      <span
                        className={cn(
                          "size-1.5 shrink-0 rounded-full transition-colors",
                          isActive ? "bg-emerald-400" : "bg-white/20",
                        )}
                      />
                      <span className="whitespace-nowrap">{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Preview */}
            <div className="flex-1 p-4 sm:p-6 lg:p-8">
              {/* Toolbar */}
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="text-base font-semibold text-white">{active.label}</h3>
                  <p className="truncate text-xs text-white/40">{active.tagline}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowCode((v) => !v)}
                    className="inline-flex h-9 items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.02] px-3.5 text-xs font-medium text-white/70 transition-colors hover:bg-white/[0.06] hover:text-white"
                  >
                    <Code className="size-3.5" />
                    {showCode ? "Hide code" : "View code"}
                  </button>
                  <button
                    onClick={copyCode}
                    className={cn(
                      "inline-flex h-9 items-center gap-2 rounded-lg px-3.5 text-xs font-medium transition-all duration-200",
                      copied
                        ? "bg-emerald-500/15 text-emerald-300"
                        : "border border-emerald-500/20 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20",
                    )}
                  >
                    {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                    {copied ? "Copied" : "Copy code"}
                  </button>
                </div>
              </div>

              {/* Stage */}
              <div className="relative flex min-h-[420px] items-center overflow-hidden rounded-xl border border-white/[0.06] bg-black/60 p-4 sm:p-6">
                <div className="pointer-events-none absolute left-1/2 top-0 h-40 w-[80%] -translate-x-1/2 rounded-full bg-emerald-500/[0.05] blur-[80px]" />
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={active.id}
                    initial={{ opacity: 0, y: 10, scale: 0.99 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.99 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    className="w-full"
                  >
                    <active.Preview />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Code panel */}
              <AnimatePresence initial={false}>
                {showCode && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 overflow-hidden rounded-xl border border-white/[0.08] bg-[#0A0A0A]">
                      <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-2.5">
                        <span className="font-mono text-xs text-white/40">component.tsx</span>
                        <button
                          onClick={copyCode}
                          className="flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-neutral-400 transition-colors hover:bg-white/10 hover:text-white"
                        >
                          {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
                          {copied ? "Copied" : "Copy"}
                        </button>
                      </div>
                      <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-white/70">
                        <code>{active.code}</code>
                      </pre>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </Reveal>

        {/* CTA */}
        <Reveal delay={0.2}>
          <div className="mt-10 flex justify-center">
            <Link
              href="/docs/components"
              className="group inline-flex h-11 items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.02] px-6 text-sm font-medium text-white transition-all hover:bg-white/[0.05]"
            >
              Browse all components
              <ArrowRight className="size-4 opacity-50 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}