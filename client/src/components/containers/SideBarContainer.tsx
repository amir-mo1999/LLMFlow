import React from "react"
import Box from "@mui/material/Box"

interface SideBarContainerProps {
  children?: React.ReactNode
}

const SideBarContainer: React.FC<SideBarContainerProps> = ({ children }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        margin: 2,
        width: "30%",
        height: "100%",
        overflow: "auto",
        alignItems: "center",
        paddingRight: 2,
      }}
    >
      {children}
    </Box>
  )
}

export default SideBarContainer
