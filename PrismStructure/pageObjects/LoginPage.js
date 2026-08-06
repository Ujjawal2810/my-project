const { PlaywrightHelper } = require('../seleniumUtils/PlaywrightHelper');

class LoginPage {
  constructor(page) {
    this.page = page;
    this.helper = new PlaywrightHelper(page);
    this.emailInput = page.getByRole('textbox', { name: 'Email address *' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password *' });
    this.loginButton = page.getByRole('button', { name: 'Login', exact: true });
    this.errorMessage = page.locator('.alert.alert-danger, .invalid-feedback.d-block, [role="alert"]').first();
    this.navMenu = page.getByRole('menubar', { name: 'Main menu' });
    this.navSignIn = page.getByRole('link', { name: 'Sign in' });
  }

  async goto() {
    await this.page.goto('/auth/login');
    await this.helper.waitForVisible(this.emailInput);
  }

  async fillCredentials(email, password) {
    await this.helper.fill(this.emailInput, email, 'email');
    await this.helper.fill(this.passwordInput, password, 'password');
  }

  async submitLogin() {
    await this.helper.click(this.loginButton, 'login submit');
  }

  async login(email, password) {
    await this.goto();
    await this.fillCredentials(email, password);
    await this.submitLogin();
    await this.navSignIn.waitFor({ state: 'hidden', timeout: 15000 });
  }
}

module.exports = { LoginPage };
