#!/usr/bin/env node
/**
 * Packs the library and imports it from a throwaway project outside the repo.
 *
 * Tests that run inside the repo resolve the `@/*` alias through tsconfig, so
 * they pass even when the published output leaks unresolvable specifiers. Only
 * installing the tarball somewhere else proves the package actually resolves.
 */
import { execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const repo = resolve(import.meta.dirname, "..");
const run = (cmd, args, cwd) =>
  execFileSync(cmd, args, { cwd, stdio: "inherit", encoding: "utf8" });

const work = mkdtempSync(join(tmpdir(), "babelize-smoke-"));
let failed = false;

try {
  console.log("→ building");
  run("npm", ["run", "build:lib"], repo);

  console.log("→ packing");
  run("npm", ["pack", "--pack-destination", work], repo);
  const tarball = readdirSync(work).find((f) => f.endsWith(".tgz"));
  if (!tarball) throw new Error("npm pack produced no tarball");

  const app = join(work, "app");
  run("mkdir", ["-p", app]);
  writeFileSync(
    join(app, "package.json"),
    JSON.stringify({ name: "smoke", private: true, version: "0.0.0", type: "module" }, null, 2),
  );

  console.log("→ installing tarball into a bare project");
  run(
    "npm",
    ["install", "--no-audit", "--no-fund", join(work, tarball), "react", "react-dom"],
    app,
  );

  writeFileSync(
    join(app, "esm.mjs"),
    `import { LanguageSwitcher, PhoneInput, NavBar, COUNTRIES, cn } from "@babelize/elements";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";

for (const [name, value] of Object.entries({ LanguageSwitcher, PhoneInput, NavBar, cn })) {
  if (typeof value !== "function" && typeof value !== "object") {
    throw new Error(\`export \${name} is \${typeof value}\`);
  }
}
if (!Array.isArray(COUNTRIES) || COUNTRIES.length === 0) throw new Error("COUNTRIES empty");

const html = renderToStaticMarkup(
  createElement(LanguageSwitcher, { locales: [{ code: "en" }, { code: "fr" }] }),
);
if (!html.includes("English")) throw new Error("LanguageSwitcher did not render: " + html);

const nav = renderToStaticMarkup(
  createElement(NavBar, { links: [{ label: "Docs", href: "/docs" }] }),
);
if (!nav.includes("/docs")) throw new Error("NavBar did not render links");

console.log("  ESM import + SSR render OK");
`,
  );

  writeFileSync(
    join(app, "cjs.cjs"),
    `const { LanguageSwitcher, COUNTRIES } = require("@babelize/elements");
if (!LanguageSwitcher) throw new Error("CJS export missing");
if (!Array.isArray(COUNTRIES)) throw new Error("CJS COUNTRIES missing");
console.log("  CJS require OK");
`,
  );

  console.log("→ importing as ESM");
  run("node", ["esm.mjs"], app);
  console.log("→ requiring as CJS");
  run("node", ["cjs.cjs"], app);

  console.log("\n✓ packaging smoke test passed");
} catch (err) {
  failed = true;
  console.error("\n✗ packaging smoke test failed:", err.message);
} finally {
  rmSync(work, { recursive: true, force: true });
}

process.exit(failed ? 1 : 0);
