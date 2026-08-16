"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { NavBar, type Locale } from "@/registry/components/navbar";
import { CodeBlock } from "./code-block";
import { ThemeDropdown, type ThemeName } from "./theme-dropdown";

const CODE_SNIPPET = `"use client";

import { useState } from "react";
import { NavBar } from "@babelize/elements";

const translations = {
  en: { home: "Home", docs: "Docs", pricing: "Pricing", cta: "Get Started" },
  fr: { home: "Accueil", docs: "Docs", pricing: "Tarifs", cta: "Commencer" },
  es: { home: "Inicio", docs: "Docs", pricing: "Precios", cta: "Empezar" },
};

const locales = [
  { code: "en" },
  { code: "fr" },
  { code: "es" },
];

export default function App() {
  const [locale, setLocale] = useState("en");
  const tr = translations[locale] ?? translations.en;

  return (
    <NavBar
      logo={<span className="font-bold">MyApp</span>}
      links={[
        { label: tr.home, href: "/" },
        { label: tr.docs, href: "/docs" },
        { label: tr.pricing, href: "/pricing" },
      ]}
      locales={locales}
      currentLocale={locale}
      onLocaleChange={(code) => {
        setLocale(code);
        // e.g. router.push(\`/\${code}\`);
      }}
      cta={{ label: tr.cta, href: "/signup" }}
      showGitHub
    />
  );
}`;

const locales: Locale[] = [
  { code: "en" },
  { code: "fr" },
  { code: "es" },
  { code: "de" },
  { code: "ja" },
  { code: "ar" },
];

const translations: Record<string, { home: string; docs: string; pricing: string; blog: string; cta: string }> = {
  en: { home: "Home", docs: "Docs", pricing: "Pricing", blog: "Blog", cta: "Get Started" },
  fr: { home: "Accueil", docs: "Docs", pricing: "Tarifs", blog: "Blog", cta: "Commencer" },
  es: { home: "Inicio", docs: "Docs", pricing: "Precios", blog: "Blog", cta: "Empezar" },
  de: { home: "Startseite", docs: "Docs", pricing: "Preise", blog: "Blog", cta: "Loslegen" },
  ja: { home: "\u30db\u30fc\u30e0", docs: "\u30c9\u30ad\u30e5\u30e1\u30f3\u30c8", pricing: "\u6599\u91d1", blog: "\u30d6\u30ed\u30b0", cta: "\u59cb\u3081\u308b" },
  ar: { home: "\u0627\u0644\u0631\u0626\u064a\u0633\u064a\u0629", docs: "\u0627\u0644\u062a\u0648\u062b\u064a\u0642", pricing: "\u0627\u0644\u0623\u0633\u0639\u0627\u0631", blog: "\u0627\u0644\u0645\u062f\u0648\u0646\u0629", cta: "\u0627\u0628\u062f\u0623" },
};

export function NavBarDemo() {
  const [locale, setLocale] = useState("en");
  const [previewDark, setPreviewDark] = useState(true);
  const [theme, setTheme] = useState<ThemeName>("emerald");
  const [tab, setTab] = useState<"preview" | "code">("preview");
  const tr = translations[locale] ?? translations.en;

  const links = [
    { label: tr.home, href: "/" },
    { label: tr.docs, href: "/docs" },
    { label: tr.pricing, href: "/pricing" },
    { label: tr.blog, href: "/blog" },
  ];

  return (
    <div className="space-y-0">
      <div className="flex items-center justify-between rounded-t-2xl border border-b-0 border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] px-3 py-2">
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

      {tab === "preview" ? (
        <div
          className={cn(
            "relative overflow-visible rounded-b-2xl border border-t-0 shadow-2xl transition-colors",
            `theme-${theme}`,
            previewDark && "dark",
            "bg-background text-foreground border-border"
          )}
        >
          <div className="relative">
            <NavBar
              logo={
                <span className="text-lg font-bold text-foreground">
                  MyApp
                </span>
              }
              links={links}
              locales={locales}
              currentLocale={locale}
              onLocaleChange={setLocale}
              cta={{ label: tr.cta, href: "/signup" }}
              showGitHub
              sticky={false}
            />

            <div className="px-6 py-16 text-center">
              <p className="text-sm text-muted-foreground">
                Current locale: <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-foreground">{locale}</code>
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-b-2xl border border-t-0 border-black/10 dark:border-white/10 bg-[#0A0A0A] p-4">
          <CodeBlock code={CODE_SNIPPET} lang="tsx" />
        </div>
      )}
    </div>
  );
}
