// Compares every locale file against en.json and reports missing / extra keys, and values that are
// identical to English (possible untranslated placeholders).
// Run: npm run check:i18n     Exit code 1 if any key is missing, so you can use it in CI.
import { readFileSync } from 'node:fs';

const dir = 'src/i18n/locales/';
const load = (f) => JSON.parse(readFileSync(dir + f, 'utf8'));
const flatten = (o, p = '') =>
  Object.entries(o).flatMap(([k, v]) => (typeof v === 'object' ? flatten(v, `${p}${k}.`) : [[`${p}${k}`, v]]));

// Plural suffixes differ per language (_one/_other for most, six forms for Arabic), so compare on the base key.
const base = (k) => k.replace(/_(zero|one|two|few|many|other)$/, '');

const en = flatten(load('en.json'));
const enKeys = new Set(en.map(([k]) => base(k)));
let problems = 0;

for (const file of ['ar.json', 'fa-AF.json', 'ps-AF.json']) {
  const entries = flatten(load(file));
  const keys = new Set(entries.map(([k]) => base(k)));
  const missing = [...enKeys].filter((k) => !keys.has(k));
  const extra = [...keys].filter((k) => !enKeys.has(k));
  const enMap = new Map(en.map(([k, v]) => [k, v]));
  const same = entries.filter(([k, v]) => enMap.get(k) === v && /[A-Za-z]{4,}/.test(v) && !/^[\w@.\- ]+$/.test('')).map(([k]) => k);
  console.log(`\n${file}: ${entries.length} strings`);
  if (missing.length) { problems += missing.length; console.log('  MISSING:', missing.join(', ')); }
  if (extra.length) console.log('  extra (not in en.json):', extra.join(', '));
  if (same.length) console.log('  identical to English (check):', same.join(', '));
  if (!missing.length && !extra.length) console.log('  OK - all keys present');
}
process.exit(problems ? 1 : 0);
