import "reflect-metadata";
import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import {
  CircularProgress,
  CssBaseline,
  Grid,
  ThemeProvider,
} from "@material-ui/core";
import App from "./App";
import theme from "./theme";

import "./lib/i18n";

ReactDOM.render(
  <Suspense
    fallback={
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
        style={{ minHeight: "100vh" }}
      >
        <Grid item>
          <CircularProgress />
        </Grid>
      </Grid>
    }
  >
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </Suspense>,
  document.getElementById("root")
);
