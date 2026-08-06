const { PlaywrightHelper } = require('../seleniumUtils/PlaywrightHelper');

class HomePage {
  constructor(page) {
    this.page = page;
    this.helper = new PlaywrightHelper(page);
    this.searchInput = page.getByPlaceholder('Search');
    this.productCards = page.locator('[data-test="product-name"], .card-title, .product-name');
    this.cartLink = page.getByRole('link', { name: /cart/i });
  }

  async goto() {
    await this.page.goto('/');
  }

  async search(keyword) {
    await this.helper.fill(this.searchInput, keyword, 'search');
    await this.searchInput.press('Enter');
  }

  async openFirstProduct() {
    await this.helper.click(this.productCards.first(), 'first product');
  }

  async getProductCount() {
    return this.productCards.count();
  }
}

module.exports = { HomePage };
