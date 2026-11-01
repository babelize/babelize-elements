import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { RootProvider } from "fumadocs-ui/provider/next";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { NextIntlClientProvider, useLocale } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";
import { localeDirection } from "../i18n/locales";
import { baseOpenGraph } from "@/lib/locale-path";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations("meta");
  return {
    metadataBase: new URL("https://elements.babelize.co/"),
    title: {
      default: t("title"),
      template: "%s | Babelize Elements",
    },
    description: t("description"),
    keywords: [
      "localization",
      "i18n",
      "internationalization",
      "UI components",
      "React components",
      "Tailwind CSS",
      "language switcher",
      "locale picker",
      "Babelize",
      "open source",
    ],
    // Pages set og:url (and docs their own title); a page's openGraph replaces this one.
    openGraph: {
      ...baseOpenGraph(locale),
      title: t("title"),
      description: t("ogDescription"),
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("ogDescription"),
    },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = useLocale();
  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      dir={localeDirection(locale)}
    >
      <head>
        <meta name="color-scheme" content="light dark" />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <RootProvider theme={{ enabled: false }}>
            <NextIntlClientProvider>{children}</NextIntlClientProvider>
          </RootProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
