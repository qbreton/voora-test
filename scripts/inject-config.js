/**
 * Injects VOORA_API_KEY and VOORA_ORG_ID from env into index.html.
 * Used by GitHub Actions to avoid sed escaping issues with special characters.
 * Run: VOORA_API_KEY=xxx VOORA_ORG_ID=yyy node scripts/inject-config.js
 */

const fs = require('fs');
const path = require('path');

const apiKey = process.env.VOORA_API_KEY;
const orgId = process.env.VOORA_ORG_ID;

if (!apiKey || !orgId) {
  console.error('Missing VOORA_API_KEY or VOORA_ORG_ID');
  process.exit(1);
}

// Escape $ for JavaScript String.replace (replacement string)
function escapeReplacement(s) {
  return s.replace(/\$/g, '$$');
}

const indexPath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

html = html.replace(/VOTRE_CLE_API_ICI/g, escapeReplacement(apiKey));
html = html.replace(/ORGA_ID/g, escapeReplacement(orgId));

// Build id for verification in browser console and HTML comment
const buildId = process.env.GITHUB_RUN_ID || Date.now();
html = html.replace(/DEPLOY_BUILD_ID/g, String(buildId));
html = html.replace(
  /(<!-- Configuration Voora \(chargée)/,
  `<!-- build: ${buildId} -->\n    $1`
);

// Fail if placeholders still present (e.g. wrong file or replace failed)
if (html.includes('VOTRE_CLE_API_ICI') || html.includes('ORGA_ID')) {
  console.error('ERROR: Placeholders still present in index.html after replacement');
  process.exit(1);
}

fs.writeFileSync(indexPath, html);
console.log('Injection done. Build id:', buildId);
