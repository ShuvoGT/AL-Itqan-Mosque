# AL-Itqan Mosque — Browser Automation

Playwright-based browser automation for navigating the AL-Itqan Mosque WordPress
site and editing pages in the **Elementor** page builder.

## What's installed

- **[Playwright](https://playwright.dev/)** (`playwright` npm package) — drives a
  real Chromium browser to log in and interact with Elementor's visual editor.

> This project uses the plain `playwright` library (not `@playwright/test`)
> because the goal is interactive browser automation, not a test suite.

## Requirements

- Node.js 18+ (this project is ESM — `"type": "module"`).
- A Chromium browser. In the managed cloud environment, a pre-installed Chromium
  is used automatically via `src/browser.mjs`. On your own machine, run
  `npx playwright install chromium` once.

## Setup

```bash
npm install
```

## Usage

Credentials are read from environment variables — never commit them.

```bash
WP_BASE_URL="https://your-site.com" \
WP_USER="your-username" \
WP_PASSWORD="your-password" \
WP_EDIT_POST="123" \        # optional: page/post ID to open in Elementor
HEADLESS="false" \          # optional: watch the browser
npm run edit
```

## Project layout

| Path | Purpose |
| --- | --- |
| `src/browser.mjs` | Shared Chromium launcher. Auto-uses the pre-installed browser when present, falls back to Playwright's own resolution otherwise. |
| `scripts/elementor-edit.mjs` | Starter: logs into WordPress and opens a page in the Elementor editor. Add your edits inside. |

## Notes on the Chromium build

The managed environment ships a pre-installed Chromium that can be an older build
than the latest `playwright` package expects. `src/browser.mjs` handles this by
launching with `executablePath` pointing at the pre-installed binary
(`/opt/pw-browsers/chromium`) when it exists, so you don't hit the
"Executable doesn't exist — run npx playwright install" error.
