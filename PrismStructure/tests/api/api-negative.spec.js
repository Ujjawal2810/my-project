// AC1 + AC2 — negative API paths (invalid login, auth middleware, invoice validation)
const { test, expect } = require('@playwright/test');
const { AuthApi } = require('../../apiClients/AuthApi');
const { CartApi } = require('../../apiClients/CartApi');
const { InvoiceApi } = require('../../apiClients/InvoiceApi');
const { buildApiRegistrationPayload } = require('../../utils/registrationFactory');
const { getSection } = require('../../utils/DataProvider');
const { env } = require('../../utils/env');

function firstErrorMessage(body) {
  if (typeof body.message === 'string' && body.message.trim()) {
    return body.message;
  }

  if (typeof body.error === 'string' && body.error.trim()) {
    return body.error;
  }

  for (const value of Object.values(body)) {
    if (Array.isArray(value) && typeof value[0] === 'string') {
      return value[0];
    }
  }

  if (body.errors && typeof body.errors === 'object') {
    for (const value of Object.values(body.errors)) {
      if (Array.isArray(value) && typeof value[0] === 'string') {
        return value[0];
      }
    }
  }

  return '';
}

test.describe('API negative scenarios', () => {
  test(
    'rejects login with a valid email and wrong password @regression',
    { tag: '@regression' },
    async ({ request }) => {
      const authApi = new AuthApi(request);
      const negativeData = getSection('negative');

      const response = await authApi.login(env.testUserEmail, negativeData.invalidPassword);

      expect(response.status(), 'Invalid credentials should be rejected with 401').toBe(401);
      const body = await response.json();
      const errorMessage = firstErrorMessage(body);
      expect(errorMessage, 'Error response should explain the auth failure').toMatch(/unauthorized/i);
    }
  );

  test(
    'rejects invoice requests with a malformed bearer token @regression',
    { tag: '@regression' },
    async ({ request }) => {
      const invoiceApi = new InvoiceApi(request);
      const malformedToken = 'not-a-valid-jwt-token';

      const response = await invoiceApi.getInvoices(malformedToken);

      expect(response.status(), 'Malformed bearer token should be rejected with 401').toBe(401);
      const body = await response.json();
      const errorMessage = firstErrorMessage(body);
      expect(errorMessage, 'Error response should explain the auth failure').toMatch(/unauthorized/i);
    }
  );

  test(
    'rejects invoice creation when a required billing field is missing @regression',
    { tag: '@regression' },
    async ({ request }) => {
      const authApi = new AuthApi(request);
      const cartApi = new CartApi(request);
      const invoiceApi = new InvoiceApi(request);
      const checkoutData = getSection('checkout');
      const invoiceData = getSection('invoice');

      const { payload, credentials } = buildApiRegistrationPayload();
      const registerResponse = await authApi.register(payload);
      expect(registerResponse.status(), 'Setup registration should succeed').toBe(201);

      const loginResponse = await authApi.login(credentials.email, credentials.password);
      expect(loginResponse.status(), 'Setup login should succeed').toBe(200);
      const token = await authApi.extractToken(loginResponse);

      const cartResponse = await cartApi.createCart(token);
      expect(cartResponse.status(), 'Setup cart creation should succeed').toBe(201);
      const cartId = await cartApi.extractCartId(cartResponse);

      const response = await invoiceApi.createInvoice(
        {
          billing_city: invoiceData.billingCity,
          billing_state: invoiceData.billingState,
          billing_country: invoiceData.billingCountry,
          billing_postal_code: invoiceData.billingPostalCode,
          payment_method: checkoutData.paymentMethod,
          cart_id: cartId,
          payment_details: {},
        },
        token
      );

      expect(response.status(), 'Missing billing_street should be rejected with 422').toBe(422);
      const body = await response.json();
      expect(body.billing_street, 'Validation response should flag billing_street').toEqual(
        expect.arrayContaining([expect.stringMatching(/billing street.*required/i)])
      );
      const errorMessage = firstErrorMessage(body);
      expect(errorMessage, 'Error response should describe the validation failure').toMatch(/billing street/i);
    }
  );
});
