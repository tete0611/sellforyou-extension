import React from "react";

import { render } from "react-dom";
import { ChangePassword } from "./ChangePassword";

import "./index.css";

render(
  <ChangePassword />,

  window.document.querySelector("#app-container")
);
