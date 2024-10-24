import { EvaluateSummary } from "@/api/apiSchemas"
import { InputVariableOverview } from "../AIFunction"
import React from "react"
import Box from "@mui/material/Box"

interface EvalOverviewProps {
  evalResult: EvaluateSummary
}

const EvalOverview: React.FC<EvalOverviewProps> = ({ evalResult }) => {
  return (
    <Box>
      {evalResult.results.map((result, indx) => {
        return (
          <React.Fragment key={indx}>
            {result.vars ? (
              <InputVariableOverview vars={result.vars}></InputVariableOverview>
            ) : (
              <></>
            )}
          </React.Fragment>
        )
      })}
    </Box>
  )
}

export default EvalOverview
