const CACHE_NAME = 'planova-cache-v1';
const PRE_CACHE = [
    './',
    './index.html',
    './style.css',
    './script.js'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(PRE_CACHE))
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => 
            Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
        )
    );
    self.clients.claim();
});

self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'TRIGGER_NOTIFICATION') {
        self.registration.showNotification(event.data.title, {
            body: event.data.body,
            icon: 'https://via.placeholder.com/128/5267d9/ffffff?text=Planova',
            vibrate: [200, 100, 200]
        });
    }
});