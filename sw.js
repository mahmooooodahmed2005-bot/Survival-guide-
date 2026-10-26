// Service Worker بسيط — غرضه الأساسي تفعيل إمكانية "إضافة إلى الشاشة الرئيسية"
// ما يخزن أي شي حساس، بس يخلي المتصفح يعتبر الموقع "قابل للتثبيت".

const CACHE_NAME = 'dalil-alnajeen-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // مرّر كل الطلبات عادي للشبكة (ما نخزن شي إجباري) — بس وجود هذا الهاندلر
  // كافي لبعض المتصفحات لاعتبار الموقع تطبيق ويب قابل للتثبيت.
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
