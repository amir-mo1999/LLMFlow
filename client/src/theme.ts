import { createTheme, ThemeOptions } from "@mui/material/styles";

export const themeOptions: ThemeOptions = {
  palette: {
    action: {
      disabledBackground: "#EEB86D",
      disabled: "#000000",
    },
    primary: {
      main: "#503C80",
    },
    secondary: {
      main: "#EEB86D",
    },
    background: {
      default: "#F8FBFF",
      paper: "#ffffff",
    },
    text: {
      secondary: "#ffffff",
      primary: "#000000",
    },
  },
};

const theme = createTheme(themeOptions);

export default theme;
