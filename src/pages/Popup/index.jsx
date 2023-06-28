import React from "react";
import Popup from "./Popup";

import { render } from "react-dom";

render(<Popup />, window.document.querySelector("#app-container"));

if (module.hot) module.hot.accept();
