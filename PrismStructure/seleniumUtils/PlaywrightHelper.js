/**
 * Prism SeleniumHelper equivalent — low-level Playwright actions with logging.
 */
class PlaywrightHelper {
  constructor(page) {
    this.page = page;
  }

  async click(locator, description = 'element') {
    console.log(`[PlaywrightHelper] Click: ${description}`);
    await locator.click();
  }

  async fill(locator, value, description = 'field') {
    console.log(`[PlaywrightHelper] Fill: ${description}`);
    await locator.fill(value);
  }

  async getText(locator) {
    return locator.innerText();
  }

  async waitForVisible(locator, timeout = 30000) {
    await locator.waitFor({ state: 'visible', timeout });
  }
}

module.exports = { PlaywrightHelper };
