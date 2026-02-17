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

// Escape for use inside a double-quoted JS string (avoid breaking the HTML)
function escapeForJsString(s) {
  return s.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

const indexPath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// Replace only the config object values, NOT the check (if VOORA_CONFIG.apiKey === "VOTRE_CLE_API_ICI")
// so the "not configured" check still works after injection
const safeApiKey = escapeForJsString(apiKey);
const safeOrgId = escapeForJsString(orgId);
html = html.replace(/organizationId: "ORGA_ID"/, 'organizationId: "' + safeOrgId + '"');
// Only the one in the config object (followed by comma), not the one in if (VOORA_CONFIG.apiKey === "...")
html = html.replace(/apiKey: "VOTRE_CLE_API_ICI"(?=,)/, 'apiKey: "' + safeApiKey + '"');

// Build id for verification in browser console and HTML comment
const buildId = process.env.GITHUB_RUN_ID || Date.now();
html = html.replace(/DEPLOY_BUILD_ID/g, String(buildId));
html = html.replace(
  /(<!-- Configuration Voora \(chargée)/,
  `<!-- build: ${buildId} -->\n    $1`
);

// Fail if config object still has placeholders (object has comma after apiKey, if() does not)
if (/organizationId: "ORGA_ID"/.test(html) || /apiKey: "VOTRE_CLE_API_ICI",/.test(html)) {
  console.error('ERROR: Config placeholders still present in index.html after replacement');
  process.exit(1);
}

fs.writeFileSync(indexPath, html);
console.log('Injection done. Build id:', buildId);
