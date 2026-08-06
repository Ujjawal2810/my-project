const { PlaywrightHelper } = require('../seleniumUtils/PlaywrightHelper');

class RegisterPage {
  constructor(page) {
    this.page = page;
    this.helper = new PlaywrightHelper(page);
    this.firstNameInput = page.getByTestId('first-name');
    this.lastNameInput = page.getByTestId('last-name');
    this.dobInput = page.getByTestId('dob');
    this.countrySelect = page.getByTestId('country');
    this.postalCodeInput = page.getByTestId('postal_code');
    this.houseNumberInput = page.getByTestId('house_number');
    this.streetInput = page.getByTestId('street');
    this.cityInput = page.getByTestId('city');
    this.stateInput = page.getByTestId('state');
    this.phoneInput = page.getByTestId('phone');
    this.emailInput = page.getByTestId('email');
    this.passwordInput = page.getByTestId('password');
    this.registerButton = page.getByTestId('register-submit');
  }

  async goto() {
    await this.page.goto('/auth/register');
    await this.helper.waitForVisible(this.firstNameInput);
  }

  async register(user) {
    await this.goto();
    await this.helper.fill(this.firstNameInput, user.firstName, 'first name');
    await this.helper.fill(this.lastNameInput, user.lastName, 'last name');
    await this.helper.fill(this.dobInput, user.dob, 'date of birth');
    await this.countrySelect.selectOption({ label: user.country });
    await this.helper.fill(this.postalCodeInput, user.postalCode, 'postal code');
    await this.helper.fill(this.houseNumberInput, user.houseNumber, 'house number');
    await this.streetInput.waitFor({ state: 'visible' });
    await this.helper.fill(this.phoneInput, user.phone, 'phone');
    await this.helper.fill(this.emailInput, user.email, 'email');
    await this.helper.fill(this.passwordInput, user.password, 'password');
    await this.helper.click(this.registerButton, 'register submit');
  }
}

module.exports = { RegisterPage };
