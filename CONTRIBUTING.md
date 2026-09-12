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

Read [ARCHITECTURE.md](ARCHITECTURE.md) first — it explains how the library, the
registry, and the docs site relate, the conventions every component follows, and
the six files a new component touches. The
[docs code blocks](ARCHITECTURE.md#how-docs-code-blocks-work) section covers how a
demo file becomes the Code tab on a docs page.

## Component checklist

Before opening a pull request, make sure your component:

- [ ] Is TypeScript-first, with exported interfaces for all props
- [ ] Is localization-aware — handles locale codes, pluralization, or RTL as applicable
- [ ] Is accessible — keyboard support, ARIA labels, focus states
- [ ] Uses Tailwind CSS (dark-mode compatible)
- [ ] Supports controlled and uncontrolled use (`value` / `defaultValue` / `onValueChange`)
- [ ] Forwards a ref and spreads unknown props onto its root element
- [ ] Has tests in `test/` covering render, interaction, and controlled mode
- [ ] Has a demo at `src/components/docs/<name>-demo.tsx` — the docs Code tab renders
      this file verbatim, so write it as the snippet you'd want someone to copy:
      just the component and its props, no wrapper card or theme toggle (the preview
      shell provides those)
- [ ] Has an MDX page embedding `<PreviewComponents registryName="<name>">`
- [ ] Runs clean through `bun run lint`, `bun run typecheck`, `bun run test`, and `bun run build`

## Opening a pull request

Use the [PR template](https://github.com/babelize/babelize-elements/compare) — it walks you through the component checklist and asks for a usage snippet. Branch protection requires **1 approving review** before merge.

- Keep changes focused on a single component.
- Reference the issue your PR closes (e.g. `Closes #42`).
- In the PR description, include a brief usage snippet and any notes on design decisions.
- Label your PR with `component` and the relevant category.

## Releasing (maintainers)

**Merging to `main` publishes nothing.** A release is a deliberate act, and it takes
one step.

1. Go to **Releases → Draft a new release**.
2. Tag: `vX.Y.Z` — the `v` prefix is expected, and the tag _is_ the version that gets
   published. A tag that isn't semver fails the job rather than publishing.
3. Click **Auto-generate release notes** to list the merged PRs, then edit. If the
   release changes or removes a prop, say so at the top — that's what people read.
4. **Publish release.**

Publishing the release triggers `.github/workflows/release.yml`, which re-runs the
full check set against that commit and then publishes to npm with provenance. Watch
it in the Actions tab; if it fails, nothing is published and you can fix and re-run
without cutting a new tag:

```bash
gh workflow run release.yml -f tag=vX.Y.Z
```

Note npm takes about five minutes to show a new version after the job succeeds —
`npm view @babelize/elements version` lagging is normal, not a failure.

### Picking the number

Breaking a prop, removing an export, or changing runtime behaviour someone could be
relying on is a **major**. New component or new prop is a **minor**. Fixes are
**patches**. Keep deprecated prop aliases for at least one minor release before
removing them.

### Don't

- Hand-edit `version` in `package.json` outside a release, or `CHANGELOG.md` above the
  `1.0.16` line — everything from `1.1.0` on lives in GitHub Releases.
- Run `npm publish` locally. It skips every check and drops the provenance
  attestation.
- Override a failing `test:pack`. That check installs the packed tarball into a clean
  project and imports it; if it fails, the package is broken for everyone installing
  it. It exists because a broken build shipped to npm sixteen times without anyone
  noticing.

## Code of conduct

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you agree to uphold it.

## Security

If you discover a security issue, please report it privately via [email](mailto:security@babelize.co) or [Discord](https://discord.gg/4kMng8XVcm). See [SECURITY.md](SECURITY.md) for details.

## Questions?

Open a [discussion](https://github.com/babelize/babelize-elements/discussions) or join the [Babelize community Discord](https://discord.gg/4kMng8XVcm).
