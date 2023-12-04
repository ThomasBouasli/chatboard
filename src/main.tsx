import React from "react";
import ReactDOM from "react-dom/client";

import "@/styles/index.css";

import { AnimateProvider } from "@/providers/AnimateProvider";
import { DataProvider } from "@/providers/DataProvider";
import Router from "@/router";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <DataProvider>
      <AnimateProvider>
        <Router />
      </AnimateProvider>
    </DataProvider>
  </React.StrictMode>,
);
