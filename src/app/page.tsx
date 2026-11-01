import type { Metadata } from "next";
import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { Community } from "@/components/landing/community";
import { Faq } from "@/components/landing/faq";
import { Footer } from "@/components/landing/footer";

import { getGitHubStats } from "@/lib/github";
import { getLocale, getTranslations } from "next-intl/server";
import { baseOpenGraph, languageAlternates, pathInLocale } from "@/lib/locale-path";

// Each language's own URL is canonical (/ja, not /), with the others as hreflang alternates.
export async function generateMetadata(): Promise<Metadata> {
  const [locale, t] = await Promise.all([getLocale(), getTranslations("meta")]);
  const url = pathInLocale("/", locale);
  return {
    alternates: { canonical: url, languages: languageAlternates("/") },
    openGraph: {
      ...baseOpenGraph(locale),
      url,
      title: t("title"),
      description: t("ogDescription"),
    },
  };
}

export default async function Home() {
  const stats = await getGitHubStats();

  return (
    <div className="flex flex-1 flex-col">
      <Navbar stats={stats} />
      <main>
        <Hero />
        <Features />

        <Community stats={stats} />
        <Faq />
      </main>
      <Footer />
    </div>
  );
}
