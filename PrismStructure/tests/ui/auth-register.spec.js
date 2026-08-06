const { test, expect } = require('../../base/BaseTest');
const { buildUniqueRegistrationUser } = require('../../utils/registrationFactory');

test.describe('Auth registration and login', () => {
  test('registers a new user, logs in, and shows account name in nav @smoke', { tag: '@smoke' }, async ({
    page,
    registerPage,
    loginPage,
  }) => {
    const user = buildUniqueRegistrationUser();
    const expectedAccountName = `${user.firstName} ${user.lastName}`;

    await registerPage.register(user);

    await expect(page, 'User should be redirected to login after successful registration').toHaveURL(
      /\/auth\/login$/,
      { timeout: 15000 }
    );

    await loginPage.login(user.email, user.password);

    await expect(page, 'Authenticated user should leave the login page').not.toHaveURL(/\/auth\/login$/);
    await expect(loginPage.navSignIn, 'Sign-in link should be hidden after login').not.toBeVisible();
    await expect(loginPage.navMenu, 'Nav menu should show the registered user full name').toBeVisible();
    await expect(loginPage.navMenu).toContainText(expectedAccountName);
  });
});
