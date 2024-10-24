import Box, { BoxProps } from "@mui/material/Box"
import { styled } from "@mui/material/styles"

// Define the styled component with scrollbar styles
const StyledBox = styled(Box)(({ theme }) => ({
  /* Standard Scrollbar Styles for Firefox */
  scrollbarWidth: "thin",
  scrollbarColor: "rgba(80, 60, 128, 0.8) transparent",

  /* Scrollbar Styles for WebKit-based Browsers (Chrome, Safari, Edge) */
  "&::-webkit-scrollbar": {
    width: "8px",
    height: "8px", // For horizontal scrollbar
  },
  "&::-webkit-scrollbar-track": {
    background: "transparent",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "rgba(80, 60, 128, 0.8)",
    borderRadius: "4px",
    border: "2px solid transparent", // Adds spacing around the scrollbar thumb
    backgroundClip: "content-box", // Ensures the border doesn't overlap the thumb
  },
}))

// Create a CustomBox component that forwards all props to StyledBox
const ScrollBox: React.FC<BoxProps> = (props) => {
  return <StyledBox {...props} />
}

export default ScrollBox
