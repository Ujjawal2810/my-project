const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const root = path.join(__dirname, '..');
const testResultsDir = path.join(root, 'test-results');
const evidenceDir = path.join(root, 'reports', 'evidence');
const videosDir = path.join(evidenceDir, 'videos');

function findVideos(dir, results = []) {
  if (!fs.existsSync(dir)) {
    return results;
  }

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      findVideos(fullPath, results);
      continue;
    }

    if (entry.name === 'video.webm') {
      results.push(fullPath);
    }
  }

  return results;
}

function sanitizeName(filePath) {
  const folder = path.basename(path.dirname(filePath));
  return folder.replace(/[^a-zA-Z0-9._-]+/g, '-').slice(0, 120);
}

fs.mkdirSync(videosDir, { recursive: true });

const sources = findVideos(testResultsDir);
if (sources.length === 0) {
  console.error('No Playwright videos found under test-results/. Run: npm run test:ui:record');
  process.exit(1);
}

const copied = [];
sources.forEach((source, index) => {
  const target = path.join(videosDir, `${String(index + 1).padStart(2, '0')}-${sanitizeName(source)}.webm`);
  fs.copyFileSync(source, target);
  copied.push(target);
  console.log(`Copied ${target}`);
});

const combinedPath = path.join(evidenceDir, 'automation-ui-run.webm');
const listPath = path.join(videosDir, 'concat-list.txt');
const listBody = copied.map((file) => `file '${file.replace(/\\/g, '/').replace(/'/g, "'\\''")}'`).join('\n');
fs.writeFileSync(listPath, listBody, 'utf8');

try {
  execSync(
    `ffmpeg -y -f concat -safe 0 -i "${listPath}" -c copy "${combinedPath}"`,
    { stdio: 'inherit' }
  );
  const sizeMb = (fs.statSync(combinedPath).size / (1024 * 1024)).toFixed(2);
  console.log(`Combined video: ${combinedPath} (${sizeMb} MB)`);
} catch {
  const fallback = copied.find((file) => /purchase-journey/i.test(file)) || copied[0];
  fs.copyFileSync(fallback, combinedPath);
  const sizeMb = (fs.statSync(combinedPath).size / (1024 * 1024)).toFixed(2);
  console.log(`ffmpeg not available; using primary clip: ${combinedPath} (${sizeMb} MB)`);
}
