import React from "react";
// import ReactDOM from 'react-dom/client'
import { render } from "react-dom";
import App from "./App";
import "./index.css";

render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root") as HTMLElement
);
