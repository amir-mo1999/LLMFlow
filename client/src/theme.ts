import { createTheme, ThemeOptions } from "@mui/material/styles"

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
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          transition: "background-color 0.3s",
          "&:hover": {
            backgroundColor: "#f0f0f0",
          },
          borderRadius: 16,
          scrollbarWidth: "thin", // Options: 'auto' or 'thin'
          scrollbarColor: "rgba(80, 60, 128, 0.8) transparent", // Thumb and track colors
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: "#503C80",
          },
          borderRadius: 0,
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "gray",
          "&.Mui-focused": {
            color: "#503C80",
          },
        },
        shrink: {
          color: "#503C80",
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: "#503C80", // Color for the unchecked state (border color)
          "&.Mui-checked": {
            color: "#503C80", // Color for the checked state (border color)
          },
        },
      },
    },
  },
}

const theme = createTheme(themeOptions)

export default theme
