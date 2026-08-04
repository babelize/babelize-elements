"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight } from "lucide-react";
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

function PillDemo() {
  const [lang, setLang] = useState("en");
  return (
    <div className="flex flex-col items-center gap-6">
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
      <motion.div
        key={lang}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-white/10 bg-white/5 px-6 py-4"
      >
        <p className="text-sm text-white/50">Current locale</p>
        <p className="mt-1 text-lg font-semibold text-emerald-400">
          {languages.find((l) => l.code === lang)?.label}
        </p>
      </motion.div>
    </div>
  );
}

function DropdownDemo() {
  const [lang, setLang] = useState("en");
  const [open, setOpen] = useState(false);
  const current = languages.find((l) => l.code === lang)!;

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white transition-colors hover:bg-white/10"
        >
          <span className="text-lg">{current.flag}</span>
          <span>{current.label}</span>
          <svg className={cn("size-4 text-white/40 transition-transform", open && "rotate-180")} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M2 4l4 4 4-4" />
          </svg>
        </button>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute top-full left-1/2 z-50 mt-2 w-56 -translate-x-1/2 overflow-hidden rounded-xl border border-white/10 bg-[#0a0a0a] shadow-2xl"
            >
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => { setLang(l.code); setOpen(false); }}
                  className={cn(
                    "flex w-full items-center gap-3 px-4 py-3 text-sm transition-colors",
                    lang === l.code ? "bg-emerald-500/10 text-emerald-400" : "text-white/60 hover:bg-white/5 hover:text-white",
                  )}
                >
                  <span className="text-lg">{l.flag}</span>
                  <span>{l.label}</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <motion.div
        key={lang}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-white/10 bg-white/5 px-6 py-4"
      >
        <p className="text-sm text-white/50">Selected language</p>
        <p className="mt-1 text-lg font-semibold text-emerald-400">
          {current.label} ({current.code})
        </p>
      </motion.div>
    </div>
  );
}

