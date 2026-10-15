import { cp, mkdir, rm } from 'node:fs/promises';
const root = new URL('../', import.meta.url);
const dir = new URL('../dist/', import.meta.url);
await rm(dir, { recursive: true, force: true });
await mkdir(dir, { recursive: true });
for (const file of ['index.html','styles.css','app.js','auth.js','auth-config.js','universities.js','privacy.html','manifest.webmanifest','favicon.svg','sw.js','register-sw.js']) {
  await cp(new URL(file, root), new URL(file, dir));
}
await mkdir(new URL('assets/', dir), { recursive: true });
for (const file of ['icon-192.png','icon-512.png']) {
  await cp(new URL(file, root), new URL('assets/'+file, dir));
}
console.log('UNISearch static build complete');
