import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: { index: "src/registry/components/index.ts" },
    outDir: "dist",
    format: ["esm", "cjs"],
    dts: true,
    sourcemap: true,
    clean: false,
    treeshake: true,
    target: "es2019",
    tsconfig: "tsconfig.lib.json",
    external: ["react", "react-dom", "next", "clsx", "tailwind-merge"],
  },
  {
    entry: { "cli/index": "src/cli/index.ts" },
    outDir: "dist",
    format: ["esm"],
    platform: "node",
    target: "node20",
    sourcemap: true,
    clean: false,
    tsconfig: "tsconfig.lib.json",
  },
]);
