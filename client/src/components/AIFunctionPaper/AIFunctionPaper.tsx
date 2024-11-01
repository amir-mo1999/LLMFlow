import React from "react"
import Typography from "@mui/material/Typography"
import Paper from "@mui/material/Paper"
import Box from "@mui/material/Box"
import { SxProps } from "@mui/material"
import { AIFunction } from "@/api/apiSchemas"
import { UserChip, NumberChip, DateChip, TextChip } from "../Chips"

interface AIFunctionPaperProps {
  sx?: SxProps
  aiFunction: AIFunction
  onClick?: () => void
  selected?: boolean
  disableHover?: boolean
}

const AIFunctionPaper: React.FC<AIFunctionPaperProps> = ({
  sx,
  onClick,
  aiFunction,
  selected = false,
  disableHover = false,
}) => {
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
        backgroundColor: selected ? "#E8E3F2" : "white",
        width: "100%",
        paddingX: 2,
        paddingTop: 1,
        paddingBottom: 1.5,
        maxHeight: 150,
        "&:hover": {
          backgroundColor: disableHover ? "white" : "#E8E3F2",
        },
        ...sx,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", marginBottom: 0.5 }}>
        <Typography variant="h6" sx={{ flex: 1 }}>
          {aiFunction.name}
        </Typography>
        <DateChip isoString={aiFunction.creation_time} />
      </Box>

      <UserChip username={aiFunction.username} sx={{ marginRight: 10000, mb: 1 }} />
      <Typography
        sx={{
          display: "-webkit-box",
          overflow: "hidden",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: 1,
          mb: 1,
        }}
      >
        {aiFunction.description}
      </Typography>

      <NumberChip
        number={aiFunction.input_variables.length}
        label="Variables"
        sx={{ marginRight: 2 }}
      />
      <NumberChip
        number={numberOfAssertions}
        label={numberOfAssertions === 1 ? "Assertion" : "Assertions"}
        sx={{ marginRight: 2 }}
      />
      <NumberChip
        number={aiFunction.number_of_prompts}
        label={aiFunction.number_of_prompts === 1 ? "Prompt" : "Prompts"}
        sx={{ marginRight: 2 }}
      />
      <TextChip label={aiFunction.output_schema.type === "string" ? "string" : "json"} />
    </Paper>
  )
}

export default AIFunctionPaper
