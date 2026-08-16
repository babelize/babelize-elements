import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { RootProvider } from "fumadocs-ui/provider/next";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://elements.babelize.co/"),
  title: {
    default: "Babelize Elements - Open Source Localization UI Components",
    template: "%s | Babelize Elements",
  },
  description:
    "Open-source Localization UI components for React and Tailwind CSS. Language switchers, locale pickers, translation widgets, and more — built by the community.",
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
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://elements.babelize.co",
    siteName: "Babelize Elements",
    title: "Babelize Elements - Open Source Localization UI Components",
    description:
      "Open-source Localization UI components for React and Tailwind CSS. Built by the community.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Babelize Elements - Open Source Localization UI Components",
    description:
      "Open-source Localization UI components for React and Tailwind CSS. Built by the community.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <meta name="color-scheme" content="light dark" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&family=Nunito:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&family=IBM+Plex+Sans:wght@400;500;600;700&family=Cormorant+Garamond:wght@400;500;600;700&family=Bitter:wght@400;500;600;700&family=Fira+Code:wght@400;500;600;700&family=Press+Start+2P&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <RootProvider theme={{ enabled: false }}>{children}</RootProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
