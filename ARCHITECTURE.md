# Architecture

How this repo is put together, and what you need to touch to add a component.

## One repo, three products

The same `src/` tree produces three things that ship independently:

| Product                                      | Built from                                           | Shipped as                           |
| -------------------------------------------- | ---------------------------------------------------- | ------------------------------------ |
| **npm package** — `@babelize/elements`       | `src/registry/components/`, `src/lib/`               | `dist/` via `tsup`, published to npm |
| **Component registry** — copy-paste installs | `src/registry/registry.ts` serving files from `src/` | JSON endpoints on the docs site      |
| **Docs site** — elements.babelize.co         | `src/app/`, `src/components/`, `content/`            | Next.js build on Vercel              |

The consequence worth internalising: **a file under `src/registry/components/` is
published to npm _and_ served as copy-paste source _and_ rendered in the docs.**
Anything else under `src/` is website-only and never reaches a consumer.

## Directory map

```
src/
  registry/
    components/          ← THE LIBRARY. Everything here is published.
      index.ts             barrel — the entire public API surface
      types.ts             shared Locale interface
      language-switcher.tsx
      phone-input.tsx
      navbar.tsx
    registry.ts          ← registry manifest: item list, deps, install paths
  lib/
    utils.ts             ← cn(); published, also served as a registry item
    use-controllable-state.ts  ← published, also served as a registry item
    source.ts            website only (Fumadocs loader)
  cli/
    index.ts             `npx @babelize/elements add <component>`
    paths.ts             tsconfig alias resolution (pure, unit-tested)
  app/
    page.tsx             landing page
    docs/[[...slug]]/    docs renderer
    r/[name]/route.ts    GET /r/<item>.json      — one registry item
    registry.json/route.ts  GET /registry.json   — the registry index
  components/
    landing/             website only
    docs/                website only — live demos embedded in MDX

content/docs/            MDX documentation, sidebar order in meta.json
test/                    vitest; mirrors component names
scripts/smoke-pack.mjs   packs the tarball and imports it from outside the repo
```

## What builds what

- `bun run build:lib` → `tsup` → `dist/index.js` (ESM), `dist/index.cjs` (CJS),
  `dist/index.d.ts`, plus `dist/cli/index.js`. Config in `tsup.config.ts`, types
  from `tsconfig.lib.json`.
  **tsup, not `tsc`** — plain `tsc` does not rewrite the `@/*` path alias, which
  shipped an unresolvable `import { cn } from "@/lib/utils"` to npm for 16 releases.
- `bun run build` → `next build` for the docs site.
- `bun run test:pack` → installs the packed tarball into a throwaway project
  outside the repo and imports it. This is the only check that catches an
  unresolvable specifier in `dist/`, because tests inside the repo resolve `@/*`
  through tsconfig and pass regardless.

## Component conventions

Every component in `src/registry/components/` follows the same four rules. They are
not stylistic — the tests and the public API depend on them.

1. **Controlled and uncontrolled**, via `useControllableState` from
   `@/lib/use-controllable-state`:
   `value` (controlled) / `defaultValue` (uncontrolled) / `onValueChange`.
   Never `useState(props.value)` — that produces a prop that looks controlled and
   silently ignores changes.
2. **Forward the ref, spread the rest.** `React.forwardRef`, and `...rest` onto the
   root element, so `id`, `name`, `aria-*` and `data-*` pass through.
3. **Extend the underlying element's props**, omitting what you redefine:
   ```ts
   export interface FooProps
     extends Omit<React.ComponentPropsWithoutRef<"div">, "defaultValue" | "onChange"> {
   ```
4. **Shared types come from `./types`.** Do not declare a local `Locale`. Two
   divergent copies previously hid behind a `NavBarLocale` alias.

Also: `"use client"` at the top, Tailwind utility classes only (no CSS-variable
design tokens), dark mode via `dark:` variants, and TSDoc on every prop.

