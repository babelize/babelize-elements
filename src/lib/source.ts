import { docs } from "fumadocs-mdx:collections/server";
import { loader } from "fumadocs-core/source";
import { createElement } from "react";
import type { ComponentType } from "react";
import * as LucideIcons from "lucide-react";

export const source = loader({
  baseUrl: "/docs",
  source: docs.toFumadocsSource(),
  icon(icon) {
    if (!icon) return undefined;
    const Icon = (LucideIcons as unknown as Record<string, ComponentType<{ className?: string }>>)[icon];
    if (!Icon) return undefined;
    return createElement(Icon, { className: "size-4 sidebar-icon" });
  },
});
