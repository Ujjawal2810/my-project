const { test, expect } = require('../../base/BaseTest');
const { env } = require('../../utils/env');

test.describe('Home Page', () => {
  test('loads Toolshop home page @smoke', { tag: '@smoke' }, async ({ page, homePage }) => {
    await homePage.goto();
    await expect(page).toHaveTitle(/Practice Software Testing/i);
  });

  test('search returns results for valid keyword @regression', { tag: '@regression' }, async ({ homePage, testData }) => {
    await homePage.goto();
    await homePage.search(testData.search.validKeyword);
    await expect.poll(() => homePage.getProductCount()).toBeGreaterThan(0);
  });
});
