// Added because existing search coverage only asserts positive hits; a broken empty-state
// or uncleared product grid would show stale results and mislead shoppers (TC-M04 / P2 search risk).
const { test, expect } = require('../../base/BaseTest');

test.describe('Product search', () => {
  test('shows empty state when keyword matches no products @regression', { tag: '@regression' }, async ({
    homePage,
    testData,
  }) => {
    const keyword = testData.search.invalidKeyword;

    await homePage.goto();
    await homePage.searchForKeyword(keyword);
    await homePage.waitForNoSearchResults();

    await expect(homePage.noResultsSummary, 'Summary should report zero matches for the keyword').toContainText(
      keyword,
    );
    await expect(homePage.noResultsMessage, 'Empty-state message should be shown').toHaveText(
      testData.messages.noProductsFound,
    );
    await expect.poll(() => homePage.getVisibleProductLinkCount(), 'Product grid should contain no items').toBe(0);
  });
});
