// Service Worker v6
const CACHE = 'gestor-v6';

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k)))));
  self.clients.claim();
});

// Network first para HTML, cache para assets estáticos
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  // Nunca cacheia o index.html — sempre busca da rede
  if(url.pathname === '/' || url.pathname.endsWith('.html')){
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
    return;
  }
  // Ícones e assets: cache first
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).then(resp => {
      const clone = resp.clone();
      caches.open(CACHE).then(c => c.put(e.request, clone));
      return resp;
    }))
  );
});
