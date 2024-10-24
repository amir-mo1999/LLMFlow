"use client"
import { EvaluateSummary } from "@/api/apiSchemas"
import { InputVariableOverview, InputVariablePaper } from "../AIFunction"
import Typography from "@mui/material/Typography"
import React from "react"
import Box from "@mui/material/Box"
import GradingResultOverview from "./GradingResultOverview"

interface EvalOverviewProps {
  evalResult: EvaluateSummary
}

const EvalOverview: React.FC<EvalOverviewProps> = ({ evalResult }) => {
  return (
    <Box>
      {/* Loop over results */}
      {evalResult.results.map((result, indx) => {
        const output = result.response?.output
        const gradingResults = result.gradingResult?.componentResults
        return (
          <React.Fragment key={indx}>
            {/* Variables */}
            <Typography variant="h6">Variables</Typography>
            {result.vars ? (
              <InputVariableOverview vars={result.vars} displayOnly></InputVariableOverview>
            ) : (
              <></>
            )}

            {/* LLM Response */}
            <Typography variant="h6">Response</Typography>
            {output ? (
              <Box
                sx={{
                  display: "flex",
                  width: "100%",
                  overflow: "auto",
                  mt: 1,
                  pb: 0.3,
                }}
              >
                <InputVariablePaper
                  displayOnly
                  varName="Output"
                  content={output}
                ></InputVariablePaper>
              </Box>
            ) : (
              <></>
            )}

            {/* Grading Results */}
            <Typography variant="h6">Assertions</Typography>
            {gradingResults ? (
              <GradingResultOverview gradingResults={gradingResults}></GradingResultOverview>
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
