/* istanbul ignore file */
import red from "@material-ui/core/colors/red";
import orange from "@material-ui/core/colors/orange";
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
      light: "rgba(245, 124, 0, 0.75)", // orange[700] at 38%, to match material disabled colour
      main: orange[700],
    },
    background: {
      default: "#fff",
    },
  },
});

export default theme;