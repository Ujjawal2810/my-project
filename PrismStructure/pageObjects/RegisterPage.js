const { PlaywrightHelper } = require('../seleniumUtils/PlaywrightHelper');

class RegisterPage {
  constructor(page) {
    this.page = page;
    this.helper = new PlaywrightHelper(page);
    this.firstNameInput = page.getByRole('textbox', { name: 'First name' });
    this.lastNameInput = page.getByRole('textbox', { name: 'Last name' });
    this.dobInput = page.getByRole('textbox', { name: 'Date of Birth *' });
    this.countrySelect = page.getByRole('combobox', { name: 'Country' });
    this.postalCodeInput = page.getByRole('textbox', { name: 'Postal code' });
    this.houseNumberInput = page.getByRole('textbox', { name: 'House number' });
    this.streetInput = page.getByRole('textbox', { name: 'Street' });
    this.cityInput = page.getByRole('textbox', { name: 'City' });
    this.stateInput = page.getByRole('textbox', { name: 'State' });
    this.phoneInput = page.getByRole('textbox', { name: 'Phone' });
    this.emailInput = page.getByRole('textbox', { name: 'Email address' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.registerButton = page.getByRole('button', { name: 'Register', exact: true });
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
    await this.streetInput.waitFor({ state: 'attached' });
    await this.page.waitForFunction(
      () => document.querySelector('input[placeholder="Your Street *"]')?.value?.length > 0,
      null,
      { timeout: 15000 }
    );
    await this.helper.fill(this.phoneInput, user.phone, 'phone');
    await this.helper.fill(this.emailInput, user.email, 'email');
    await this.helper.fill(this.passwordInput, user.password, 'password');
    await this.passwordInput.press('Tab');
    await this.helper.click(this.registerButton, 'register submit');
  }
}

module.exports = { RegisterPage };
