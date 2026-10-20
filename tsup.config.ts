import { defineConfig } from "tsup";

const SHARED = {
  outDir: "dist",
  sourcemap: true,
  clean: false,
  target: "es2019",
  tsconfig: "tsconfig.lib.json",
} as const;

export default defineConfig([
  {
    ...SHARED,
    entry: { index: "src/registry/components/index.ts" },
    format: ["esm", "cjs"],
    dts: true,
    external: ["react", "react-dom", "next", "clsx", "tailwind-merge", "lucide-react", "motion"],
    // Every component in this entry is stateful, and bundling strips the
    // per-file directives. Without this the package throws
    // "useState is not a function" the moment a React Server Component
    // imports it — which is the default in the Next.js App Router.
    //
    // `treeshake` stays off: it runs a Rollup pass after esbuild that drops
    // this banner. Consumers still tree-shake via `sideEffects: false`, and the
    // extra bytes are ~1.5 KB.
    banner: { js: '"use client";' },
  },
  {
    // `cn` shipped without the directive as well, so server components can call
    // it directly instead of importing the client bundle above.
    ...SHARED,
    entry: { utils: "src/lib/utils.ts" },
    format: ["esm", "cjs"],
    dts: true,
    external: ["clsx", "tailwind-merge"],
  },
  {
    ...SHARED,
    entry: { "cli/index": "src/cli/index.ts" },
    format: ["esm"],
    platform: "node",
    target: "node20",
  },
]);
