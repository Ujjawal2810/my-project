const { PlaywrightHelper } = require('../seleniumUtils/PlaywrightHelper');

class ProductPage {
  constructor(page) {
    this.page = page;
    this.helper = new PlaywrightHelper(page);
    this.productName = page.locator('[data-test="product-name"], h1, .product-title').first();
    this.productPrice = page.locator('[data-test="product-price"], .product-price').first();
    this.addToCartButton = page.getByRole('button', { name: /add to cart/i });
    this.relatedProducts = page.locator('[data-test="related-product"], .related-products .card');
  }

  async addToCart() {
    await this.helper.click(this.addToCartButton, 'add to cart');
  }

  async getProductName() {
    return this.productName.innerText();
  }

  async getProductPrice() {
    return this.productPrice.innerText();
  }
}

module.exports = { ProductPage };
