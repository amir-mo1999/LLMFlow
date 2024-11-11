import { EvaluateResult } from "@/api/apiSchemas"
import { SxProps } from "@mui/material"
import { InputVariablePaper, InputVariableOverview } from "@/components"
import Typography from "@mui/material/Typography"
import React, { useState } from "react"
import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"
import GradingResultOverview from "./GradingResultOverview"
import Divider from "@mui/material/Divider"
import Collapse from "@mui/material/Collapse"
import ExpandLessIcon from "@mui/icons-material/ExpandLess"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import { NumberChip } from "@/components"
import IconButton from "@mui/material/IconButton"

import { useTheme } from "@mui/material"

interface ResultCardProps {
  result: EvaluateResult
  index: number
  sx?: SxProps
}

const ResultCard: React.FC<ResultCardProps> = ({ result, index, sx }) => {
  const theme = useTheme()

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

  const [open, setOpen] = useState(false)
  const handleCollapse = () => {
    setOpen(!open)
  }
  return (
    <Box
      sx={{
        borderRadius: 1,
        borderWidth: 1,
        borderColor: theme.palette.primary.main,
        paddingX: 2,
        paddingY: 1,
        display: "flex",
        flexDirection: "column",
        ...sx,
      }}
    >
      <Box display="flex" justifyContent="space-between" onClick={handleCollapse}>
        <Grid
          columnGap={2}
          container
          sx={{ alignItems: "center", mt: 0, width: 550 }}
          direction={"row"}
        >
          <Grid>
            <Typography sx={{ color: theme.palette.primary.main }} noWrap variant="h6">
              # {index}
            </Typography>
          </Grid>

          {cost !== undefined && (
            <Grid xs>
              <NumberChip labelFirst number={cost} label="Cost" unit="$" />
            </Grid>
          )}
          {score !== undefined && (
            <Grid xs>
              <NumberChip
                labelFirst
                number={score as number}
                label="Score"
                color={score >= 0.8 ? "success" : score >= 0.4 ? "warning" : "error"}
                variant="filled"
              />
            </Grid>
          )}
          <Grid xs>
            <NumberChip labelFirst number={latency} label="Latency" unit="ms" />
          </Grid>
        </Grid>
        <IconButton onClick={handleCollapse}>
          {open ? <ExpandLessIcon fontSize="medium" /> : <ExpandMoreIcon fontSize="medium" />}
        </IconButton>
      </Box>

      <Collapse in={open}>
        <Box sx={{ my: 1 }}>
          <Divider sx={{ m: 1 }} />
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
          <Divider sx={{ m: 1 }} />
          {/* Grading Results */}
          <Typography variant="h6">Assertions</Typography>
          {gradingResults ? (
            <GradingResultOverview gradingResults={gradingResults}></GradingResultOverview>
          ) : (
            <></>
          )}
        </Box>
      </Collapse>
    </Box>
  )
}
export default ResultCard
