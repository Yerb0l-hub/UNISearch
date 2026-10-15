import { cp, mkdir, rm } from 'node:fs/promises';
import { build } from 'esbuild';
const root = new URL('../', import.meta.url);
const dir = new URL('../dist/', import.meta.url);
await rm(dir, { recursive: true, force: true });
await mkdir(dir, { recursive: true });
for (const file of ['index.html','styles.css','auth-config.js','universities.js','privacy.html','manifest.webmanifest','favicon.svg','sw.js','register-sw.js']) {
  await cp(new URL(file, root), new URL(file, dir));
}
await mkdir(new URL('assets/', dir), { recursive: true });
for (const file of ['icon-192.png','icon-512.png']) {
  await cp(new URL(file, root), new URL('assets/'+file, dir));
}
await build({
  entryPoints: [new URL('../app.js', import.meta.url).pathname],
  outfile: new URL('app.js', dir).pathname,
  bundle: true, format: 'esm', platform: 'browser', target: 'es2022',
  minify: true, logLevel: 'warning'
});
console.log('UNISearch production bundle complete');
