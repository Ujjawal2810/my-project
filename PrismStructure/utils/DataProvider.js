const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'test-data', 'toolshop.json');

let cached;

/**
 * Prism DataProviderSource equivalent — loads test-data/toolshop.json.
 */
function loadTestData() {
  if (!cached) {
    cached = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  }
  return cached;
}

function getSection(section) {
  return loadTestData()[section];
}

module.exports = { loadTestData, getSection };
