process.env.RECORD_VIDEO = '1';

const { execSync } = require('child_process');
const path = require('path');

try {
  execSync('npx playwright test --project=ui-chromium --headed --workers=1', {
    cwd: path.join(__dirname, '..'),
    stdio: 'inherit',
    env: process.env,
  });
} catch {
  // Continue so videos can still be collected when some specs fail.
}
