/**
 * Parses currency strings like "$12.99" or "12,99" into a number.
 */
function parsePrice(text) {
  if (!text) return 0;
  const normalized = String(text).replace(/[^0-9.,]/g, '').replace(',', '.');
  const match = normalized.match(/(\d+(?:\.\d{1,2})?)/);
  const value = match ? Number(match[1]) : 0;
  return Math.round(value * 100) / 100;
}

function roundCurrency(amount) {
  return Math.round(amount * 100) / 100;
}

module.exports = { parsePrice, roundCurrency };
