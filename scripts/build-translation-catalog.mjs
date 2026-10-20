import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const root = new URL('../src/i18n/', import.meta.url);
const source = JSON.parse(readFileSync(new URL('englishSource.json', root), 'utf8'));
const current = JSON.parse(readFileSync(new URL('catalog.json', root), 'utf8'));
const membership = JSON.parse(readFileSync(new URL('membershipTranslations.json', root), 'utf8'));
// Content keys depend on the text, so cached translations survive new releases safely.
const values = new Set([...Object.values(current), ...Object.values(source), ...Object.keys(membership)]);
const catalog = Object.fromEntries([...values].sort().map((text) => ['s' + createHash('sha256').update(text).digest('hex').slice(0, 16), text]));
writeFileSync(new URL('catalog.json', root), JSON.stringify(catalog, null, 2) + '\n');
console.log(`${Object.keys(catalog).length} public translation entries`);
