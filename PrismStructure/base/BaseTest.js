const { test: base, expect } = require('@playwright/test');
const { HomePage } = require('../pageObjects/HomePage');
const { AuthPage } = require('../pageObjects/AuthPage');
const { ProductPage } = require('../pageObjects/ProductPage');
const { CartPage } = require('../pageObjects/CartPage');
const { CheckoutPage } = require('../pageObjects/CheckoutPage');
const { InvoicePage } = require('../pageObjects/InvoicePage');
const { loadTestData } = require('../utils/DataProvider');

/**
 * Prism BaseLib equivalent — shared fixtures for all UI tests.
 */
const test = base.extend({
  testData: async ({}, use) => {
    await use(loadTestData());
  },
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  authPage: async ({ page }, use) => {
    await use(new AuthPage(page));
  },
  productPage: async ({ page }, use) => {
    await use(new ProductPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
  invoicePage: async ({ page }, use) => {
    await use(new InvoicePage(page));
  },
});

module.exports = { test, expect };
