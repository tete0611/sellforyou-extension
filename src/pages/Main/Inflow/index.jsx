import React from "react";

import { render } from "react-dom";
import { Inflow } from "./Inflow";

import "./index.css";

render(
  <Inflow />,

  window.document.querySelector("#app-container")
);
