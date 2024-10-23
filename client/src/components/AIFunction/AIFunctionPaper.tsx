import React from "react"
import Typography from "@mui/material/Typography"
import Paper from "@mui/material/Paper"
import { SxProps } from "@mui/material"
import { AIFunction } from "@/api/apiSchemas"
import { toZonedTime } from "date-fns-tz"
import { format } from "date-fns"

interface AIFunctionPaperProps {
  sx?: SxProps
  aiFunction: AIFunction
  onClick?: () => void
}

const AIFunctionPaper: React.FC<AIFunctionPaperProps> = ({ sx, onClick, aiFunction }) => {
  const timeZone = "Europe/Berlin"
  const utcDate = new Date(aiFunction.creation_time)
  const zonedDate = toZonedTime(utcDate, timeZone)

  // get total number of assertions
  let numberOfAssertions: number = 0
  numberOfAssertions += aiFunction.assert.length
  aiFunction.test_cases.forEach((testCase) => {
    if (testCase.assert !== null) numberOfAssertions += testCase.assert.length
  })

  const formattedDate = format(zonedDate, "dd/MM/yyyy")

  return (
    <Paper
      onClick={onClick}
      elevation={2}
      sx={{
        ...sx,
      }}
    >
      <Typography variant="h6" gutterBottom>
        {aiFunction.name}
      </Typography>
      <Typography variant="caption" display="block">
        {formattedDate}
      </Typography>
      <Typography variant="caption" display="block" gutterBottom>
        <strong>Input Variables:</strong> {numberOfAssertions}
      </Typography>
      <Typography variant="caption" display="block" gutterBottom>
        <strong>Assertions:</strong> {aiFunction.input_variables.length}
      </Typography>
      <Typography variant="caption" display="block" gutterBottom>
        <strong>Prompts:</strong> {aiFunction.number_of_prompts}
      </Typography>
    </Paper>
  )
}

export default AIFunctionPaper
