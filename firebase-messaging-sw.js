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

// 1. Nhận tin nhắn ngầm và hiển thị thông báo kèm dữ liệu điều hướng (url)
messaging.onBackgroundMessage((payload) => {
  console.log("Nhan tin nhan ngam:", payload);
  const notification = payload.notification || {};
  
  const notificationTitle = notification.title || "Thông báo mới";
  const notificationOptions = {
    body: notification.body || "",
    icon: "https://cdn-icons-png.flaticon.com/512/3135/3135679.png",
    // Ép cứng link app vào dữ liệu thông báo
    data: {
      url: "https://minhthienazz.github.io/tienluong/"
    }
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});

// 2. Sự kiện chạm tay vào thông báo -> Buộc mở đúng link tuyệt đối trang Chấm Công
self.addEventListener("notificationclick", (event) => {
  event.notification.close(); // Tắt bong bóng thông báo đi
  
  // Link tuyệt đối chính xác của app, không sợ bị nhảy về trang chủ nữa
  const targetUrl = "https://minhthienazz.github.io/tienluong/";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      // Nếu có sẵn một tab chấm công đang mở, đưa nó lên hàng đầu (focus)
      for (let i = 0; i < windowClients.length; i++) {
        let client = windowClients[i];
        if (client.url === targetUrl && "focus" in client) {
          return client.focus();
        }
      }
      // Nếu chưa có tab nào mở thì khởi chạy tab mới mở app lên
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});

// 3. Quản lý lưu trữ ngoại tuyến (Cache) - Đã tăng lên v4 để ép điện thoại xóa code cũ
const CACHE_NAME = "chamcong-v4";
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
