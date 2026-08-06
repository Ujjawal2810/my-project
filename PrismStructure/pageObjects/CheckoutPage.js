const { PlaywrightHelper } = require('../seleniumUtils/PlaywrightHelper');

class CheckoutPage {
  constructor(page) {
    this.page = page;
    this.helper = new PlaywrightHelper(page);
    this.paymentMethodSelect = page.getByRole('combobox', { name: 'Payment Method' });
    this.confirmButton = page.getByRole('button', { name: /^confirm$/i, disabled: false });
    this.proceedButton = page.getByRole('button', { name: /proceed to checkout/i, disabled: false });
    this.billingHeading = page.getByRole('heading', { name: 'Billing Address' });
    this.paymentHeading = page.getByRole('heading', { name: 'Payment' });
    this.orderCompleteMessage = page.getByText(/thanks for your order|invoice number is/i);
  }

  async completeBillingAddressIfNeeded(testData) {
    if (!(await this.billingHeading.isVisible().catch(() => false))) {
      return;
    }

    const billing = testData.checkout;
    await this.page.getByRole('combobox', { name: 'Country' }).selectOption({ label: billing.billingCountry });
    await this.helper.fill(this.page.getByRole('textbox', { name: 'Postal code' }), billing.billingPostalCode, 'billing postal code');
    await this.helper.fill(this.page.getByRole('textbox', { name: 'House number' }), billing.billingHouseNumber, 'billing house number');
    await this.page.getByRole('textbox', { name: 'Street' }).waitFor({ state: 'visible' });
    await this.page.waitForFunction(
      () => document.querySelector('input[placeholder="Your Street *"]')?.value?.length > 0,
      null,
      { timeout: 15000 },
    );

    const stateField = this.page.getByRole('textbox', { name: 'State' });
    if (!(await stateField.inputValue())) {
      await this.helper.fill(stateField, billing.billingState, 'billing state');
    }
  }

  async selectCashOnDelivery(testData) {
    await this.advanceToPaymentStep(testData);
    await this.helper.waitForVisible(this.paymentMethodSelect);
    await this.paymentMethodSelect.selectOption({ label: testData.checkout.paymentMethodLabel });
    await this.confirmButton.waitFor({ state: 'visible' });
  }

  async advanceToPaymentStep(testData) {
    for (let step = 0; step < 4; step += 1) {
      if (await this.paymentHeading.isVisible().catch(() => false)) {
        return;
      }

      await this.completeBillingAddressIfNeeded(testData);

      if (await this.proceedButton.isVisible().catch(() => false)) {
        await this.helper.click(this.proceedButton, `advance checkout step ${step + 1}`);
        continue;
      }

      break;
    }

    await this.helper.waitForVisible(this.paymentHeading);
  }

  /**
   * Toolshop requires two Confirm clicks on the Payment step before an invoice is generated.
   * The first click processes COD payment; the second click finalizes the order and shows the invoice ID.
   * A single click leaves the order unconfirmed with no invoice.
   */
  async confirmInvoiceTwice() {
    const confirmButton = () => this.page.getByRole('button', { name: /^confirm$/i, disabled: false });

    await this.helper.click(confirmButton(), 'confirm (1st)');
    await this.page.getByText(/payment was successful/i).waitFor({ state: 'visible', timeout: 15000 });

    await confirmButton().waitFor({ state: 'visible' });
    await this.helper.click(confirmButton(), 'confirm (2nd)');
    await this.orderCompleteMessage.waitFor({ state: 'visible', timeout: 15000 });
  }

  async getOrderConfirmationText() {
    return this.page.locator('body').innerText();
  }

  async completeCashOnDeliveryCheckout(testData) {
    await this.selectCashOnDelivery(testData);
    await this.confirmInvoiceTwice();
  }
}

module.exports = { CheckoutPage };
