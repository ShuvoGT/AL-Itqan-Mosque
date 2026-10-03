// Starter script: log into WordPress and open a page in the Elementor editor.
//
// Configure via environment variables (do NOT hard-code credentials):
//   WP_BASE_URL   e.g. https://al-itqan-mosque.example.com
//   WP_USER       WordPress username or email
//   WP_PASSWORD   WordPress application/user password
//   WP_EDIT_POST  (optional) post/page ID to open directly in Elementor
//   HEADLESS      "false" to watch the browser (default: true)
//
// Run with:  WP_BASE_URL=... WP_USER=... WP_PASSWORD=... npm run edit

import { openPage } from '../src/browser.mjs';

const {
  WP_BASE_URL,
  WP_USER,
  WP_PASSWORD,
  WP_EDIT_POST,
  HEADLESS,
} = process.env;

if (!WP_BASE_URL || !WP_USER || !WP_PASSWORD) {
  console.error(
    'Missing config. Set WP_BASE_URL, WP_USER and WP_PASSWORD environment variables.',
  );
  process.exit(1);
}

const headless = HEADLESS !== 'false';
const baseUrl = WP_BASE_URL.replace(/\/$/, '');

const { browser, page } = await openPage({ headless });

try {
  // 1. Log into wp-admin.
  await page.goto(`${baseUrl}/wp-login.php`, { waitUntil: 'domcontentloaded' });
  await page.fill('#user_login', WP_USER);
  await page.fill('#user_pass', WP_PASSWORD);
  await page.click('#wp-submit');
  await page.waitForURL(/wp-admin/, { timeout: 30_000 });
  console.log('Logged into WordPress.');

  // 2. Open the Elementor editor.
  if (WP_EDIT_POST) {
    const editorUrl = `${baseUrl}/wp-admin/post.php?post=${WP_EDIT_POST}&action=elementor`;
    await page.goto(editorUrl, { waitUntil: 'domcontentloaded' });
    // Elementor renders inside #elementor-editor-wrapper / an iframe preview.
    await page.waitForSelector('#elementor-panel, #elementor-editor-wrapper', {
      timeout: 60_000,
    });
    console.log(`Elementor editor open for post ${WP_EDIT_POST}.`);
    // --- Add your Elementor edits here ---
    // Elementor's canvas lives in an iframe: page.frameLocator('#elementor-preview-iframe')
  } else {
    console.log(
      'No WP_EDIT_POST set. Set it to a page/post ID to open the Elementor editor directly.',
    );
  }

  if (!headless) {
    console.log('Running headful. Press Ctrl+C to close when done.');
    await page.waitForTimeout(10 * 60 * 1000);
  }
} finally {
  await browser.close();
}
