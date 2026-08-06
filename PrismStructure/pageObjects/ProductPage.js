const { PlaywrightHelper } = require('../seleniumUtils/PlaywrightHelper');
const { parsePrice } = require('../utils/priceParser');

class ProductPage {
  constructor(page) {
    this.page = page;
    this.helper = new PlaywrightHelper(page);
    this.productName = page.getByRole('heading', { level: 1 });
    this.productPrice = page.locator('[data-test="product-price"]');
    this.addToCartButton = page.locator('[data-test="add-to-cart"]');
    this.addedToCartAlert = page.getByRole('alert').filter({ hasText: /added to shopping cart/i });
  }

  async waitForLoaded() {
    await this.helper.waitForVisible(this.productName);
  }

  async getDisplayedPriceText() {
    if (await this.productPrice.count()) {
      return this.productPrice.innerText();
    }

    return this.page
      .locator('h1')
      .locator('xpath=following-sibling::*')
      .filter({ hasText: /^\$\d+\.\d{2}$/ })
      .first()
      .innerText();
  }

  async addToCart() {
    await this.waitForLoaded();
    await this.helper.click(this.addToCartButton, 'add to cart');
    await this.helper.waitForVisible(this.addedToCartAlert);
  }

  async captureProductDetails() {
    await this.waitForLoaded();
    const name = (await this.productName.innerText()).trim();
    const price = parsePrice(await this.getDisplayedPriceText());
    const path = new URL(this.page.url()).pathname;
    return { name, price, path };
  }
}

module.exports = { ProductPage };
