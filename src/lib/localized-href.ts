import type * as PageTree from "fumadocs-core/page-tree";
import { sourceLocale } from "@/i18n/locales";

/** `/docs/…` in `locale`: `/ja/docs/…`. Other links (external, anchors, English) are unchanged. */
export function localizedHref(href: string | undefined, locale: string): string | undefined {
  if (!href || locale === sourceLocale) return href;
  return href === "/docs" || href.startsWith("/docs/") || href.startsWith("/docs#")
    ? `/${locale}${href}`
    : href;
}

/** A page tree whose links stay in `locale` (meta.json links are written as `/docs/…`). */
export function localizeTree<T extends PageTree.Root | PageTree.Node>(node: T, locale: string): T {
  if (locale === sourceLocale) return node;
  const out = { ...node } as Record<string, unknown>;
  if (typeof out.url === "string" && !out.external) out.url = localizedHref(out.url, locale);
  if (out.index) out.index = localizeTree(out.index as PageTree.Node, locale);
  if (Array.isArray(out.children))
    out.children = (out.children as PageTree.Node[]).map((c) => localizeTree(c, locale));
  return out as T;
}
