/* istanbul ignore file */
import red from "@material-ui/core/colors/red";
import orange from "@material-ui/core/colors/orange";
import { createMuiTheme, responsiveFontSizes } from "@material-ui/core/styles";

export const themeObj = {
  typography: {
    fontFamily: ["Poppins", "sans-serif"].join(","),
  },
  palette: {
    text: {
      primary: "#202124",
    },
    primary: {
      main: "#1a73e8",
      contrastText: "#fff",
    },
    secondary: {
      main: "#4285f4",
    },
    error: {
      main: red[500],
    },
    warning: {
      light: "rgba(245, 124, 0, 0.75)", // orange[700] at 75%
      main: orange[700],
    },
    background: {
      default: "#fff",
    },
  },
};
