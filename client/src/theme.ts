import { createTheme, ThemeOptions } from "@mui/material/styles"

export const themeOptions: ThemeOptions = {
  palette: {
    action: {
      disabledBackground: "#B7AECC",
      disabled: "#000000",
    },
    primary: {
      main: "#503C80",
    },
    secondary: {
      main: "#EEB86D",
    },
    error: {
      main: "#DF5353",
      contrastText: "#ffffff",
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
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: 0,
          padding: 0,
          margin: 0,
          backgroundColor: "#F8FBFF",
          "&:hover": {
            backgroundColor: "#F8FBFF",
          },
        },
        list: {
          padding: 0,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        scrollbarWidth: "thin", // Options: 'auto' or 'thin'
        scrollbarColor: "rgba(80, 60, 128, 0.8) transparent", // Thumb and track colors}
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          transition: "background-color 0.3s",
          "&:hover": {
            backgroundColor: "#E8E3F2",
          },
          borderRadius: 16,
          scrollbarWidth: "thin", // Options: 'auto' or 'thin'
          scrollbarColor: "rgba(80, 60, 128, 0.8) transparent", // Thumb and track colors
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: "#503C80",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: "#ffffff",
          "&:hover": {
            backgroundColor: "#ffffff",
          },
          "&:focused": {
            backgroundColor: "#ffffff",
          },
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
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: "white",
          borderColor: "#503C80",
          fontSize: "1rem",
          paddingX: "5px",
          paddingY: "5px",
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          wordBreak: "break-word",
        },
      },
    },
  },
}

const theme = createTheme(themeOptions)

export default theme
