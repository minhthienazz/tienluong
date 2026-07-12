importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

// 1. Cấu hình Firebase
firebase.initializeApp({
    apiKey: "AIzaSyCyWCvcWRCMh-zUelTMHvKjkRJxQTdnET4",
    projectId: "web-chot-luong",
    messagingSenderId: "731011770123",
    appId: "1:731011770123:web:ffd7946fe4db16b020640e"
});

const messaging = firebase.messaging();

// 2. Hứng thông báo khi anh vuốt tắt sạch Chrome
messaging.onBackgroundMessage(function(payload) {
  console.log('Nhận tin nhắn ngầm: ', payload);
  const notificationTitle = payload.notification.title || 'Thông báo mới';
  const notificationOptions = {
    body: payload.notification.body,
    icon: 'https://cdn-icons-png.flaticon.com/512/3135/3135679.png',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// =========================================================
// 3. XỬ LÝ LƯU CACHE CHO WEB CHẠY OFFLINE (Đã gộp từ file cũ)
// =========================================================
const C = 'chamcong';
const A = [
    '/',
    'https://cdn.tailwindcss.com',
    'https://unpkg.com/@phosphor-icons/web'
];

self.addEventListener('install', e => {
    self.skipWaiting();
    e.waitUntil(caches.open(C).then(c => c.addAll(A)));
});

self.addEventListener('activate', e => {
    e.waitUntil(caches.keys().then(ks => Promise.all(ks.map(k => {
        if(k !== C) return caches.delete(k);
    }))));
    e.waitUntil(clients.claim());
});

self.addEventListener('fetch', e => {
    if (e.request.method !== 'GET') return;
    e.respondWith(
        fetch(e.request)
            .then(res => {
                const resClone = res.clone();
                caches.open(C).then(cache => cache.put(e.request, resClone));
                return res;
            })
            .catch(() => caches.match(e.request))
    );
});

