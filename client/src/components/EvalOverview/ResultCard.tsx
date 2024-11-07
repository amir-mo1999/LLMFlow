import { EvaluateResult } from "@/api/apiSchemas"
import { SxProps } from "@mui/material"
import theme from "@/theme"
import { InputVariablePaper, InputVariableOverview } from "@/components"
import Typography from "@mui/material/Typography"
import React from "react"
import Box from "@mui/material/Box"
import GradingResultOverview from "./GradingResultOverview"
import Divider from "@mui/material/Divider"
import Stack from "@mui/material/Stack"
import { NumberChip } from "../Chips"

interface ResultCardProps {
  result: EvaluateResult
  sx?: SxProps
}

const ResultCard: React.FC<ResultCardProps> = ({ result, sx }) => {
  const output = result.response?.output
  const gradingResults = result.gradingResult?.componentResults
  const score =
    result.score !== undefined && result.score !== null
      ? Math.round(result.score * 100) / 100
      : undefined
  const cost =
    result.cost !== undefined && result.cost !== null
      ? Math.round(result.cost * 100000000) / 100000000
      : undefined
  const latency = result.latencyMs
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
      <Divider sx={{ m: 1 }} />

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
            sx={{ maxHeight: 500 }}
            content={output}
          ></InputVariablePaper>
        </Box>
      ) : (
        <></>
      )}
      {/* Stats */}

      <Divider sx={{ m: 1 }} />
      <Typography variant="h6" gutterBottom>
        Stats
      </Typography>
      <Stack direction="row" spacing={2}>
        {cost && <NumberChip labelFirst number={cost} label="Cost" unit="$" />}{" "}
        {score && (
          <NumberChip
            labelFirst
            number={score as number}
            label="Score"
            color={score >= 0.8 ? "success" : score >= 0.4 ? "warning" : "error"}
            variant="filled"
          />
        )}
        <NumberChip labelFirst number={latency} label="Latency" unit="ms" />
      </Stack>

      <Divider sx={{ m: 1 }} />

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
