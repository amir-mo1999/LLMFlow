import { EvaluateResult } from "@/api/apiSchemas"
import { SxProps } from "@mui/material"
import theme from "@/theme"
import { InputVariableOverview, InputVariablePaper } from "../AIFunction"
import Typography from "@mui/material/Typography"
import React from "react"
import Box from "@mui/material/Box"
import GradingResultOverview from "./GradingResultOverview"
import Divider from "@mui/material/Divider"

interface ResultCardProps {
  result: EvaluateResult
  sx?: SxProps
}

const ResultCard: React.FC<ResultCardProps> = ({ result, sx }) => {
  const output = result.response?.output
  const gradingResults = result.gradingResult?.componentResults

  return (
    <Box
      sx={{
        position: "relative",
        borderRadius: 1,
        borderWidth: 1,
        borderColor: theme.palette.primary.main,
        paddingX: 2,
        paddingTop: 1,
        paddingBottom: 1.5,
        ...sx,
      }}
    >
      {/* Variables */}
      <Typography variant="h6">Variables</Typography>
      {result.vars ? (
        <InputVariableOverview vars={result.vars} displayOnly></InputVariableOverview>
      ) : (
        <></>
      )}
      <Divider sx={{ mt: 1, mb: 1 }} />

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
          <InputVariablePaper displayOnly varName="Output" content={output}></InputVariablePaper>
        </Box>
      ) : (
        <></>
      )}
      <Divider sx={{ mt: 1, mb: 1 }} />

      {/* Grading Results */}
      <Typography variant="h6">Assertions</Typography>
      {gradingResults ? (
        <GradingResultOverview gradingResults={gradingResults}></GradingResultOverview>
      ) : (
        <></>
      )}
    </Box>
  )
}
export default ResultCard
