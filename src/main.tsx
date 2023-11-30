import React from "react";
import ReactDOM from "react-dom/client";

import "@/styles/index.css";

import HomePage from "@/pages/Home";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HomePage />
  </React.StrictMode>,
);
