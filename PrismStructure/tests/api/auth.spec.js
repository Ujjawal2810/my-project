const { test, expect } = require('@playwright/test');
const { AuthApi } = require('../../apiClients/AuthApi');
const { env } = require('../../utils/env');

test.describe('Auth API', () => {
  test('login returns access token @smoke', { tag: '@smoke' }, async ({ request }) => {
    const authApi = new AuthApi(request);
    const response = await authApi.login(env.testUserEmail, env.testUserPassword);
    expect(response.ok()).toBeTruthy();
    const token = await authApi.extractToken(response);
    expect(token).toBeTruthy();
  });
});
