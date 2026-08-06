const { PlaywrightHelper } = require('../seleniumUtils/PlaywrightHelper');

class CheckoutPage {
  constructor(page) {
    this.page = page;
    this.helper = new PlaywrightHelper(page);
    this.billingStreet = page.locator('#billing-street, input[name="billing_street"]');
    this.billingCity = page.locator('#billing-city, input[name="billing_city"]');
    this.billingState = page.locator('#billing-state, input[name="billing_state"]');
    this.billingCountry = page.locator('#billing-country, input[name="billing_country"]');
    this.billingPostalCode = page.locator('#billing-postal-code, input[name="billing_postal_code"]');
    this.codPayment = page.getByLabel(/cash on delivery/i);
    this.confirmButton = page.getByRole('button', { name: /confirm/i });
    this.invoiceReference = page.locator('[data-test="invoice-id"], .invoice-id, .order-reference');
  }

  async goto() {
    await this.page.goto('/checkout');
  }

  async fillBilling(billing) {
    if (await this.billingStreet.isVisible().catch(() => false)) {
      await this.helper.fill(this.billingStreet, billing.billingStreet, 'billing street');
      await this.helper.fill(this.billingCity, billing.billingCity, 'billing city');
      await this.helper.fill(this.billingState, billing.billingState, 'billing state');
      await this.helper.fill(this.billingCountry, billing.billingCountry, 'billing country');
      await this.helper.fill(this.billingPostalCode, billing.billingPostalCode, 'billing postal code');
    }
  }

  async selectCashOnDelivery() {
    await this.helper.click(this.codPayment, 'cash on delivery');
  }

  async confirmInvoiceTwice() {
    await this.helper.click(this.confirmButton, 'confirm (1st)');
    await this.helper.click(this.confirmButton, 'confirm (2nd)');
  }

  async getInvoiceReference() {
    return this.invoiceReference.innerText();
  }
}

module.exports = { CheckoutPage };
