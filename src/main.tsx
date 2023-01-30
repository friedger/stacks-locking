import React from "react";

import ReactDOM from "react-dom/client";

import { App } from "./App";
import "./assets/fonts/inter/inter.css";
import "./assets/fonts/open-sauce-one/open-sauce-one.css";

// Ensures `BigInt`s don't throw errors when using `JSON.stringify`, as they are not supported by
// the `stringify` function.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
