"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const languages = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "ja", label: "日本語", flag: "🇯🇵" },
  { code: "ar", label: "العربية", flag: "🇸🇦", rtl: true },
];

const mockContent: Record<string, { greeting: string; name: string; button: string; desc: string; rtl?: boolean }> = {
  en: { greeting: "Welcome back", name: "Sarah", button: "Dashboard", desc: "You have 3 new notifications" },
  fr: { greeting: "Bienvenue", name: "Sarah", button: "Tableau de bord", desc: "Vous avez 3 nouvelles notifications" },
  es: { greeting: "Bienvenido", name: "Sarah", button: "Panel", desc: "Tienes 3 notificaciones nuevas" },
  de: { greeting: "Willkommen", name: "Sarah", button: "Dashboard", desc: "Sie haben 3 neue Benachrichtigungen" },
  ja: { greeting: "おかえりなさい", name: "サラ", button: "ダッシュボード", desc: "新しい通知が3件あります" },
  ar: { greeting: "مرحبا بعودتك", name: "سارة", button: "لوحة التحكم", desc: "لديك 3 إشعارات جديدة", rtl: true },
};

function PillSwitcher({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="inline-flex rounded-full border border-white/10 bg-white/5 p-1">
      {languages.slice(0, 4).map((l) => (
        <button
          key={l.code}
          onClick={() => onChange(l.code)}
          className={cn(
            "relative rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-300",
            value === l.code
              ? "text-black shadow-lg"
              : "text-white/60 hover:text-white",
          )}
        >
          {value === l.code && (
            <span className="absolute inset-0 rounded-full bg-emerald-500" />
          )}
          <span className="relative z-10 flex items-center gap-1.5">
            <span>{l.flag}</span>
            <span className="hidden sm:inline">{l.label}</span>
          </span>
        </button>
      ))}
    </div>
  );
}

function SegmentedControl({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex rounded-lg border border-white/10 bg-white/5 p-0.5">
      {languages.slice(0, 3).map((l) => (
        <button
          key={l.code}
          onClick={() => onChange(l.code)}
          className={cn(
            "rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-200",
            value === l.code
              ? "bg-white/10 text-white shadow-sm"
              : "text-white/50 hover:text-white/80",
          )}
        >
          {l.flag} {l.code.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

export function HeroLanguageSwitcher() {
  const [lang, setLang] = useState("en");
  const content = mockContent[lang];
  const isRtl = languages.find((l) => l.code === lang)?.rtl;

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className="overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-transparent shadow-[0_40px_100px_rgba(0,0,0,0.5)]"
    >
      <div className="p-5 sm:p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <PillSwitcher value={lang} onChange={setLang} />
          <SegmentedControl value={lang} onChange={setLang} />
        </div>

        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-sm text-white/50">{content.greeting}</p>
            <p className="text-lg font-semibold text-white">{content.name}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-bold text-black">
                3
              </span>
              <div className="flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                  <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <p className="text-sm text-white/40">{content.desc}</p>
      </div>
    </div>
  );
}
