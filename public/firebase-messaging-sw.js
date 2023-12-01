importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js");

firebase.initializeApp({
  apiKey: "AIzaSyDuZmYBSeSFOmgbFf71x9OxnFPDtir1wnA",
  projectId: "chatboard-3000",
  messagingSenderId: "79156239579",
  appId: "1:79156239579:web:ae249a142cacb7cd1000fe",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.title;
  const notificationOptions = {
    body: "Bora um lolzinho vai",
    icon: "/logo.png",
    image: "/logo.png",
    requireInteraction: true,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
