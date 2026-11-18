import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const root = new URL('../src/i18n/', import.meta.url);
const server = new URL('../src/server/', import.meta.url);
const read = (url) => JSON.parse(readFileSync(url, 'utf8'));
const source = read(new URL('englishSource.json', root));
const current = read(new URL('catalog.json', root));
const membership = read(new URL('membershipTranslations.json', root));
// Membership lesson text lives on the server and reaches the browser only after sign-in.
const premiumSource = read(new URL('premiumSource.json', server));
const premiumCurrent = read(new URL('premiumCatalog.json', server));
// Content keys depend on the text, so cached translations survive new releases safely.
const key = (text) => 's' + createHash('sha256').update(text).digest('hex').slice(0, 16);
const build = (values) => Object.fromEntries([...values].sort().map((text) => [key(text), text]));
const publicValues = new Set([...Object.values(current), ...Object.values(source), ...Object.keys(membership)]);
const premiumValues = new Set([...Object.values(premiumCurrent), ...Object.values(premiumSource)].filter((text) => !publicValues.has(text)));
const catalog = build(publicValues);
const premiumCatalog = build(premiumValues);
writeFileSync(new URL('catalog.json', root), JSON.stringify(catalog, null, 2) + '\n');
writeFileSync(new URL('premiumCatalog.json', server), JSON.stringify(premiumCatalog, null, 2) + '\n');
console.log(`${Object.keys(catalog).length} public and ${Object.keys(premiumCatalog).length} members-only translation entries`);
