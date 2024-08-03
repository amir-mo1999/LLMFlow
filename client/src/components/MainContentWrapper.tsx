"use client"
import React from "react"
import Box from "@mui/material/Box"
import { SxProps } from "@mui/material"

interface ProjectBoxProps {
  children?: React.ReactNode
  sx?: SxProps
}

const MainContentWrapper: React.FC<ProjectBoxProps> = ({ children, sx }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#F3F2F7",
        paddingX: "4rem",
        paddingY: "1rem",
        height: "100%",
        width: "100%",
        overflowY: "auto",
        ...sx,
      }}
    >
      {children}
    </Box>
  )
}

export default MainContentWrapper
