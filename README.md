<p align="center">
  <img src="https://raw.githubusercontent.com/babelize/babelize-elements/main/public/elements_logo.svg" width="341" height="64" alt="Babelize Elements logo" />
</p>

<h1 align="center">Babelize Elements</h1>

<p align="center">
  Open-source Localization UI components for React and Tailwind CSS.
  <br />
  Ready-to-use components for language switchers, locale pickers, translation widgets, and more — built by the community.
</p>

<p align="center">
  <a href="https://elements.babelize.co">elements.babelize.co</a>
  ·
  <a href="https://github.com/babelize/babelize-elements/issues">Issues</a>
  ·
  <a href="https://github.com/babelize/babelize-elements/blob/main/CONTRIBUTING.md">Contributing</a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@babelize/elements"><img src="https://img.shields.io/npm/v/@babelize/elements.svg" alt="npm version" /></a>
  <a href="https://www.npmjs.com/package/@babelize/elements"><img src="https://img.shields.io/npm/dm/@babelize/elements.svg" alt="npm downloads" /></a>
  <a href="https://github.com/babelize/babelize-elements/actions/workflows/ci.yml"><img src="https://github.com/babelize/babelize-elements/actions/workflows/ci.yml/badge.svg" alt="CI" /></a>
  <a href="https://github.com/babelize/babelize-elements/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/@babelize/elements.svg" alt="License: MIT" /></a>
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs welcome" />
</p>

## What is Babelize Elements?

**Babelize Elements** is a community-built library of **Localization UI components** for React and Tailwind CSS. Every localized app needs a language switcher, a locale picker, RTL-aware layouts, and pluralization UI — Elements turns that repetitive work into a shared, open-source toolbox.

- **Easy to install** — `npm install @babelize/elements` for the full library, or add components one at a time with `npx shadcn@latest add @babelize/<component>`.
- **No framework lock-in** — plain React and Tailwind. No Next.js, no router, no theme provider required.
- **Localization-first** — pluralization, RTL, and locale data built into every component.
- **Accessible** — keyboard support, ARIA labels, and WCAG-aware markup.
- **Open source** — MIT-licensed, free forever, built by contributors like you.

## Installation

### Full library

```bash
npm install @babelize/elements
```

Tailwind does not scan `node_modules`, so point it at the package once — otherwise
the components render unstyled:

```css
/* Tailwind v4 — in the CSS file that imports Tailwind */
@import "tailwindcss";
@source "../node_modules/@babelize/elements/dist";
```

```js
// Tailwind v3 — in tailwind.config.js
content: ["./src/**/*.{ts,tsx}", "./node_modules/@babelize/elements/dist/**/*.js"],
```

