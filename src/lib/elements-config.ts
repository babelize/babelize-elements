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

/** NavBar links and CTA, translated for every demo locale. */
export const navCopy: Record<string, { links: NavLink[]; cta: string }> = {
  en: { links: links("Product", "Docs", "Pricing"), cta: "Get started" },
  fr: { links: links("Produit", "Docs", "Tarifs"), cta: "Commencer" },
  es: { links: links("Producto", "Docs", "Precios"), cta: "Empezar" },
  de: { links: links("Produkt", "Docs", "Preise"), cta: "Loslegen" },
  hi: { links: links("उत्पाद", "दस्तावेज़", "मूल्य"), cta: "शुरू करें" },
  ja: { links: links("製品", "ドキュメント", "料金"), cta: "はじめる" },
  ar: { links: links("المنتج", "التوثيق", "الأسعار"), cta: "ابدأ الآن" },
};

function links(product: string, docs: string, pricing: string): NavLink[] {
  return [
    { label: product, href: "#product" },
    { label: docs, href: "/docs" },
    { label: pricing, href: "#pricing" },
  ];
}

export const translation = {
  source: "Your order has shipped! Track your package anytime from the Orders page.",
  target:
    "Votre commande a été expédiée ! Suivez votre colis à tout moment depuis la page Commandes.",
};
