import { cp, mkdir, rm } from 'node:fs/promises';
const dir = new URL('../dist/', import.meta.url);
await rm(dir, { recursive: true, force: true });
await mkdir(dir, { recursive: true });
for (const file of ['index.html','styles.css','app.js','auth.js','auth-config.js','universities.js','privacy.html','manifest.webmanifest','favicon.svg','sw.js','register-sw.js']) {
  await cp(new URL('../'+file, import.meta.url), new URL(file, dir));
}
await cp(new URL('../assets/', import.meta.url), new URL('assets/', dir), {recursive:true});
console.log('UNISearch static build complete');
