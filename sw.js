self.addEventListener('install', (e) => {
  console.log('Service Worker installé');
});

self.addEventListener('fetch', (e) => {
  // Laisse passer le réseau normalement
  e.respondWith(fetch(e.request));
});
