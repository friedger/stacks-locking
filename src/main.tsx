import React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { App } from "./App";
import { SignIn } from "./pages/sign-in/sign-in";
import { StackingDelegation } from "./pages/stacking/delegated-stacking/pooled-stacking";
import { ChooseStackingMethod } from "./pages/start-stacking/start-stacking";
import { Buffer } from "buffer/";

type Environments = "development" | "testing" | "production";

window.CONFIG = {};
globalThis.process = { env: {} };
// globalThis.global = {};
// window.global = {};

// window.Buffer = Buffer;

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <SignIn />,
      },
      {
        path: "choose-stacking",
        element: <ChooseStackingMethod />,
      },
      {
        path: "pooled-stacking",
        element: <StackingDelegation />,
      },
    ],
  },
]);

const container = document.getElementById("root") as HTMLElement;

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
