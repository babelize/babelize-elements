import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { RootProvider } from "fumadocs-ui/provider/next";
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
    "Open-source, copy-paste Localization UI components for React and Tailwind CSS. Language switchers, locale pickers, translation widgets, and more — built by the community.",
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
      "Open-source, copy-paste Localization UI components for React and Tailwind CSS. Built by the community.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Babelize Elements - Open Source Localization UI Components",
    description:
      "Open-source, copy-paste Localization UI components for React and Tailwind CSS. Built by the community.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
