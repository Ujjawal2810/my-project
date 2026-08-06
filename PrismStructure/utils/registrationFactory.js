const { randomUUID } = require('crypto');
const { getSection } = require('./DataProvider');

/**
 * Builds a registration user with a unique email from test-data/toolshop.json.
 */
function buildUniqueRegistrationUser() {
  const registration = getSection('registration');
  const uniqueSuffix = randomUUID().replace(/-/g, '').slice(0, 12);

  return {
    firstName: registration.firstName,
    lastName: registration.lastName,
    dob: registration.dob,
    country: registration.country,
    postalCode: registration.postalCode,
    houseNumber: registration.houseNumber,
    phone: registration.phone,
    password: registration.password,
    email: `${registration.emailPrefix}.${uniqueSuffix}@${registration.emailDomain}`,
  };
}

/**
 * API registration payload (snake_case) plus credentials for login.
 */
function buildApiRegistrationPayload() {
  const user = buildUniqueRegistrationUser();

  return {
    credentials: {
      email: user.email,
      password: user.password,
    },
    payload: {
      first_name: user.firstName,
      last_name: user.lastName,
      email: user.email,
      password: user.password,
      dob: user.dob,
      phone: user.phone,
    },
  };
}

module.exports = { buildUniqueRegistrationUser, buildApiRegistrationPayload };
