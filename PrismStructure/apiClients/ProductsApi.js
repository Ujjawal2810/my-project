const { ApiHelper } = require('./ApiHelper');

class ProductsApi {
  constructor(request) {
    this.api = new ApiHelper(request);
  }

  async getProducts(params = {}) {
    const query = new URLSearchParams(params).toString();
    const path = query ? `/products?${query}` : '/products';
    return this.api.get(path);
  }

  async getProductById(productId, token) {
    return this.api.get(`/products/${productId}`, {
      headers: token ? this.api.authHeaders(token) : {},
    });
  }
}

module.exports = { ProductsApi };
