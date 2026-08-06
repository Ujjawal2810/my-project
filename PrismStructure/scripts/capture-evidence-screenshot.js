const path = require('path');
const { chromium } = require('@playwright/test');

(async () => {
  const reportPath = path.join(__dirname, '..', 'reports', 'evidence', 'execution-report.html');
  const outPath = path.join(__dirname, '..', 'reports', 'evidence', 'test-run-summary.png');
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 960, height: 720 } });
  await page.goto(`file:///${reportPath.replace(/\\/g, '/')}`);
  await page.screenshot({ path: outPath, fullPage: true });
  await browser.close();
  console.log(`Wrote ${outPath}`);
})();
