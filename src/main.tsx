import React from "react";
import ReactDOM from "react-dom/client";

import "@/styles/index.css";

import { messaging } from "./lib/firebase";

import { onMessage } from "firebase/messaging";

import Router from "@/router";

onMessage(messaging, (payload) => {
  new Notification(payload.notification?.title ?? "New Message", {
    body: payload.notification?.body,
  });
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>,
);
