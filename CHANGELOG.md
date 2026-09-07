# Changelog

All notable changes to Babelize Elements will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

From `1.1.0` onward, release notes live in
[GitHub Releases](https://github.com/babelize/babelize-elements/releases) — a release
is published by creating a tag there, and the notes are written at that point.
Everything below is retained history.

## [1.0.1] - [1.0.16] - 2026-08-15 to 2026-08-23

These sixteen releases were published automatically, one npm patch per push to
`main`, by a workflow that always bumped the patch digit regardless of what
changed. No entries were recorded at the time; this is a backfill from the
git history, and the version boundaries reflect where the auto-bump landed rather
than any deliberate release. `1.0.2` through `1.0.8` shipped no source changes at
all — they were retries while the publish workflow was being debugged.

Note that every one of these releases was **broken on npm**: the library build
emitted an unresolvable `@/lib/utils` import, so importing the package failed. See
`1.1.0` for the fix.

### Added

- `PhoneInput` and `NavBar` components, with docs pages (`1.0.14`)
- shadcn-compatible component registry (`/r/[name].json`, `/registry.json`) and a
  bundled CLI — `npx @babelize/elements add <component>` / `list` (`1.0.16`)
- Components catalog page under `/docs/components` (`1.0.12`)
- Contributors section in the README (`1.0.16`)

### Changed

- Components restyled with plain Tailwind classes instead of CSS-variable design
  tokens; the theme gallery, theme-switcher demos, and theming docs were removed
  (`1.0.13`, `1.0.14`)
- Installation instructions and component usage examples rewritten for the npm
  package (`1.0.1`, `1.0.11`, `1.0.16`)

### Fixed

- Broken links and leftover copy-paste references in the docs (`1.0.1`, `1.0.11`)
- Docs sidebar keys and the "Browse Components" destination (`1.0.12`)
- Lint failures breaking CI (`1.0.15`)
- Publish pipeline: npm auth token wiring, `[skip ci]` to stop an infinite publish
  loop, duplicate publish step, `workflow_dispatch` for manual runs (`1.0.1`,
  `1.0.9`, `1.0.10`)

## [1.0.0] - 2026-08-15

### Added

- Initial stable release of `@babelize/elements` npm package
- LanguageSwitcher component with dropdown, search, RTL support, and full accessibility
- TypeScript-first with exported interfaces for all props
- Works with next-intl, react-i18next, react-intl, and custom i18n setups
- Dark mode support built-in with Tailwind CSS
- 60+ supported languages with auto-detected labels and flags
- Documentation site at elements.babelize.co
- Installation guide with npm, pnpm, yarn, and bun instructions
- Theming guide with CSS variables and theme gallery
- Contributing guide for community contributors
- Auto-publish workflow for continuous releases

## [0.2.0] - 2026-08-15

### Minor Changes

- Add installation page and fix sidebar icons in getting-started docs

## [0.1.0] - 2026-08-04

### Added

- Initial repository setup
- Next.js 16.3.0 + Fumadocs 16
- Tailwind CSS v4
- MIT License
- Contributing guide and Code of Conduct
- Landing page with billingsdk.com-inspired design
- Fumadocs documentation site with getting-started and contributing guides
- Component showcase with live demos (Pill Switcher, Dropdown Picker, RTL Layout, Date Formatter, Translation Widget)
- FAQ section with accordion UI
- `llms.txt` and `llms-full.txt` for LLM-friendly documentation
- SEO/AEO/GEO content optimization across all sections
- OpenGraph and Twitter card metadata
- JSON-LD structured data support

### Fixed

- Favicon SVG convention for Next.js 16
- Hydration mismatch from `next-themes`
- ESLint errors across all landing page components
- TypeScript errors in CI (LayoutProps import, fumadocs virtual module resolution)
