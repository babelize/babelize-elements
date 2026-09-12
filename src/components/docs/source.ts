import { readFileSync } from "node:fs";
import { join } from "node:path";
import { highlight } from "fumadocs-core/highlight";

/**
 * Sources in this repo import components from `@/registry/components/*`; consumers
 * get them at the path shadcn installs to, so rewrite the specifier before display.
 */
export function rewriteImports(source: string): string {
  return source.replace(/@\/registry\/components\//g, "@/components/ui/");
}

/** Read a file under `src/` and highlight it server-side. */
export async function readHighlighted(path: string) {
  const code = rewriteImports(
    readFileSync(join(process.cwd(), "src", ...path.split("/")), "utf8").trimEnd(),
  );

  return {
    code,
    fileName: path.split("/").pop() ?? path,
    // Dual themes emit CSS variables for both palettes; `.custom-code-block` in
    // globals.css picks one per colour scheme. A single theme would be unreadable
    // on the light panel, whose background comes from Tailwind, not from Shiki.
    highlighted: await highlight(code, {
      lang: "tsx",
      themes: { light: "github-light", dark: "github-dark" },
      defaultColor: false,
    }),
  };
}