Components are styled with shadcn/ui theme tokens. In a shadcn project they pick up
your theme automatically; otherwise add the tokens once — see
[Theme tokens](https://elements.babelize.co/docs/getting-started/install#theme-tokens).

Components installed with the CLI below live in your own source tree, so they need
no extra Tailwind config.

### Individual components

Install a component with the shadcn CLI — `@babelize` is in the official shadcn registry directory, so no setup is needed:

```bash
npx shadcn@latest add @babelize/language-switcher
```

Or with the CLI bundled in `@babelize/elements`:

```bash
npx @babelize/elements add language-switcher
```

## Usage

Every component works uncontrolled (pass `defaultValue`) or controlled (pass `value`
and `onValueChange`).

```tsx
import { LanguageSwitcher, PhoneInput, NavBar } from "@babelize/elements";
```

The components are client components, and the package declares `"use client"` for
you — importing them from a React Server Component works without any extra wrapper.
The `cn` helper is also available from `@babelize/elements/utils`, which carries no
directive and so can be called from server code.

### LanguageSwitcher

```tsx
<LanguageSwitcher
  locales={[{ code: "en" }, { code: "fr" }, { code: "ar" }]}
  defaultValue="en"
  showFlags
  onValueChange={(code) => router.push(`/${code}`)}
/>
```

| Prop            | Type                     | Default      | Description                                                                           |
| --------------- | ------------------------ | ------------ | ------------------------------------------------------------------------------------- |
| `locales`       | `Locale[]`               | —            | Available locales. Only `code` is required; labels, flags, and RTL are auto-detected. |
| `value`         | `string`                 | —            | Selected locale code. Pass this to control the component.                             |
| `defaultValue`  | `string`                 | first locale | Initial locale code when uncontrolled.                                                |
| `onValueChange` | `(code: string) => void` | —            | Fired once per selection.                                                             |
| `showFlags`     | `boolean`                | `false`      | Show flag emojis beside locale names.                                                 |
| `label`         | `"native" \| "english"`  | `"english"`  | Render locale names natively or in English.                                           |

### PhoneInput

```tsx
<PhoneInput
  defaultCountry="IN"
  name="phone"
  onValueChange={(phone, country) => console.log(country.dialCode + phone)}
/>
```

| Prop             | Type                                        | Default | Description                                       |
| ---------------- | ------------------------------------------- | ------- | ------------------------------------------------- |
| `value`          | `string`                                    | —       | Phone number. Pass this to control the component. |
| `defaultValue`   | `string`                                    | `""`    | Initial number when uncontrolled.                 |
| `onValueChange`  | `(phone: string, country: Country) => void` | —       | Fired on typing and on country change.            |
| `defaultCountry` | `string`                                    | `"US"`  | ISO 3166-1 alpha-2 code of the initial country.   |
| `showFlags`      | `boolean`                                   | `true`  | Show the flag emoji beside the dial code.         |

The ref points at the underlying `<input>`, and `name`, `required`, and other input
attributes pass straight through — so it works in a plain HTML form.

### NavBar

`NavBar` renders plain `<a>` elements by default. Pass `linkComponent` to get
client-side navigation from your router:

```tsx
import Link from "next/link";

<NavBar
  logo={<Logo />}
  links={[{ label: "Docs", href: "/docs" }]}
  locales={[{ code: "en" }, { code: "fr" }]}
  value={locale}
  onValueChange={setLocale}
  linkComponent={Link}
  cta={{ label: "Get started", href: "/docs" }}
/>;
```

Full props for every component are documented at
[elements.babelize.co](https://elements.babelize.co).

## Documentation

Full documentation, guides, and live component demos live at
[elements.babelize.co](https://elements.babelize.co), built with Next.js and
[Fumadocs](https://fumadocs.dev) from this same repo.

## Local development

```bash
bun install
bun run dev          # docs site at http://localhost:3000

bun run test         # component tests
bun run typecheck
bun run lint
bun run build:lib    # build the publishable library into dist/
bun run test:pack    # install the packed tarball into a scratch project
```

## Contributing a component

Components are contributed by the community. The typical flow:

1. Read [ARCHITECTURE.md](https://github.com/babelize/babelize-elements/blob/main/ARCHITECTURE.md) for the codebase layout and component conventions.
1. Pick an open [issue](https://github.com/babelize/babelize-elements/issues) — look for `good first issue` or `help wanted`.
1. Build the component in `src/registry/components/`.
1. Open a pull request following our [contributing guide](https://github.com/babelize/babelize-elements/blob/main/CONTRIBUTING.md).
1. Maintainers review it, and merged components ship to the docs for everyone.

Great component candidates:

- Language switchers (dropdowns, pills, searchable)
- Locale pickers (regions, currencies, date formats)
- Translation widgets and inline editors
- RTL-aware layout primitives
- Locale-aware date/time pickers
- Pluralization helpers and CLDR plural-rule UI
- Locale-aware currency inputs

## Community

- [Architecture](https://github.com/babelize/babelize-elements/blob/main/ARCHITECTURE.md)
- [Code of Conduct](https://github.com/babelize/babelize-elements/blob/main/CODE_OF_CONDUCT.md)
- [Security Policy](https://github.com/babelize/babelize-elements/blob/main/SECURITY.md)
- [Contributing](https://github.com/babelize/babelize-elements/blob/main/CONTRIBUTING.md)

## Contributors

<p align="center">
  Babelize Elements is built by an amazing community of designers,
  developers, and translators. A huge thank-you to everyone who contributes
  code, reviews, docs, or ideas.
</p>

<p align="center">
  <a href="https://github.com/babelize/babelize-elements/graphs/contributors">
    <img src="https://contrib.rocks/image?repo=babelize/babelize-elements" alt="All Babelize Elements contributors" />
  </a>
</p>

## Star History

<a href="https://www.star-history.com/?repos=babelize%2Fbabelize-elements&type=date&legend=top-right">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/chart?repos=babelize/babelize-elements&type=date&theme=dark&legend=top-left" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/chart?repos=babelize/babelize-elements&type=date&legend=top-left" />
   <img alt="Star History Chart" src="https://api.star-history.com/chart?repos=babelize/babelize-elements&type=date&legend=top-left" />
 </picture>
</a>

## License

[MIT](https://github.com/babelize/babelize-elements/blob/main/LICENSE) © [Babelize](https://babelize.co)
