const { ApiHelper } = require('./ApiHelper');

class InvoiceApi {
  constructor(request) {
    this.api = new ApiHelper(request);
  }

  async createInvoice(payload, token) {
    return this.api.post('/invoices', {
      headers: this.api.authHeaders(token),
      data: payload,
    });
  }

  async getInvoices(token) {
    return this.api.get('/invoices', {
      headers: this.api.authHeaders(token),
    });
  }

  async getInvoiceById(invoiceId, token) {
    return this.api.get(`/invoices/${invoiceId}`, {
      headers: this.api.authHeaders(token),
    });
  }
}

module.exports = { InvoiceApi };
