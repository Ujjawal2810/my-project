const { PlaywrightHelper } = require('../seleniumUtils/PlaywrightHelper');

class LoginPage {
  constructor(page) {
    this.page = page;
    this.helper = new PlaywrightHelper(page);
    this.emailInput = page.getByTestId('email');
    this.passwordInput = page.getByTestId('password');
    this.loginButton = page.getByTestId('login-submit');
    this.errorMessage = page.getByTestId('login-error');
    this.navMenu = page.getByTestId('nav-menu');
    this.navSignIn = page.getByTestId('nav-sign-in');
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
  }

  async getErrorMessageText() {
    await this.errorMessage.waitFor({ state: 'visible' });
    return this.errorMessage.innerText();
  }
}

module.exports = { LoginPage };
