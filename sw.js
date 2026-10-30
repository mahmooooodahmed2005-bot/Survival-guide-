// Service Worker — يجعل الموقع قابلاً للتثبيت ويعطي نسخة احتياطية بدون إنترنت.
// الاستراتيجية: الشبكة أولاً ثم الكاش (لتبقى المحتويات محدّثة دائماً).
// لا نخزّن أي بيانات حساسة، ولا نتدخل بطلبات غير GET أو خارج النطاق (مثل عدّاد الشكر).

const CACHE_NAME = 'dalil-alnajeen-v2';
const PRECACHE = [
  './',
  './index.html',
  './site-journey.html',
  './manifest.json',
  './assets/icon-192.png',
  './assets/icon-512.png',
  './assets/favicon-32.png',
  './assets/apple-touch-icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      // لا نفشل التثبيت كله لو ملف واحد تعذّر تحميله
      .then((cache) => Promise.allSettled(PRECACHE.map((u) => cache.add(u))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/.netlify/')) return;

  event.respondWith(
    fetch(req)
      .then((res) => {
        if (res && res.ok && res.type === 'basic') {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(req, copy)).catch(() => {});
        }
        return res;
      })
      .catch(() =>
        caches.match(req).then((hit) =>
          hit || (req.mode === 'navigate' ? caches.match('./index.html') : Response.error())
        )
      )
  );
});
