const { PlaywrightHelper } = require('../seleniumUtils/PlaywrightHelper');

class CartPage {
  constructor(page) {
    this.page = page;
    this.helper = new PlaywrightHelper(page);
    this.lineItems = page.locator('[data-test="cart-item"], .cart-item, table tbody tr');
    this.quantityInput = page.locator('[data-test="product-quantity"], input[type="number"]').first();
    this.lineTotal = page.locator('[data-test="line-total"], .line-total').first();
    this.cartTotal = page.locator('[data-test="cart-total"], .cart-total, .total').first();
    this.cartBadge = page.locator('[data-test="cart-quantity"], .cart-badge');
    this.proceedToCheckout = page.getByRole('link', { name: /checkout|proceed/i });
  }

  async goto() {
    await this.page.goto('/cart');
  }

  async updateQuantity(quantity) {
    await this.helper.fill(this.quantityInput, String(quantity), 'quantity');
    await this.quantityInput.press('Tab');
  }

  async getLineItemCount() {
    return this.lineItems.count();
  }

  async getCartTotal() {
    return this.cartTotal.innerText();
  }

  async proceedToCheckout() {
    await this.helper.click(this.proceedToCheckout, 'proceed to checkout');
  }
}

module.exports = { CartPage };
