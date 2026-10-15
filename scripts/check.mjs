import {readFile,access} from 'node:fs/promises';
import {universities} from '../universities.js';
import assert from 'node:assert/strict';
assert.equal(universities.length,32);
assert.equal(new Set(universities.map(u=>u.id)).size,32);
for(const u of universities){assert(u.website.startsWith('https://'));assert(u.majors.length);if(u.tuition){assert(u.tuition.url.startsWith('https://'));assert.equal(u.tuition.year,'2026/27')}}
const app=await readFile(new URL('../app.js',import.meta.url),'utf8');
assert(app.includes('replace(/[&<>"\\']/g'));
assert(app.includes('not acceptance probabilities'));
await access(new URL('../privacy.html',import.meta.url));
console.log('Catalog provenance, route and security baseline checks passed');
