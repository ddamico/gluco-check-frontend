/* istanbul ignore file */
import red from "@material-ui/core/colors/red";
import deepOrange from "@material-ui/core/colors/deepOrange";
import { createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#4F517D",
    },
    secondary: {
      main: "#A997DF",
    },
    error: {
      main: red.A100,
    },
    warning: {
      main: deepOrange[500],
    },
    background: {
      default: "#fff",
    },
  },
});

export default theme;
