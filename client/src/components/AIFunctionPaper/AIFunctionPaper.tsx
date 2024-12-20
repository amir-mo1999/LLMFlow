import React from "react"
import Typography from "@mui/material/Typography"
import Paper from "@mui/material/Paper"
import Box from "@mui/material/Box"
import Stack from "@mui/material/Stack"
import { SxProps } from "@mui/material"
import { AIFunction } from "@/api/apiSchemas"
import { UserChip, NumberChip, DateChip, TextChip, ItemTypeChip } from "../Chips"
import Tooltip from "@mui/material/Tooltip"

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
        "&:hover": {
          backgroundColor: disableHover ? "white" : "#E8E3F2",
        },
        ...sx,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", marginBottom: 0.5 }}>
        <Box sx={{ display: "flex", flex: 1, alignItems: "center", gap: 1, maxWidth: "80%" }}>
          <ItemTypeChip itemType="AI Function" />
          <Tooltip title={aiFunction.name} placement="top">
            <Typography
              variant="h6"
              noWrap
              sx={{ whiteSpace: "noWrap", textOverflow: "ellipsis" }}
              maxHeight={50}
            >
              {aiFunction.name}
            </Typography>
          </Tooltip>
        </Box>

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

      <Stack
        direction="row"
        columnGap={2}
        mb={1}
        rowGap={1}
        flexWrap="wrap"
        justifyContent="flex-start"
        alignItems="start"
      >
        <NumberChip number={aiFunction.input_variables.length} label="Variables" />
        <NumberChip
          number={numberOfAssertions}
          label={numberOfAssertions === 1 ? "Assertion" : "Assertions"}
        />
        <NumberChip
          number={aiFunction.number_of_prompts}
          label={aiFunction.number_of_prompts === 1 ? "Prompt" : "Prompts"}
        />
        <TextChip label={aiFunction.output_schema.type === "string" ? "string" : "json"} />
        <NumberChip
          number={aiFunction.providers.length}
          label={aiFunction.providers.length === 1 ? "Provider" : "Providers"}
        />
      </Stack>
    </Paper>
  )
}

export default AIFunctionPaper
