import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import {
  CircularProgress,
  CssBaseline,
  ThemeProvider,
} from "@material-ui/core";
import App from "./App";
import theme from "./theme";

import "./lib/i18n";

ReactDOM.render(
  <Suspense fallback={<CircularProgress />}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </Suspense>,
  document.getElementById("root")
);
