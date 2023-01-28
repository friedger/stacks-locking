import "./assets/fonts/inter/inter.css";
import "./assets/fonts/open-sauce-one/open-sauce-one.css";
import React from "react";

import ReactDOM from "react-dom/client";

import { App } from "./App";

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
