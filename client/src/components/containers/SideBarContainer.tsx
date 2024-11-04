import React from "react"
import ScrollBox from "./ScrollBox"
interface SideBarContainerProps {
  children?: React.ReactNode
}

const SideBarContainer: React.FC<SideBarContainerProps> = ({ children }) => {
  return (
    <ScrollBox
      sx={{
        display: "flex",
        flexDirection: "column",
        margin: 2,
        width: "30%",
        height: "100%",
        overflow: "auto",
        alignItems: "center",
        paddingRight: 2,
        overflowX: "hidden",
      }}
    >
      {children}
    </ScrollBox>
  )
}

export default SideBarContainer
