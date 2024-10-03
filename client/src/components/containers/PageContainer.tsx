import React from "react"
import Box from "@mui/material/Box"

interface PageContainerProps {
  children?: React.ReactNode
}

const PageContainer: React.FC<PageContainerProps> = ({ children }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        margin: 2,
        width: "100%",
        height: "100%",
        overflow: "hidden",
        alignItems: "center",
      }}
    >
      {children}
    </Box>
  )
}

export default PageContainer
