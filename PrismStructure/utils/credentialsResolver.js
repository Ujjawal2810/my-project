/**
 * Resolves purchase-flow user credentials from test-data + env.
 */
function resolvePurchaseUser(testData, env) {
  const { user } = testData.purchaseFlow;
  const password = env[user.passwordEnvKey];

  if (!user.email || !password) {
    throw new Error('Purchase flow user email/password missing in test-data or .env');
  }

  return { email: user.email, password };
}

module.exports = { resolvePurchaseUser };
