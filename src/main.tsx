import React from "react";
import ReactDOM from "react-dom/client";

import "@/styles/index.css";

import { onMessage } from "firebase/messaging";

import { messaging } from "@/lib/firebase";
import { AnimateProvider } from "@/providers/AnimateProvider";
import { DataProvider } from "@/providers/DataProvider";
import Router from "@/router";

onMessage(messaging, (payload) => {
  new Notification(payload.notification?.title ?? "New Message", {
    body: payload.notification?.body,
  });
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <DataProvider>
      <AnimateProvider>
        <Router />
      </AnimateProvider>
    </DataProvider>
  </React.StrictMode>,
);
