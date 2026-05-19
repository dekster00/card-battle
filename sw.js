const CACHE_NAME = 'card-battle-v1';

// ไฟล์ที่ cache ไว้เล่น offline
const STATIC_ASSETS = [
  './index_anim.html',
  './manifest.json'
];

// Install — cache ไฟล์หลัก
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// Activate — ลบ cache เก่า
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch — ลอง network ก่อน ถ้าไม่มีใช้ cache
self.addEventListener('fetch', e => {
  // GitHub raw assets ให้ network-first
  if (e.request.url.includes('raw.githubusercontent.com')) {
    e.respondWith(
      fetch(e.request).catch(() => caches.match(e.request))
    );
    return;
  }
  // ไฟล์หลัก cache-first
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
