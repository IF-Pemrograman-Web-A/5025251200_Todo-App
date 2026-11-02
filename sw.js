const VERSION = 'v2';
const SHELL_CACHE = `planova-shell-${VERSION}`;
const RUNTIME_CACHE = `planova-runtime-${VERSION}`;
const OFFLINE_URL = './offline.html';

const PRECACHE_URLS = [
    './',
    './index.html',
    './offline.html',
    './style.css',
    './script.js',
    './manifest.webmanifest',
    './icons/icon-192.png',
    './icons/icon-512.png',
    './icons/maskable-192.png',
    './icons/maskable-512.png',
    './icons/apple-touch-icon.png',
    './icons/favicon-32.png'
];

/* ---------- Install: precache app shell + offline page ---------- */
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(SHELL_CACHE)
            .then((cache) => cache.addAll(PRECACHE_URLS))
            .then(() => self.skipWaiting())
    );
});

/* ---------- Activate: hapus cache versi lama ---------- */
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((keys) => Promise.all(
                keys
                    .filter((k) => k.startsWith('planova-') && k !== SHELL_CACHE && k !== RUNTIME_CACHE)
                    .map((k) => caches.delete(k))
            ))
            .then(() => self.clients.claim())
    );
});

/* ---------- Strategi ---------- */
/* Response hasil redirect (mis. server `serve` yang mengubah /index.html -> /)
 * tidak boleh dipakai untuk request navigasi, kalau tidak browser menampilkan
 * ERR_FAILED. Fungsi ini membuat salinan "bersih" tanpa flag redirected. */
async function cleanResponse(res) {
    if (!res || !res.redirected) return res;
    const body = await res.blob();
    return new Response(body, {
        status: res.status,
        statusText: res.statusText,
        headers: res.headers
    });
}

async function networkFirst(request) {
    try {
        const fresh = await fetch(request);
        if (fresh && fresh.ok) {
            const cache = await caches.open(SHELL_CACHE);
            cache.put(request, fresh.clone());
        }
        return fresh;
    } catch (err) {
        // Offline: coba halaman yang sama, lalu app shell, lalu halaman offline
        const cached = (await caches.match(request, { ignoreSearch: true })) ||
            (await caches.match('./')) ||
            (await caches.match('./index.html')) ||
            (await caches.match(OFFLINE_URL));
        return cached ? cleanResponse(cached) : Response.error();
    }
}

async function staleWhileRevalidate(request) {
    const cache = await caches.open(SHELL_CACHE);
    const cached = await cache.match(request);
    const refresh = fetch(request)
        .then((res) => {
            if (res && res.ok) cache.put(request, res.clone());
            return res;
        })
        .catch(() => null);
    return cached || (await refresh) || Response.error();
}

async function cacheFirst(request) {
    const cached = await caches.match(request);
    if (cached) return cached;
    try {
        const res = await fetch(request);
        if (res && res.ok) {
            const cache = await caches.open(RUNTIME_CACHE);
            cache.put(request, res.clone());
        }
        return res;
    } catch (err) {
        return Response.error();
    }
}

self.addEventListener('fetch', (event) => {
    const { request } = event;
    if (request.method !== 'GET') return;

    const url = new URL(request.url);
    if (url.origin !== self.location.origin) return;

    if (request.mode === 'navigate') {
        event.respondWith(networkFirst(request));
        return;
    }

    if (request.destination === 'style' || request.destination === 'script') {
        event.respondWith(staleWhileRevalidate(request));
        return;
    }

    if (request.destination === 'image' || request.destination === 'manifest' ||
        url.pathname.endsWith('.webmanifest')) {
        event.respondWith(cacheFirst(request));
        return;
    }
});

/* ---------- Notifikasi pengingat tugas (dari E03) ---------- */
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'TRIGGER_NOTIFICATION') {
        self.registration.showNotification(event.data.title, {
            body: event.data.body,
            icon: './icons/icon-192.png',
            badge: './icons/favicon-32.png',
            vibrate: [200, 100, 200]
        });
    }
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
            for (const client of list) {
                if ('focus' in client) return client.focus();
            }
            return self.clients.openWindow('./');
        })
    );
});