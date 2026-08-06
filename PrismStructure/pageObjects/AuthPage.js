const { PlaywrightHelper } = require('../seleniumUtils/PlaywrightHelper');

class AuthPage {
  constructor(page) {
    this.page = page;
    this.helper = new PlaywrightHelper(page);
    this.emailInput = page.locator('#email, input[type="email"]').first();
    this.passwordInput = page.locator('#password, input[type="password"]').first();
    this.loginButton = page.getByRole('button', { name: /login|sign in/i });
    this.registerLink = page.getByRole('link', { name: /register/i });
    this.registerButton = page.getByRole('button', { name: /register/i });
    this.firstNameInput = page.locator('#first_name, input[name="first_name"]');
    this.lastNameInput = page.locator('#last_name, input[name="last_name"]');
    this.phoneInput = page.locator('#phone, input[name="phone"]');
    this.profileFirstName = page.locator('[data-test="first-name"], .profile-first-name');
    this.profileLastName = page.locator('[data-test="last-name"], .profile-last-name');
    this.profileEmail = page.locator('[data-test="email"], .profile-email');
  }

  async gotoLogin() {
    await this.page.goto('/auth/login');
  }

  async gotoRegister() {
    await this.page.goto('/auth/register');
  }

  async login(email, password) {
    await this.gotoLogin();
    await this.helper.fill(this.emailInput, email, 'email');
    await this.helper.fill(this.passwordInput, password, 'password');
    await this.helper.click(this.loginButton, 'login');
  }

  async register(user) {
    await this.gotoRegister();
    await this.helper.fill(this.firstNameInput, user.firstName, 'first name');
    await this.helper.fill(this.lastNameInput, user.lastName, 'last name');
    // TODO: fill DOB, country, postal code, house number, phone, email, password per toolshop.json
    await this.helper.click(this.registerButton, 'register');
  }

  async gotoProfile() {
    await this.page.goto('/account');
  }

  async getProfileText() {
    return {
      firstName: await this.profileFirstName.innerText().catch(() => ''),
      lastName: await this.profileLastName.innerText().catch(() => ''),
      email: await this.profileEmail.innerText().catch(() => ''),
    };
  }
}

module.exports = { AuthPage };
