const { PlaywrightHelper } = require('../seleniumUtils/PlaywrightHelper');

const { parsePrice, roundCurrency } = require('../utils/priceParser');



class CartPage {

  constructor(page) {

    this.page = page;

    this.helper = new PlaywrightHelper(page);

    this.navCartLink = page.locator('[data-test="nav-cart"]');

    this.lineItems = page.locator('tbody tr').filter({ has: page.getByRole('spinbutton') });

    this.quantityInputs = page.getByRole('spinbutton');

    this.cartTotalValue = page.locator('tr', { has: page.locator('strong', { hasText: 'Total' }) }).locator('td').nth(3);

    this.proceedToCheckoutButton = page.getByRole('button', { name: 'Proceed to checkout' });
    this.emptyCartMessage = page.getByText('The cart is empty. Nothing to display.');
  }



  async openFromNav() {

    await this.helper.click(this.navCartLink, 'nav cart');

    await this.waitForLoaded();

  }



  async goto() {

    await this.openFromNav();

  }



  async waitForLoaded() {

    await this.helper.waitForVisible(this.lineItems.first());

  }



  async getLineCount() {

    return this.lineItems.count();

  }



  async getLineUnitPrice(lineIndex) {

    const row = this.lineItems.nth(lineIndex);

    const priceCell = row.locator('td').nth(2);

    return parsePrice(await priceCell.innerText());

  }



  async getLineTotal(lineIndex) {

    const row = this.lineItems.nth(lineIndex);

    const totalCell = row.locator('td').nth(3);

    return parsePrice(await totalCell.innerText());

  }



  async updateLineQuantity(lineIndex, quantity) {

    const input = this.quantityInputs.nth(lineIndex);

    await this.helper.fill(input, String(quantity), `line ${lineIndex} quantity`);

    await input.press('Tab');

    await this.page.waitForLoadState('networkidle');

  }



  async getCartTotal() {

    return parsePrice(await this.cartTotalValue.innerText());

  }



  async calculateExpectedCartTotal() {

    const lineCount = await this.getLineCount();

    let sum = 0;

    for (let i = 0; i < lineCount; i += 1) {

      sum += await this.getLineTotal(i);

    }

    return roundCurrency(sum);

  }



  async proceedToCheckout() {

    await this.helper.click(this.proceedToCheckoutButton, 'proceed to checkout');

  }

  async removeLineItem(lineIndex = 0) {
    const removeLink = this.lineItems.nth(lineIndex).locator('a.btn-danger');
    await this.helper.click(removeLink, `remove line ${lineIndex}`);
    await this.page.waitForLoadState('networkidle');
  }

  async isProceedToCheckoutDisabled() {
    return this.proceedToCheckoutButton.isDisabled();
  }

  async isCheckoutUnavailable() {
    return this.proceedToCheckoutButton.isHidden();
  }

}



module.exports = { CartPage };

