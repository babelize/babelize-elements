import { docs } from "fumadocs-mdx:collections/server";
import { loader } from "fumadocs-core/source";
import { defineI18n } from "fumadocs-core/i18n";
import { createElement } from "react";
import type { ComponentType } from "react";
import * as LucideIcons from "lucide-react";
import { locales, sourceLocale } from "@/i18n/locales";

// Translated pages sit next to the English ones (install.ja.mdx, meta.ja.json),
// written by `babelize translate`. English URLs stay /docs/…; the others are
// /ja/docs/…, which the locale proxy serves from /docs/… in that language.
export const i18n = defineI18n({
  defaultLanguage: sourceLocale,
  languages: locales,
  hideLocale: "default-locale",
  parser: "dot",
});

export const source = loader({
  baseUrl: "/docs",
  i18n,
  source: docs.toFumadocsSource(),
  icon(icon) {
    if (!icon) return undefined;
    const Icon = (LucideIcons as unknown as Record<string, ComponentType<{ className?: string }>>)[
      icon
    ];
    if (!Icon) return undefined;
    return createElement(Icon, { className: "size-4 sidebar-icon" });
  },
});
