// AC2 — product search smoke/regression (maps to TC-M05 search portion)
const { test, expect } = require('../../base/BaseTest');

test.describe('Home Page', () => {
  test('loads Toolshop home page @smoke', { tag: '@smoke' }, async ({ page, homePage }) => {
    await homePage.goto();
    await expect(page).toHaveTitle(/Practice Software Testing/i);
    await expect(homePage.searchInput, 'Search should be available on the catalog home page').toBeVisible();
    await expect
      .poll(() => homePage.getProductCount(), 'Product catalog should list at least one item')
      .toBeGreaterThan(0);
  });

  test('search returns results for valid keyword @regression', { tag: '@regression' }, async ({ homePage, testData }) => {
    await homePage.goto();
    await homePage.search(testData.search.validKeyword);
    await expect.poll(() => homePage.getProductCount()).toBeGreaterThan(0);
  });
});
