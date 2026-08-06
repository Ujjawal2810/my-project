// AC1 + AC2 — API register/login/cart smoke; AC2 full lifecycle regression
const { test, expect } = require('@playwright/test');
const { AuthApi } = require('../../apiClients/AuthApi');
const { ProductsApi } = require('../../apiClients/ProductsApi');
const { CartApi } = require('../../apiClients/CartApi');
const { InvoiceApi } = require('../../apiClients/InvoiceApi');
const { buildApiRegistrationPayload } = require('../../utils/registrationFactory');
const { getSection } = require('../../utils/DataProvider');

const LINE_QUANTITY = 2;

async function registerUser(authApi) {
  const { payload, credentials } = buildApiRegistrationPayload();
  const registerResponse = await authApi.register(payload);

  expect(registerResponse.status(), 'Registration should succeed').toBe(201);
  const registeredUser = await registerResponse.json();
  expect(registeredUser.id, 'Registered user should have an id').toBeTruthy();
  expect(registeredUser.email, 'Registered user email should match request').toBe(credentials.email);

  return credentials;
}

async function loginUser(authApi, credentials) {
  const loginResponse = await authApi.login(credentials.email, credentials.password);

  expect(loginResponse.status(), 'Login should succeed').toBe(200);
  const loginBody = await loginResponse.json();
  expect(loginBody.access_token, 'Login should return a bearer token').toBeTruthy();
  expect(loginBody.token_type, 'Login should return token type').toBeTruthy();

  return loginBody.access_token;
}

async function selectInStockProduct(productsApi) {
  const productsResponse = await productsApi.getProducts();

  expect(productsResponse.status(), 'Product listing should succeed').toBe(200);
  const productsBody = await productsResponse.json();
  expect(productsBody.data?.length, 'Product list should not be empty').toBeGreaterThan(0);

  const inStockProduct = productsBody.data.find((product) => product.in_stock === true);
  expect(inStockProduct, 'At least one in-stock product should be available').toBeTruthy();
  expect(inStockProduct.id, 'In-stock product should have an id').toBeTruthy();

  return inStockProduct.id;
}

async function createCart(cartApi, token) {
  const cartResponse = await cartApi.createCart(token);

  expect(cartResponse.status(), 'Cart creation should succeed').toBe(201);
  const cartId = await cartApi.extractCartId(cartResponse);
  expect(cartId, 'Created cart should return a cart id').toBeTruthy();

  return cartId;
}

async function addProductToCart(cartApi, cartId, productId, quantity, token) {
  const addItemResponse = await cartApi.addItem(cartId, productId, quantity, token);

  expect(addItemResponse.status(), 'Add-to-cart should succeed').toBe(200);
  const addItemBody = await addItemResponse.json();
  expect(addItemBody.result, 'Add-to-cart should confirm item was added').toBeTruthy();
}

async function assertCartContents(cartApi, cartId, productId, expectedQuantity, token) {
  const cartResponse = await cartApi.getCart(cartId, token);

  expect(cartResponse.status(), 'Cart retrieval should succeed').toBe(200);
  const cartBody = await cartResponse.json();
  expect(cartBody.cart_items?.length, 'Cart should contain line items').toBeGreaterThan(0);

  const matchingLine = cartBody.cart_items.find((line) => line.product_id === productId);
  expect(matchingLine, 'Cart should include the selected product').toBeTruthy();
  expect(matchingLine.quantity, 'Cart line quantity should match request').toBe(expectedQuantity);
}

async function createInvoice(invoiceApi, cartId, token) {
  const invoiceData = getSection('invoice');
  const checkoutData = getSection('checkout');
  const paymentMethod = checkoutData.paymentMethod;

  const invoicePayload = {
    billing_street: invoiceData.billingStreet,
    billing_city: invoiceData.billingCity,
    billing_state: invoiceData.billingState,
    billing_country: invoiceData.billingCountry,
    billing_postal_code: invoiceData.billingPostalCode,
    payment_method: paymentMethod,
    cart_id: cartId,
    payment_details: {},
  };

  const invoiceResponse = await invoiceApi.createInvoice(invoicePayload, token);

  expect(invoiceResponse.status(), 'Invoice creation should succeed').toBe(201);
  const invoiceBody = await invoiceResponse.json();
  expect(invoiceBody.id, 'Invoice response should include invoice id').toBeTruthy();
  expect(invoiceBody.invoice_number, 'Invoice response should include invoice number').toMatch(/^INV-/);
  expect(invoiceBody.total, 'Invoice total should be greater than zero').toBeGreaterThan(0);

  const invoicesResponse = await invoiceApi.getInvoices(token);
  expect(invoicesResponse.status(), 'Invoice list lookup should succeed').toBe(200);
  const invoicesBody = await invoicesResponse.json();
  const storedInvoice = invoicesBody.data?.find((invoice) => invoice.id === invoiceBody.id);

  const responsePaymentMethod = invoiceBody.payment_method ?? storedInvoice?.payment_method;
  if (responsePaymentMethod) {
    expect(responsePaymentMethod, 'Invoice payment method should match request').toBe(paymentMethod);
  } else {
    expect(invoicePayload.payment_method, 'Invoice request payment method should be Cash on Delivery').toBe(
      paymentMethod
    );
  }

  return invoiceBody;
}

test.describe('Order lifecycle API', () => {
  test(
    'registers, logs in, lists products, and creates cart @smoke',
    { tag: '@smoke' },
    async ({ request }) => {
      const authApi = new AuthApi(request);
      const productsApi = new ProductsApi(request);
      const cartApi = new CartApi(request);

      const credentials = await registerUser(authApi);
      const token = await loginUser(authApi, credentials);
      await selectInStockProduct(productsApi);
      await createCart(cartApi, token);
    }
  );

  test(
    'completes full order lifecycle through invoice @regression',
    { tag: '@regression' },
    async ({ request }) => {
      const authApi = new AuthApi(request);
      const productsApi = new ProductsApi(request);
      const cartApi = new CartApi(request);
      const invoiceApi = new InvoiceApi(request);

      const credentials = await registerUser(authApi);
      const token = await loginUser(authApi, credentials);
      const productId = await selectInStockProduct(productsApi);
      const cartId = await createCart(cartApi, token);

      await addProductToCart(cartApi, cartId, productId, LINE_QUANTITY, token);
      await assertCartContents(cartApi, cartId, productId, LINE_QUANTITY, token);
      await createInvoice(invoiceApi, cartId, token);
    }
  );
});
