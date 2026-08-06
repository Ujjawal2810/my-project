const { PlaywrightHelper } = require('../seleniumUtils/PlaywrightHelper');

class HomePage {
  constructor(page) {
    this.page = page;
    this.helper = new PlaywrightHelper(page);
    this.searchInput = page.getByRole('textbox', { name: 'Search' });
    this.searchButton = page.getByRole('button', { name: 'Search', exact: true });
    this.productLinks = page.locator('a[href*="/product/"]');
    this.cartLink = page.getByRole('link', { name: /cart/i });
  }

  async goto() {
    await this.page.goto('/');
    await this.searchInput.waitFor({ state: 'visible' });
  }

  async search(keyword) {
    await this.searchInput.click();
    await this.searchInput.fill(keyword);
    await this.helper.click(this.searchButton, 'search submit');
    await this.page.waitForLoadState('networkidle');
    await this.productLinks.first().waitFor({ state: 'visible', timeout: 15000 });
  }

  async searchAndOpenFirstInStock(keywords, excludePath = '') {
    const terms = Array.isArray(keywords) ? keywords : [keywords];
    let lastError;

    for (const term of terms) {
      await this.search(term);
      try {
        await this.openFirstInStockProduct(excludePath);
        return;
      } catch (error) {
        lastError = error;
      }
    }

    throw lastError || new Error(`No in-stock products found for keywords: ${terms.join(', ')}`);
  }

  async openFirstInStockProduct(excludePath = '') {
    const count = await this.productLinks.count();
    for (let index = 0; index < count; index += 1) {
      const link = this.productLinks.nth(index);
      const text = await link.innerText();
      if (/out of stock/i.test(text)) {
        continue;
      }

      const href = await link.getAttribute('href');
      if (excludePath && href && excludePath.endsWith(href)) {
        continue;
      }

      await this.helper.click(link, `in-stock product ${index}`);
      return;
    }

    throw new Error(`No matching in-stock products found for current search results (exclude path: ${excludePath || 'none'})`);
  }

  async getProductCount() {
    return this.productLinks.count();
  }

  async openCategoryFirstInStock(categoryName, excludePath = '') {
    await this.goto();
    await this.page.getByRole('button', { name: 'Categories' }).click();
    await this.page.getByRole('link', { name: categoryName }).click();
    await this.page.waitForLoadState('networkidle');
    await this.productLinks.first().waitFor({ state: 'visible', timeout: 15000 });
    await this.openFirstInStockProduct(excludePath);
  }

  async returnToCatalog() {
    await this.goto();
  }
}

module.exports = { HomePage };
