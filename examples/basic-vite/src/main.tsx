import React from "react";
import ReactDOM from "react-dom/client";
import "brightframe/tokens.css";
import "brightframe/style.css";
import { App } from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
