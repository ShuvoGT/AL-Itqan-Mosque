// Shared Playwright browser launcher.
//
// This environment ships a pre-installed Chromium that may be an OLDER build
// than the one the installed `playwright` npm package expects. To avoid the
// "Executable doesn't exist / run npx playwright install" error, we point
// Playwright at the pre-installed browser via `executablePath` when it exists.
//
// On a normal machine (where PLAYWRIGHT_BROWSERS_PATH is not set to the managed
// location, or the matching build is present), it falls back to Playwright's
// own browser resolution.

import { existsSync } from 'node:fs';
import { chromium } from 'playwright';

// The symlink the managed cloud environment exposes to the pre-installed build.
const PREINSTALLED_CHROMIUM = '/opt/pw-browsers/chromium';

/**
 * Launch Chromium, preferring the pre-installed executable when available.
 *
 * @param {import('playwright').LaunchOptions} [options]
 * @returns {Promise<import('playwright').Browser>}
 */
export async function launchChromium(options = {}) {
  const launchOptions = { ...options };

  // Only override when the caller hasn't already set a path and the
  // pre-installed binary actually exists.
  if (!launchOptions.executablePath && existsSync(PREINSTALLED_CHROMIUM)) {
    launchOptions.executablePath = PREINSTALLED_CHROMIUM;
  }

  return chromium.launch(launchOptions);
}

/**
 * Convenience: launch a browser and open a fresh context + page.
 *
 * @param {import('playwright').LaunchOptions} [launchOptions]
 * @param {import('playwright').BrowserContextOptions} [contextOptions]
 */
export async function openPage(launchOptions = {}, contextOptions = {}) {
  const browser = await launchChromium(launchOptions);
  const context = await browser.newContext(contextOptions);
  const page = await context.newPage();
  return { browser, context, page };
}
