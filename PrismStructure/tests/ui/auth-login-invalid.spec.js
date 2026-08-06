const { test, expect } = require('../../base/BaseTest');
const { env } = require('../../utils/env');

test.describe('Auth login validation', () => {
  test('rejects login with wrong password and shows exact error message @regression', { tag: '@regression' }, async ({
    page,
    loginPage,
    testData,
  }) => {
    const email = env.testUserEmail;
    const wrongPassword = testData.negative.invalidPassword;
    const expectedError = testData.messages.invalidLoginCredentials;

    await loginPage.goto();
    await loginPage.fillCredentials(email, wrongPassword);
    await loginPage.submitLogin();

    await expect(page, 'User should remain on login page after failed authentication').toHaveURL(
      /\/auth\/login$/
    );
    await expect(loginPage.errorMessage, 'Login error alert should be visible').toBeVisible();
    await expect(loginPage.errorMessage, 'Error text must match application message exactly').toHaveText(
      expectedError
    );
    await expect(loginPage.navSignIn, 'Sign-in link should remain visible after failed login').toBeVisible();
  });
});
