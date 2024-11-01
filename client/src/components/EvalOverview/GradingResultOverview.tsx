import { GradingResult } from "@/api/apiSchemas"
import React from "react"
import { SxProps } from "@mui/material"
import Box from "@mui/material/Box"
import { AssertionPaper } from "@/components"

interface GradingResultOverviewProps {
  gradingResults: GradingResult[]
  sx?: SxProps
}

const GradingResultOverview: React.FC<GradingResultOverviewProps> = ({ gradingResults, sx }) => {
  return (
    <Box
      sx={{
        mt: 1,
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
      {gradingResults.map((result, indx) => {
        const assertion = result.assertion

        if (!assertion) return <></>

        return (
          <AssertionPaper
            key={indx}
            assertion={assertion}
            passed={result.pass}
            displayOnly
          ></AssertionPaper>
        )
      })}
    </Box>
  )
}

export default GradingResultOverview
