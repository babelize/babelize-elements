"use client";

import { useState } from "react";
import { NavBar, type Locale } from "@/registry/components/navbar";

const locales: Locale[] = [
  { code: "en" },
  { code: "fr" },
  { code: "es" },
  { code: "de" },
  { code: "ja" },
  { code: "ar" },
];

const links: Record<string, { label: string; href: string }[]> = {
  en: [
    { label: "Home", href: "/" },
    { label: "Docs", href: "/docs" },
    { label: "Pricing", href: "/pricing" },
  ],
  fr: [
    { label: "Accueil", href: "/" },
    { label: "Docs", href: "/docs" },
    { label: "Tarifs", href: "/pricing" },
  ],
  es: [
    { label: "Inicio", href: "/" },
    { label: "Docs", href: "/docs" },
    { label: "Precios", href: "/pricing" },
  ],
  de: [
    { label: "Startseite", href: "/" },
    { label: "Docs", href: "/docs" },
    { label: "Preise", href: "/pricing" },
  ],
  ja: [
    { label: "ホーム", href: "/" },
    { label: "ドキュメント", href: "/docs" },
    { label: "料金", href: "/pricing" },
  ],
  ar: [
    { label: "الرئيسية", href: "/" },
    { label: "التوثيق", href: "/docs" },
    { label: "الأسعار", href: "/pricing" },
  ],
};

export function NavBarDemo() {
  const [locale, setLocale] = useState("en");

  return (
    <NavBar
      logo={<span className="text-lg font-bold">MyApp</span>}
      links={links[locale]}
      locales={locales}
      value={locale}
      onValueChange={setLocale}
      cta={{ label: "Get Started", href: "/signup" }}
      showGitHub
      sticky={false} // the docs preview scrolls with the page
    />
  );
}
