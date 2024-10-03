import React from "react"
import Box from "@mui/material/Box"

interface MainContentContainerProps {
  children?: React.ReactNode
}

const MainContentContainer: React.FC<MainContentContainerProps> = ({ children }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        margin: 2,
        flexGrow: 1,
        height: "100%",
        overflow: "auto",
        alignItems: "center",
      }}
    >
      {children}
    </Box>
  )
}

export default MainContentContainer
