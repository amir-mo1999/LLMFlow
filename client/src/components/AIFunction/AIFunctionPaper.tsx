import React from "react"
import Typography from "@mui/material/Typography"
import Paper from "@mui/material/Paper"
import Box from "@mui/material/Box"
import { SxProps } from "@mui/material"
import { AIFunction } from "@/api/apiSchemas"
import { UserChip, NumberChip, DateChip } from "../Chips"

interface AIFunctionPaperProps {
  sx?: SxProps
  aiFunction: AIFunction
  onClick?: () => void
}

const AIFunctionPaper: React.FC<AIFunctionPaperProps> = ({ sx, onClick, aiFunction }) => {
  // get total number of assertions
  let numberOfAssertions: number = 0
  numberOfAssertions += aiFunction.assert.length
  aiFunction.test_cases.forEach((testCase) => {
    if (testCase.assert !== null) numberOfAssertions += testCase.assert.length
  })

  return (
    <Paper
      onClick={onClick}
      elevation={2}
      sx={{
        ...sx,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", marginBottom: 0.5 }}>
        <Typography variant="h6" sx={{ flex: 1 }}>
          {aiFunction.name}
        </Typography>
        <DateChip isoString={aiFunction.creation_time} />
      </Box>
      <UserChip username={aiFunction.username} sx={{ marginRight: 10000, marginBottom: 2 }} />
      <NumberChip
        number={aiFunction.input_variables.length}
        label="Variables"
        sx={{ marginRight: 2 }}
      />
      <NumberChip number={numberOfAssertions} label="Assertions" sx={{ marginRight: 2 }} />
      <NumberChip number={aiFunction.number_of_prompts} label="Prompts" />
    </Paper>
  )
}

export default AIFunctionPaper
