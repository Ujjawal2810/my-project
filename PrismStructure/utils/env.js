const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

/**
 * Central env access — never hardcode URLs or credentials in specs.
 */
const env = {
  baseUrl: process.env.BASE_URL || 'https://practicesoftwaretesting.com',
  apiBaseUrl: process.env.API_BASE_URL || 'https://api.practicesoftwaretesting.com',
  testUserEmail: process.env.TEST_USER_EMAIL || '',
  testUserPassword: process.env.TEST_USER_PASSWORD || '',
  testUser2Email: process.env.TEST_USER2_EMAIL || '',
  testUser2Password: process.env.TEST_USER2_PASSWORD || '',
  testUser3Email: process.env.TEST_USER3_EMAIL || '',
  testUser3Password: process.env.TEST_USER3_PASSWORD || '',
  registrationPassword: process.env.REGISTRATION_PASSWORD || '',
  invalidTestPassword: process.env.INVALID_TEST_PASSWORD || '',
};

module.exports = { env };
