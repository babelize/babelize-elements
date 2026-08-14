"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";

/* ── Locale context ── */

const LOCALES = [
  { code: "en", label: "English" },
  { code: "fr", label: "French" },
  { code: "de", label: "German" },
] as const;

type Locale = (typeof LOCALES)[number]["code"];
type StrField = "greeting" | "subtitle";

const INITIAL: Record<StrField, Record<Locale, string>> = {
  greeting: {
    en: "Welcome back, Sarah!",
    fr: "Bon retour, Sarah !",
    de: "Willkommen zurück, Sarah!",
  },
  subtitle: {
    en: "Here's what changed while you were away.",
    fr: "Voici ce qui a changé pendant votre absence.",
    de: "Das ist neu, seit du weg warst.",
  },
};

const FIELD_LABELS: Record<StrField, string> = {
  greeting: "Greeting",
  subtitle: "Description",
};

/* ── Interactive console demo ── */

function EditingDemo() {
  const [locale, setLocale] = useState<Locale>("en");
  const [text, setText] = useState(INITIAL);
  const [editing, setEditing] = useState<StrField | null>(null);
  const [draft, setDraft] = useState("");
  const [saved, setSaved] = useState(false);
  const savedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!editing) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setEditing(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [editing]);

  useEffect(() => () => {
    if (savedTimer.current) clearTimeout(savedTimer.current);
  }, []);

  const open = (field: StrField) => {
    setEditing(field);
    setDraft(text[field][locale]);
  };

  const switchLocale = (next: Locale) => {
    setLocale(next);
    if (editing) setDraft(text[editing][next]);
  };

  const save = () => {
    if (!editing) return;
    const value = draft.trim();
    if (value) {
      setText((prev) => ({
        ...prev,
        [editing]: { ...prev[editing], [locale]: value },
      }));
    }
    setEditing(null);
    setSaved(true);
    if (savedTimer.current) clearTimeout(savedTimer.current);
    savedTimer.current = setTimeout(() => setSaved(false), 1800);
  };

  const editable = (m: StrField) => (
    <div className="relative">
      <button
        type="button"
        onClick={() => open(m)}
        className={cn(
          "group/row relative flex w-full items-center gap-3 rounded-lg transition-all duration-200",
          editing === m
            ? "bg-emerald-500/[0.06] shadow-[inset_0_0_0_1px_rgba(16,185,129,0.4)]"
            : "hover:bg-emerald-500/[0.04] hover:shadow-[inset_0_0_0_1px_rgba(16,185,129,0.2)]",
        )}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={`${m}-${text[m][locale]}`}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.14, ease: "easeOut" }}
            className={cn(
              "px-2 py-1.5 text-left",
              m === "greeting" ? "text-lg font-semibold text-white" : "text-sm text-white/55",
            )}
          >
            {text[m][locale]}
          </motion.p>
        </AnimatePresence>
        <span
          className={cn(
            "pointer-events-none absolute right-1 flex size-6 items-center justify-center rounded-md text-emerald-400 transition-opacity duration-150",
            editing === m ? "opacity-90" : "opacity-0 group-hover/row:opacity-100",
          )}
        >
          <Pencil className="size-3.5" />
        </span>
      </button>

      <AnimatePresence>
        {editing === m && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="absolute left-0 top-full z-30 mt-2 w-72 max-w-[calc(100vw-3rem)] rounded-xl border border-white/10 bg-[#0d0d0d] p-3 shadow-[0_24px_60px_rgba(0,0,0,0.6)]"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[11px] font-medium uppercase tracking-widest text-white/40">
                {FIELD_LABELS[m]}
              </span>
              <div className="flex gap-1">
                {LOCALES.map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => switchLocale(l.code)}
                    className={cn(
                      "rounded-md px-2 py-0.5 font-mono text-[10px] font-medium transition-colors",
                      locale === l.code
                        ? "bg-emerald-500/15 text-emerald-300"
                        : "text-white/40 hover:text-white/70",
                    )}
                  >
                    {l.code.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
            <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2">
              <span className="text-[10px] uppercase tracking-widest text-white/30">
                {LOCALES.find((l) => l.code === locale)?.label}
              </span>
              <input
                autoFocus
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") save();
                }}
                className="mt-0.5 w-full bg-transparent text-sm text-white outline-none"
              />
            </div>
            <div className="mt-2.5 flex justify-end">
              <button
                type="button"
                onClick={save}
                disabled={!draft.trim()}
                className="rounded-lg bg-emerald-500 px-3.5 py-1.5 text-xs font-medium text-black transition-colors hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Save
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <div className="relative w-full">
      <div className="relative mx-auto w-full overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0A0A0A] shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
        {/* Window chrome */}
        <div className="flex items-center justify-between rounded-t-2xl border-b border-white/[0.06] bg-white/[0.02] px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-white/15" />
            <span className="size-2.5 rounded-full bg-white/15" />
            <span className="size-2.5 rounded-full bg-white/15" />
            <span className="ml-2 font-mono text-[11px] text-white/30">console.tsx</span>
          </div>
          <span className="font-mono text-[11px] text-white/25">preview</span>
        </div>

        <div className="relative p-5 sm:p-6">
          {/* App header */}
          <div className="flex items-center gap-3 border-b border-white/[0.06] pb-4">
            <span className="flex size-9 items-center justify-center rounded-lg bg-emerald-500/10 text-sm font-bold text-emerald-400">
              B
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white">Babelize Console</p>
              <p className="text-[11px] text-white/40">Localization workspace</p>
            </div>
            <span className="ml-auto shrink-0 rounded-full border border-white/[0.08] bg-white/[0.02] px-2.5 py-1 font-mono text-[11px] text-emerald-300">
              {LOCALES.find((l) => l.code === locale)?.label}
            </span>
          </div>

          {/* Editable strings */}
          <div className="mt-4 space-y-2">
            {editable("greeting")}
            {editable("subtitle")}
          </div>

          {/* Static project list */}
          {[
            { name: "Project Alpha", state: "Active" },
            { name: "Project Beta", state: "Active" },
          ].map((p) => (
            <div
              key={p.name}
              className="mt-2 flex items-center justify-between gap-3 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2.5"
            >
              <span className="text-sm text-white/80">{p.name}</span>
              <span className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-400">
                <span className="size-1.5 rounded-full bg-emerald-400" />
                {p.state}
              </span>
            </div>
          ))}

          {/* Saved confirmation */}
          <AnimatePresence>
            {saved && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.97 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="absolute bottom-3 right-0 z-40 flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.25)]"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                Saved
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* ── Section ── */

export function InContextEditing() {
  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-12 lg:gap-16">
          {/* Text column */}
          <Reveal>
            <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-1 text-xs font-medium uppercase tracking-widest text-neutral-400">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </span>
                In-context editing
              </div>
              <h2 className="text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Edit translations{" "}
                <span className="bg-gradient-to-r from-emerald-300 to-emerald-600 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(52,211,153,0.2)]">
                  where they live.
                </span>
              </h2>
              <p className="mt-5 text-base leading-relaxed text-white/50">
                Update localized content directly inside your interface instead
                of hunting through translation files.
              </p>
              <p className="mt-6 flex items-center gap-2.5 text-sm text-white/40">
                <span className="h-px w-6 bg-emerald-500/60" />
                No context switching. No hunting through translation files.
              </p>
            </div>
          </Reveal>

          {/* Demo column */}
          <Reveal delay={0.1}>
            <EditingDemo />
          </Reveal>
        </div>
      </div>
    </section>
  );
}