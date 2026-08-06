// AC2 — cart remove and empty-cart guard (maps to TC-M06 cart mutation risk)
// uncovered cart mutation — it must sync rows, totals, and the nav badge via DELETE /carts.
const { test, expect } = require('../../base/BaseTest');
const { env } = require('../../utils/env');

test.describe('Cart management', () => {
  test('removes a line item and blocks checkout on an empty cart @regression', { tag: '@regression' }, async ({
    loginPage,
    homePage,
    productPage,
    cartPage,
    testData,
  }) => {
    await loginPage.login(env.testUserEmail, env.testUserPassword);

    await homePage.goto();
    await homePage.searchAndOpenFirstInStock([testData.search.validKeyword, 'hammer', 'pliers']);
    await productPage.addToCart();

    await cartPage.goto();
    await expect.poll(() => cartPage.getLineCount(), 'Cart should contain one line before removal').toBe(1);

    await cartPage.removeLineItem(0);

    await expect.poll(() => cartPage.getLineCount(), 'Cart should be empty after removing the only line').toBe(0);
    await expect(cartPage.emptyCartMessage, 'Empty cart message should be shown').toHaveText(
      testData.messages.emptyCartMessage,
    );
    await expect(cartPage.proceedToCheckoutButton, 'Checkout must not be available when the cart is empty').toBeHidden();
  });
});
