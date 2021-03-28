import React, { ReactNode } from "react";
import {
  createMuiTheme,
  responsiveFontSizes,
  ThemeProvider,
  useMediaQuery,
} from "@material-ui/core";
import { themeObj } from "../theme";

type ThemeWithMediaProviderProps = {
  children: ReactNode;
};

// Component for mixing user media preferences into MUI theme,
// currently used to add dark mode support
function ThemeWithMediaProvider(props: ThemeWithMediaProviderProps) {
  const prefersDark = useMediaQuery("(prefers-color-scheme: dark)");

  const theme = React.useMemo(() => {
    let blendedTheme = createMuiTheme({
      ...themeObj,
      palette: {
        type: prefersDark ? "dark" : "light",
      },
    });
    blendedTheme = responsiveFontSizes(blendedTheme);
    return blendedTheme;
  }, [prefersDark]);

  return <ThemeProvider theme={theme}>{props.children}</ThemeProvider>;
}

export default ThemeWithMediaProvider;
