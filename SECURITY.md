# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in Babelize Elements, please report it
responsibly. **Do not open a public issue.**

Instead, please report it via:

- **Discord:** [babelize.gg](https://discord.gg/babelize) — DM a maintainer
- **Email:** security@babelize.co

You should receive a response within 48 hours. We will work with you to
understand the issue and coordinate a fix before any public disclosure.

## Scope

Babelize Elements is a **UI component library**. It does not handle
authentication, payments, or sensitive data directly. Security concerns are
limited to:

- Client-side code quality issues (XSS via dangerouslySetInnerHTML, etc.)
- Supply-chain risks in dependencies
- Documentation site vulnerabilities

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| latest  | :white_check_mark: |
| < latest | :x:               |

We only provide security fixes for the latest version. Please upgrade before
reporting.
