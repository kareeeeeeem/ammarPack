const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve('out');
assert.ok(fs.existsSync(path.join(root, 'index.html')), 'Missing static homepage');
const pages = [];
function walk(directory) { for (const entry of fs.readdirSync(directory, { withFileTypes: true })) { const file = path.join(directory, entry.name); if (entry.isDirectory()) walk(file); else if (file.endsWith('.html')) pages.push(file); } }
walk(root);
const failures = [];
for (const page of pages) {
  const html = fs.readFileSync(page, 'utf8');
  if (/Fast Scaling Trade|fastscalingai|[\u0600-\u06FF]/i.test(html)) failures.push(`${page}: old branding or non-English text`);
  for (const match of html.matchAll(/(?:href|src)="(\/[^"]*)"/g)) {
    const url = new URL(match[1], 'https://static.example');
    const local = decodeURIComponent(url.pathname).replace(/^\//, '');
    const candidates = local ? [path.join(root, local), path.join(root, `${local}.html`), path.join(root, local, 'index.html')] : [path.join(root, 'index.html')];
    if (!candidates.some(candidate => fs.existsSync(candidate) && fs.statSync(candidate).isFile())) failures.push(`${page}: missing ${match[1]}`);
  }
}
assert.ok(fs.readFileSync(path.join(root, 'markets.html'), 'utf8').includes('http-equiv="refresh"'), 'Legacy route lacks static redirect');
assert.ok(fs.readFileSync(path.join(root, 'index.html'), 'utf8').includes('https://wa.me/201155053159'), 'Missing WhatsApp link');
const homepage = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
assert.equal((homepage.match(/data-packy="journey"/g) || []).length, 1, 'Homepage must have one persistent PACKY instance');
for (const section of ['hero', 'story', 'products', 'process', 'quality', 'quote']) assert.ok(homepage.includes(`data-packy-section="${section}"`), `Missing PACKY ${section} waypoint`);
assert.equal(failures.length, 0, failures.join('\n'));
console.log(`Validated ${pages.length} exported HTML pages, local links and assets, English content, and legacy redirect.`);
