import React from "react";
import ReactDOM from "react-dom";

import App from "./app";

import "./styles/index.less";

import * as serviceWorkerRegistration from "./utils/serviceWorkerRegistration";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

serviceWorkerRegistration.unregister();
