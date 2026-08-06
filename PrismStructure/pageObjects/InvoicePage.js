const { PlaywrightHelper } = require('../seleniumUtils/PlaywrightHelper');
const { parsePrice } = require('../utils/priceParser');

class InvoicePage {
  constructor(page) {
    this.page = page;
    this.helper = new PlaywrightHelper(page);
    this.invoiceRows = page.locator('table tbody tr, table tr').filter({ has: page.getByRole('cell') });
    this.invoiceDetailLinks = page.locator('a[href*="/account/invoices/"]');
  }

  async gotoInvoices() {
    await this.page.goto('/account/invoices');
    await this.page.getByRole('heading', { name: 'Invoices' }).waitFor({ state: 'visible' });
  }

  async getInvoiceCount() {
    const tableRows = await this.invoiceRows.count();
    if (tableRows > 0) {
      return tableRows;
    }
    return this.invoiceDetailLinks.count();
  }

  async openLatestInvoice() {
    if (await this.invoiceDetailLinks.count()) {
      await this.helper.click(this.invoiceDetailLinks.first(), 'latest invoice link');
    } else {
      await this.helper.click(this.invoiceRows.first(), 'latest invoice row');
    }
    await this.page.waitForLoadState('networkidle');
  }

  async getInvoiceDetailText() {
    return this.page.locator('body').innerText();
  }

  async getLatestInvoicePaymentMethod() {
    const paymentField = this.page.getByRole('textbox', { name: 'Payment Method' });
    if (await paymentField.count()) {
      return paymentField.inputValue();
    }

    const text = await this.getInvoiceDetailText();
    const match = text.match(/Payment method:\s*(.+)/i);
    return match ? match[1].trim() : '';
  }

  async getLatestInvoiceTotal() {
    const totalField = this.page.getByRole('textbox', { name: 'Total' });
    if (await totalField.count()) {
      return parsePrice(await totalField.inputValue());
    }

    const text = await this.getInvoiceDetailText();
    const match = text.match(/Total:\s*([^\n]+)/i);
    return parsePrice(match ? match[1] : '');
  }
}

module.exports = { InvoicePage };
