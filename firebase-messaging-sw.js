importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js");

firebase.initializeApp({
  apiKey: "AIzaSyCyWCvcWRCMh-zUelTMHvKjkRJxQTdnET4",
  authDomain: "web-chot-luong.firebaseapp.com",
  projectId: "web-chot-luong",
  storageBucket: "web-chot-luong.firebasestorage.app",
  messagingSenderId: "731011770123",
  appId: "1:731011770123:web:ffd7946fe4db16b020640e"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Nhan tin nhan ngam:", payload);
  const notification = payload.notification || {};
  const notificationTitle = notification.title || "Thong bao moi";
  const notificationOptions = {
    body: notification.body || "",
    icon: "https://cdn-icons-png.flaticon.com/512/3135/3135679.png"
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});

const CACHE_NAME = "chamcong-v2";
const ASSETS_TO_CACHE = [
  "./",
  "./index.html"
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => (key !== CACHE_NAME ? caches.delete(key) : null)))
    )
  );
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    fetch(event.request)
      .then((res) => {
        const resClone = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone));
        return res;
      })
      .catch(() => caches.match(event.request))
  );
});