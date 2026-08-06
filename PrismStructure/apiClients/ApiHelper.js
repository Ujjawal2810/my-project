const { env } = require('../utils/env');

/**
 * Base API request wrapper — logging and shared headers.
 */
class ApiHelper {
  constructor(request) {
    this.request = request;
    this.baseURL = env.apiBaseUrl;
  }

  async get(path, options = {}) {
    console.log(`[ApiHelper] GET ${path}`);
    return this.request.get(`${this.baseURL}${path}`, options);
  }

  async post(path, options = {}) {
    console.log(`[ApiHelper] POST ${path}`);
    return this.request.post(`${this.baseURL}${path}`, options);
  }

  async put(path, options = {}) {
    console.log(`[ApiHelper] PUT ${path}`);
    return this.request.put(`${this.baseURL}${path}`, options);
  }

  async delete(path, options = {}) {
    console.log(`[ApiHelper] DELETE ${path}`);
    return this.request.delete(`${this.baseURL}${path}`, options);
  }

  authHeaders(token) {
    return {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
  }
}

module.exports = { ApiHelper };
