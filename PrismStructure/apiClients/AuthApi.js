const { ApiHelper } = require('./ApiHelper');

class AuthApi {
  constructor(request) {
    this.api = new ApiHelper(request);
  }

  async register(payload) {
    return this.api.post('/users/register', { data: payload });
  }

  async login(email, password) {
    return this.api.post('/users/login', {
      data: { email, password },
    });
  }

  async extractToken(response) {
    const body = await response.json();
    return body.access_token || body.token;
  }
}

module.exports = { AuthApi };
