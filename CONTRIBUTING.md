# Contributing to Babelize Elements

Thanks for your interest in contributing! Babelize Elements is a community-built library — every component you see was contributed by someone like you.

## What to build

We need **Localization UI components**: language switchers, locale pickers, translation widgets, RTL-aware layouts, pluralization UI, locale-aware date/time and currency inputs, and anything else localized apps need.

Browse [open issues](https://github.com/babelize/babelize-elements/issues) — issues labeled `good first issue` and `help wanted` are great starting points. No matching issue? Open one to propose the component before building it.

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

- Keep changes focused on a single component.
- Reference the issue your PR closes (e.g. `Closes #42`).
- In the PR description, include a brief usage snippet and any notes on design decisions.

## Code of conduct

Be respectful and constructive. Harassment or exclusionary behavior is not tolerated. Focus on the work and help each other.

## Questions?

Open a [discussion](https://github.com/babelize/babelize-elements/discussions) or join the [Babelize community Discord](https://discord.gg/4kMng8XVcm).
