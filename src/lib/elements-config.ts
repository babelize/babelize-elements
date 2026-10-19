import type { Locale } from "@/registry/components/types";
import type { NavLink } from "@/registry/components/navbar";

/** Sample data shared by the docs demos. */

export const locales: Locale[] = [
  { code: "en" },
  { code: "fr" },
  { code: "es" },
  { code: "de" },
  { code: "hi" },
  { code: "ja" },
  { code: "ar" },
];

export const pillLocales: Locale[] = [
  { code: "en", label: "EN" },
  { code: "fr", label: "FR" },
  { code: "de", label: "DE" },
  { code: "ja", label: "日本" },
  { code: "ar", label: "عربي" },
];

export const navLinks: NavLink[] = [
  { label: "Product", href: "#product" },
  { label: "Docs", href: "/docs" },
  { label: "Pricing", href: "#pricing" },
];

export const translation = {
  source: "Your order has shipped! Track your package anytime from the Orders page.",
  target:
    "Votre commande a été expédiée ! Suivez votre colis à tout moment depuis la page Commandes.",
};
