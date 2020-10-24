import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import { CircularProgress } from "@material-ui/core";
import App from "./App";

import "./lib/i18n";

ReactDOM.render(
  <Suspense fallback={<CircularProgress />}>
    <App />
  </Suspense>,
  document.getElementById("root")
);
