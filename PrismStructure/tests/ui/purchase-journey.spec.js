const { test, expect } = require('../../base/BaseTest');
const { resolvePurchaseUser } = require('../../utils/credentialsResolver');
const { env } = require('../../utils/env');

test.describe('Purchase journey', () => {
  test.setTimeout(120000);

  test('completes end-to-end COD purchase and verifies invoice @smoke @regression', {
    tag: ['@smoke', '@regression'],
  }, async ({
    page,
    testData,
    loginPage,
    homePage,
    productPage,
    cartPage,
    checkoutPage,
    invoicePage,
  }) => {
    const purchaseUser = resolvePurchaseUser(testData, env);
    const flow = testData.purchaseFlow;
    const paymentLabel = testData.checkout.paymentMethodLabel;

    await loginPage.login(purchaseUser.email, purchaseUser.password);
    await expect(loginPage.navSignIn, 'User must be authenticated before shopping').toBeHidden();

    await homePage.goto();
    await homePage.searchAndOpenFirstInStock([
      flow.productSearchPrimary,
      ...(flow.productSearchFallbacks || []),
    ]);
    const firstProduct = await productPage.captureProductDetails();
    await productPage.addToCart();

    await homePage.returnToCatalog();
    await homePage.openCategoryFirstInStock(flow.secondaryCategory, firstProduct.path);
    const secondProduct = await productPage.captureProductDetails();
    await productPage.addToCart();

    await cartPage.goto();
    await expect.poll(() => cartPage.getLineCount(), 'Cart should contain two products').toBe(2);

    const firstLineUnitPrice = await cartPage.getLineUnitPrice(0);
    await cartPage.updateLineQuantity(0, flow.updatedLineQuantity);

    const expectedFirstLineTotal = firstLineUnitPrice * flow.updatedLineQuantity;
    await expect
      .poll(() => cartPage.getLineTotal(0), 'Line total should reflect updated quantity')
      .toBe(expectedFirstLineTotal);

    const expectedCartTotal = await cartPage.calculateExpectedCartTotal();
    await expect
      .poll(() => cartPage.getCartTotal(), 'Cart total should equal sum of line totals')
      .toBe(expectedCartTotal);

    await cartPage.proceedToCheckout();
    await checkoutPage.selectCashOnDelivery(testData);
    // Toolshop only generates an invoice after Confirm is clicked twice on the Payment step; a single click leaves the order unconfirmed.
    await checkoutPage.confirmInvoiceTwice();

    await invoicePage.gotoInvoices();
    await expect
      .poll(async () => {
        const count = await invoicePage.getInvoiceCount();
        if (count === 0) {
          await page.reload();
          await page.getByRole('heading', { name: 'Invoices' }).waitFor({ state: 'visible' });
        }
        return count;
      }, { timeout: 45000, message: 'At least one invoice should exist' })
      .toBeGreaterThan(0);
    await invoicePage.openLatestInvoice();

    const invoiceText = await invoicePage.getInvoiceDetailText();
    await expect(invoiceText, 'Invoice should list the first purchased product').toContain(firstProduct.name);
    await expect(invoiceText, 'Invoice should list the second purchased product').toContain(secondProduct.name);

    const paymentMethod = await invoicePage.getLatestInvoicePaymentMethod();
    expect(paymentMethod, 'Invoice should show Cash on Delivery payment method').toBe(paymentLabel);

    const invoiceTotal = await invoicePage.getLatestInvoiceTotal();
    expect(invoiceTotal, 'Invoice total should match cart total at checkout').toBe(expectedCartTotal);
  });
});