**No framework dependencies.** The package's only runtime deps are `clsx` and
`tailwind-merge`. `NavBar` needs link rendering, so it takes a `linkComponent`
prop defaulting to `"a"` rather than importing `next/link` — that keeps the
library usable in Vite, Remix, or plain React.

## Adding a component

Six files, in this order.

**1. The component** — `src/registry/components/my-thing.tsx`

Follow the four conventions above. Import `cn` from `@/lib/utils`, shared types
from `./types`.

**2. Export it** — `src/registry/components/index.ts`

```ts
export { MyThing } from "./my-thing";
export type { MyThingProps } from "./my-thing";
```

This barrel _is_ the public API. Anything not exported here is unreachable for npm
consumers.

**3. Register it** — `src/registry/registry.ts`, add to `ITEMS`:

```ts
{
  name: "my-thing",
  title: "My Thing",
  description: "One sentence, shown in the CLI and the registry index.",
  type: "registry:component",
  source: "registry/components/my-thing",     // relative to src/, no extension
  filePath: "components/ui/my-thing.tsx",     // where it lands in a consumer's repo
  dependencies: ["clsx", "tailwind-merge"],   // npm packages to install
  registryDependencies: ["utils", "locale-types", "use-controllable-state"],
}
```

`registryDependencies` are other items in _this_ registry, listed by name. They are
converted to absolute URLs on the way out — a bare name would make the shadcn CLI
look them up in its own registry instead of ours. Omit any you do not import.

**4. Tests** — `test/my-thing.test.tsx`

Cover render, interaction, controlled mode (change `value` from a parent and assert
the display follows), ref forwarding, and prop passthrough. Copy the shape of
`test/language-switcher.test.tsx`.

**5. Docs** — `content/docs/components/<category>/my-thing.mdx`, and add the slug to
that directory's `meta.json` to place it in the sidebar.

**6. A live demo** — `src/components/docs/my-thing-demo.tsx`, wired up in
`src/components/docs/preview-components.tsx` so the MDX page can embed it.

Then:

```bash
bun run lint && bun run typecheck && bun run test && bun run build && bun run build:lib
```

To exercise the copy-paste path against your own machine rather than production:

```bash
BABELIZE_SITE_URL=http://localhost:3000 bun run dev
# then, in a scratch project whose components.json points @elements at localhost:
npx shadcn@latest add @elements/my-thing
```

## The registry endpoints

`src/registry/registry.ts` is the single source of truth. It reads component source
off disk at request time and returns it inline in the JSON, so the served source can
never drift from the published source.

- `GET /registry.json` and `GET /r/index.json` — the index. Both exist because
  shadcn discovers a registry by fetching `<base>/index.json`.
- `GET /r/<name>.json` — one item, with file contents.

Cache headers are `s-maxage=300, stale-while-revalidate=86400`. Not `immutable`:
the registry changes every release, and `immutable` pins stale component source in
every CDN and browser cache.

Note `registry.ts` reads from `process.cwd()/src/...` at request time, which relies
on Next bundling the `src` tree into the serverless function. It works, but a build
change could break it silently — generating the JSON at build time would be sturdier.

## Two consumption paths, both must work

1. **npm** — `npm install @babelize/elements`, import from the package. Verified by
   `bun run test:pack`.
2. **Copy-paste** — `npx shadcn@latest add @elements/<name>` or
   `npx @babelize/elements add <name>`. Files are written into the consumer's repo
   and they own the code from then on. `src/cli/paths.ts` resolves their tsconfig
   aliases so files land where their imports expect (`@/*` usually means `./src/*`).

A change to a component affects both. A change to `registry.ts` affects only the
second.

## Releasing

Merging to `main` publishes nothing. A release happens when a GitHub Release is
published: the tag is the version, `.github/workflows/release.yml` re-runs the full
check set against that commit, then publishes to npm with provenance. See
`CONTRIBUTING.md`.
