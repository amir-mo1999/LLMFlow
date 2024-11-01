"use client"

import React from "react"
import ScrollBox from "./ScrollBox"

interface MainContentContainerProps {
  children?: React.ReactNode
}

const MainContentContainer: React.FC<MainContentContainerProps> = ({ children }) => {
  return (
    <ScrollBox
      sx={{
        display: "flex",
        flexDirection: "column",
        paddingRight: 10,
        marginRight: 4,
        width: "70%",
        height: "100%",
        overflow: "auto",
        alignItems: "center",
      }}
    >
      {children}
    </ScrollBox>
  )
}

export default MainContentContainer
