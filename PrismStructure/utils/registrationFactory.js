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

module.exports = { buildUniqueRegistrationUser };
