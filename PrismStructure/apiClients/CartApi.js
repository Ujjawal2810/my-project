const { ApiHelper } = require('./ApiHelper');

class CartApi {
  constructor(request) {
    this.api = new ApiHelper(request);
  }

  async createCart(token) {
    return this.api.post('/carts', {
      headers: this.api.authHeaders(token),
      data: {},
    });
  }

  async getCart(cartId, token) {
    return this.api.get(`/carts/${cartId}`, {
      headers: this.api.authHeaders(token),
    });
  }

  async addItem(cartId, productId, quantity, token) {
    return this.api.post(`/carts/${cartId}/items`, {
      headers: this.api.authHeaders(token),
      data: { product_id: productId, quantity },
    });
  }

  async extractCartId(response) {
    const body = await response.json();
    return body.id || body.cart_id;
  }
}

module.exports = { CartApi };
