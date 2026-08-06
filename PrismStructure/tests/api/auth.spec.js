// AC1 — API authentication smoke (maps to TC-M02 login flow via API)
const { test, expect } = require('@playwright/test');
const { AuthApi } = require('../../apiClients/AuthApi');
const { env } = require('../../utils/env');

test.describe('Auth API', () => {
  test('login returns access token @smoke', { tag: '@smoke' }, async ({ request }) => {
    const authApi = new AuthApi(request);
    const response = await authApi.login(env.testUserEmail, env.testUserPassword);
    expect(response.status(), 'Login should return HTTP 200').toBe(200);

    const body = await response.json();
    expect(body.access_token, 'Response should include a bearer token').toBeTruthy();
    expect(String(body.token_type).toLowerCase(), 'Response should identify bearer token type').toBe('bearer');

    const token = await authApi.extractToken(response);
    expect(token, 'Extracted token should be non-empty').toBeTruthy();
  });
});
