import React from "react";

import { App } from "./App";
import { render } from "react-dom";

import "./index.css";

render(
  <App />,

  window.document.querySelector("#app-container")
);
