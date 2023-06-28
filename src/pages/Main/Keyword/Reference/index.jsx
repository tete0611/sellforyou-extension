import React from "react";

import { render } from "react-dom";
import { Reference } from "./Reference";

import "./index.css";

render(
  <Reference />,

  window.document.querySelector("#app-container")
);
