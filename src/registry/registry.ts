import { readFileSync } from "node:fs";
import { join } from "node:path";

export const REGISTRY_NAME = "babelize";
export const REGISTRY_HOMEPAGE = "https://elements.babelize.co";
export const REGISTRY_SCHEMA = "https://ui.shadcn.com/schema/registry.json";
export const REGISTRY_ITEM_SCHEMA = "https://ui.shadcn.com/schema/registry-item.json";

interface ItemDef {
  name: string;
  title: string;
  description: string;
  type: string;
  /** Source file relative to `src/`. */
  source: string;
  /** Install destination path (shadcn resolves it against the user's aliases). */
  filePath: string;
  dependencies?: string[];
  registryDependencies?: string[];
}

const ITEMS: ItemDef[] = [
  {
    name: "language-switcher",
    title: "Language Switcher",
    description:
      "Copy-paste language switcher component for React with dropdown, search, RTL support, and full accessibility.",
    type: "registry:component",
    source: "registry/components/language-switcher",
    filePath: "components/ui/language-switcher.tsx",
    dependencies: ["clsx", "tailwind-merge"],
    registryDependencies: ["utils", "locale-types", "use-controllable-state"],
  },
  {
    name: "phone-input",
    title: "Phone Input",
    description:
      "International phone number input with country selector, flag emojis, and dial code search for 50 countries.",
    type: "registry:component",
    source: "registry/components/phone-input",
    filePath: "components/ui/phone-input.tsx",
    dependencies: ["clsx", "tailwind-merge"],
    registryDependencies: ["utils", "use-controllable-state"],
  },
  {
    name: "navbar",
    title: "NavBar",
    description:
      "Responsive navigation bar with built-in language selector, mobile menu, CTA button, and GitHub link.",
    type: "registry:component",
    source: "registry/components/navbar",
    filePath: "components/ui/navbar.tsx",
    dependencies: ["clsx", "tailwind-merge"],
    registryDependencies: ["utils", "locale-types", "use-controllable-state"],
  },
  {
    name: "locale-types",
    title: "Locale Types",
    description: "The shared `Locale` interface used by every locale-aware component.",
    type: "registry:component",
    source: "registry/components/types",
    filePath: "components/ui/types.ts",
  },
  {
    name: "use-controllable-state",
    title: "useControllableState",
    description:
      "Hook backing the `value` / `defaultValue` / `onValueChange` trio on every component.",
    type: "registry:lib",
    source: "lib/use-controllable-state",
    filePath: "lib/use-controllable-state.ts",
  },
  {
    name: "utils",
    title: "Utilities",
    description: "The `cn` helper used across Babelize Elements components.",
    type: "registry:lib",
    source: "lib/utils",
    filePath: "lib/utils.ts",
    dependencies: ["clsx", "tailwind-merge"],
  },
];

/**
 * Absolute URL for an item in this registry.
 *
 * `registryDependencies` entries must be absolute URLs: the shadcn CLI resolves a
 * bare name against its own registry (ui.shadcn.com), and the `@namespace/name`
 * form depends on whatever namespace the consumer picked when adding this registry.
 */
function itemUrl(name: string): string {
  // Overridable so a local dev server emits localhost URLs instead of production ones.
  const base = process.env.BABELIZE_SITE_URL ?? REGISTRY_HOMEPAGE;
  return `${base.replace(/\/$/, "")}/r/${name}.json`;
}

function resolveDeps(deps: string[] | undefined): string[] | undefined {
  return deps?.map((d) => (ITEMS.some((item) => item.name === d) ? itemUrl(d) : d));
}

function readSource(source: string): string {
  const base = join(process.cwd(), "src", ...source.split("/"));
  for (const ext of [".ts", ".tsx"]) {
    try {
      return readFileSync(base + ext, "utf8");
    } catch {
      // try next extension
    }
  }
  throw new Error(`Source file not found: ${base}.{ts,tsx}`);
}

export function getRegistryItem(name: string) {
  const def = ITEMS.find((item) => item.name === name);
  if (!def) return null;

  return {
    $schema: REGISTRY_ITEM_SCHEMA,
    name: def.name,
    type: def.type,
    title: def.title,
    description: def.description,
    dependencies: def.dependencies,
    registryDependencies: resolveDeps(def.registryDependencies),
    files: [
      {
        path: def.filePath,
        type: def.type,
        content: readSource(def.source),
      },
    ],
  };
}

export function getRegistryIndex() {
  return {
    $schema: REGISTRY_SCHEMA,
    name: REGISTRY_NAME,
    homepage: REGISTRY_HOMEPAGE,
    items: ITEMS.map((item) => ({
      name: item.name,
      type: item.type,
      title: item.title,
      description: item.description,
      dependencies: item.dependencies,
      registryDependencies: resolveDeps(item.registryDependencies),
      files: [
        {
          path: item.filePath,
          type: item.type,
        },
      ],
    })),
  };
}

export const registryItemNames = ITEMS.map((item) => item.name);
