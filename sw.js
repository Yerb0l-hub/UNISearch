const CACHE = 'unisearch-shell-v2';
const ASSETS = ['/', '/index.html', '/styles.css', '/app.js', '/auth.js', '/auth-config.js', '/universities.js',
'/manifest.webmanifest', '/favicon.svg', '/privacy.html', '/assets/icon-192.png',
'/assets/icon-512.png'];
self.addEventListener('install', e => {
 e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
 self.skipWaiting();
});
self.addEventListener('activate', e => {
 e.waitUntil(caches.keys().then(keys => Promise.all(
 keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
 self.clients.claim();
});
self.addEventListener('fetch', e => {
 const r=e.request, u=new URL(r.url);
 if(r.method!=='GET'||u.origin!==self.location.origin||u.pathname.startsWith('/api/'))return;
 e.respondWith(fetch(r).then(response => {
  if(response.ok&&response.type==='basic') {
   const copy=response.clone(); caches.open(CACHE).then(c=>c.put(r,copy));
  }
  return response;
 }).catch(()=>caches.match(r).then(c=>c||caches.match('/index.html'))));
});
