# Contributing to Babelize Elements

Thanks for your interest in contributing! Babelize Elements is a community-built library — every component you see was contributed by someone like you.

## What to build

We need **Localization UI components**: language switchers, locale pickers, translation widgets, RTL-aware layouts, pluralization UI, locale-aware date/time and currency inputs, and anything else localized apps need.

Browse [open issues](https://github.com/babelize/babelize-elements/issues) — issues labeled `good first issue` and `help wanted` are great starting points. No matching issue? Open one to propose the component before building it. Use the [Component Request template](https://github.com/babelize/babelize-elements/issues/new?template=component_request.yml) to propose new components.

### Label guide

When opening or triaging issues, use these labels:

- **`component`** + a category label (`language-switcher`, `locale-picker`, `rtl-layout`, `translation-widget`, `date-time`, `currency`, `pluralization`, `accessibility`)
- **`needs-triage`** on new issues until classified
- **`needs-review`** on PRs awaiting maintainer review
- **`priority: high`** / **`priority: medium`** / **`priority: low`** for urgency
- **`status: blocked`** if external dependency or decision is needed

## Getting started

1. Fork the repository.
2. Clone your fork and install dependencies:
   ```bash
   git clone https://github.com/<your-username>/babelize-elements.git
   cd babelize-elements
   bun install
   ```
3. Create a branch for your work.
4. Build your component in `src/registry/components/`.

## Component checklist

Before opening a pull request, make sure your component:

- [ ] Is TypeScript-first, with exported interfaces for all props
- [ ] Is localization-aware — handles locale codes, pluralization, or RTL as applicable
- [ ] Is accessible — keyboard support, ARIA labels, focus states
- [ ] Uses Tailwind CSS with design tokens (dark-mode compatible)
- [ ] Includes a short demo or usage example for the docs
- [ ] Runs clean through `bun run lint` and `bun run build`

## Opening a pull request

Use the [PR template](https://github.com/babelize/babelize-elements/pulls/new) — it walks you through the component checklist and asks for a usage snippet. Branch protection requires **1 approving review** before merge.

- Keep changes focused on a single component.
- Reference the issue your PR closes (e.g. `Closes #42`).
- In the PR description, include a brief usage snippet and any notes on design decisions.
- Label your PR with `component` and the relevant category.

## Code of conduct

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you agree to uphold it.

## Security

If you discover a security issue, please report it privately via [email](mailto:security@babelize.co) or [Discord](https://discord.gg/babelize). See [SECURITY.md](SECURITY.md) for details.

## Questions?

Open a [discussion](https://github.com/babelize/babelize-elements/discussions) or join the [Babelize community Discord](https://discord.gg/4kMng8XVcm).
