const { PlaywrightHelper } = require('../seleniumUtils/PlaywrightHelper');

class InvoicePage {
  constructor(page) {
    this.page = page;
    this.helper = new PlaywrightHelper(page);
    this.invoiceRows = page.locator('[data-test="invoice-item"], .invoice-row, table tbody tr');
    this.invoiceDetail = page.locator('[data-test="invoice-detail"], .invoice-detail');
    this.paymentMethod = page.locator('[data-test="payment-method"], .payment-method');
    this.orderTotal = page.locator('[data-test="order-total"], .order-total');
    this.productLine = page.locator('[data-test="invoice-line-item"], .invoice-line-item');
  }

  async gotoInvoices() {
    await this.page.goto('/account/invoices');
  }

  async openLatestInvoice() {
    await this.helper.click(this.invoiceRows.first(), 'latest invoice');
  }

  async getPaymentMethod() {
    return this.paymentMethod.innerText();
  }

  async getOrderTotal() {
    return this.orderTotal.innerText();
  }

  async getInvoiceCount() {
    return this.invoiceRows.count();
  }
}

module.exports = { InvoicePage };
