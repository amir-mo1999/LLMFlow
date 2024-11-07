import { Assertion } from "@/api/apiSchemas"
import React from "react"
import { SxProps } from "@mui/material"
import Box from "@mui/material/Box"
import { AssertionPaper } from "@/components"

interface AssertionsOverviewProps {
  assertions: Assertion[]
  displayOnly?: boolean
  sx?: SxProps
  onClick?: (_: number) => () => void
  onDelete?: (_: number) => () => void
}

const AssertionsOverview: React.FC<AssertionsOverviewProps> = ({
  assertions,
  sx,
  displayOnly = false,
  onClick = () => () => {},
  onDelete = () => () => {},
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        maxHeight: 390,
        pb: 0.3,
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 2,
        alignItems: "flex-start",
        overflow: "auto",
        ...sx,
      }}
    >
      {assertions.map((assertion, indx) => {
        return (
          <AssertionPaper
            key={indx}
            assertion={assertion}
            onClick={onClick(indx)}
            onDelete={onDelete(indx)}
            displayOnly={displayOnly}
          ></AssertionPaper>
        )
      })}
    </Box>
  )
}

export default AssertionsOverview