function RTLDemo() {
  const [dir, setDir] = useState<"ltr" | "rtl">("rtl");
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex gap-2">
        <button onClick={() => setDir("ltr")} className={cn("rounded-lg px-4 py-2 text-sm font-medium transition-colors", dir === "ltr" ? "bg-white/10 text-white" : "text-white/40 hover:text-white/70")}>LTR</button>
        <button onClick={() => setDir("rtl")} className={cn("rounded-lg px-4 py-2 text-sm font-medium transition-colors", dir === "rtl" ? "bg-white/10 text-white" : "text-white/40 hover:text-white/70")}>RTL</button>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={dir}
          initial={{ opacity: 0, x: dir === "rtl" ? 20 : -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: dir === "rtl" ? -20 : 20 }}
          dir={dir}
          className="w-full max-w-sm rounded-xl border border-white/10 bg-white/5 p-6"
        >
          <div className="flex items-center justify-between">
            <span className="text-base font-medium text-white">مرحبا بعودتك</span>
            <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-medium text-emerald-400">3</span>
          </div>
          <p className="mt-2 text-sm text-white/40">لديك 3 إشعارات جديدة</p>
          <div className="mt-4 flex gap-2">
            <div className="h-2 flex-1 rounded-full bg-white/10" />
            <div className="h-2 w-1/3 rounded-full bg-emerald-500/30" />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function DateDemo() {
  const [locale, setLocale] = useState("en-US");
  const now = new Date();
  const formatted = now.toLocaleDateString(locale, { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  const time = now.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex gap-2">
        {["en-US", "fr-FR", "ja-JP", "ar-SA"].map((l) => (
          <button key={l} onClick={() => setLocale(l)} className={cn("rounded-lg px-3 py-2 text-sm font-medium transition-colors", locale === l ? "bg-white/10 text-white" : "text-white/40 hover:text-white/70")}>
            {l.split("-")[0].toUpperCase()}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={locale}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="rounded-xl border border-white/10 bg-white/5 px-6 py-4"
        >
          <p className="text-base text-white">{formatted}</p>
          <p className="mt-1 text-sm text-white/40">{time}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function TranslationDemo() {
  const [editing, setEditing] = useState(false);
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-full max-w-md">
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="rounded-xl border border-white/10 bg-white/5 p-5"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/40">en</span>
            <span className="text-[10px] text-emerald-400">Source</span>
          </div>
          <p className="mt-2 text-base text-white">Welcome back, Sarah!</p>
        </motion.div>
        <div className="mx-auto mt-2 flex size-6 items-center justify-center rounded-full border border-white/10 bg-[#0a0a0a]">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/40">
            <path d="M6 2v8M2 6h8" />
          </svg>
        </div>
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/40">fr</span>
            <button onClick={() => setEditing(!editing)} className="text-[10px] text-emerald-400 hover:text-emerald-300">
              {editing ? "Save" : "Edit"}
            </button>
          </div>
          {editing ? (
            <input defaultValue="Bienvenue, Sarah !" className="mt-2 w-full bg-transparent text-base text-white outline-none" />
          ) : (
            <p className="mt-2 text-base text-white">Bienvenue, Sarah !</p>
          )}
        </motion.div>
      </div>
    </div>
  );
}

const tabs = [
  { id: "pill", label: "Pill Switcher", Component: PillDemo },
  { id: "dropdown", label: "Dropdown Picker", Component: DropdownDemo },
  { id: "rtl", label: "RTL Layout", Component: RTLDemo },
  { id: "date", label: "Date Formatter", Component: DateDemo },
  { id: "translation", label: "Translation Widget", Component: TranslationDemo },
];

export function ComponentShowcase() {
  return (
    <section id="components" className="relative scroll-mt-24 py-32 overflow-hidden bg-black">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[600px] w-[800px] -translate-y-1/3 rounded-full bg-emerald-500/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="flex flex-col items-center text-center">
            <h2 className="text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Beautifully crafted. <br />
              <span className="bg-gradient-to-br from-emerald-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(52,211,153,0.3)]">
                Ready to drop in.
              </span>
            </h2>
            <p className="mt-6 max-w-2xl text-lg text-white/50">
              Stop reinventing the language switcher. Choose from a collection of fully styled, 
              interactive localization components built for Next.js and Tailwind.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-20 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Bento Card 1: Pill Demo */}
            <div className="group relative flex h-[350px] flex-col overflow-hidden rounded-[24px] border border-white/[0.05] bg-white/[0.01] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)] transition-all hover:bg-white/[0.02]">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="p-6">
                <h3 className="text-lg font-medium text-white">Pill Switcher</h3>
                <p className="mt-1 text-sm text-white/40">Smooth animated layout transitions.</p>
              </div>
              <div className="flex flex-1 items-center justify-center p-6">
                <PillDemo />
              </div>
            </div>

            {/* Bento Card 2: Dropdown Demo */}
            <div className="group relative flex h-[350px] flex-col overflow-hidden rounded-[24px] border border-white/[0.05] bg-white/[0.01] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)] transition-all hover:bg-white/[0.02]">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="p-6">
                <h3 className="text-lg font-medium text-white">Dropdown Picker</h3>
                <p className="mt-1 text-sm text-white/40">Classic, space-saving design.</p>
              </div>
              <div className="flex flex-1 items-center justify-center p-6 relative z-20">
                <DropdownDemo />
              </div>
            </div>

            {/* Bento Card 3: Translation Widget (Tall) */}
            <div className="group relative flex min-h-[350px] flex-col overflow-hidden rounded-[24px] border border-white/[0.05] bg-white/[0.01] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)] transition-all hover:bg-white/[0.02] md:col-span-2 lg:col-span-1 lg:row-span-2">
              <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="p-6">
                <h3 className="text-lg font-medium text-white">In-context Editing</h3>
                <p className="mt-1 text-sm text-white/40">Preview and modify translations live.</p>
              </div>
              <div className="flex flex-1 items-center justify-center p-6">
                <TranslationDemo />
              </div>
            </div>

            {/* Bento Card 4: RTL Layout (Wide) */}
            <div className="group relative flex h-[350px] flex-col overflow-hidden rounded-[24px] border border-white/[0.05] bg-white/[0.01] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)] transition-all hover:bg-white/[0.02] lg:col-span-2">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.05)_0%,transparent_70%)] opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="p-6">
                <h3 className="text-lg font-medium text-white">RTL Native</h3>
                <p className="mt-1 text-sm text-white/40">Automatic mirroring and text alignment for Arabic, Hebrew, and more.</p>
              </div>
              <div className="flex flex-1 items-center justify-center p-6">
                <RTLDemo />
              </div>
            </div>
            
            {/* Note: DateDemo was removed from the bento grid as it was taking up awkward space, we have 4 strong showcases now */}
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-12 flex justify-center">
            <Link
              href="/docs/components"
              className="inline-flex items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.02] px-6 py-3 text-sm font-medium text-white transition-all hover:bg-white/[0.05] hover:pr-5"
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
