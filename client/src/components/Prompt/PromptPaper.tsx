import React from "react"
import Typography from "@mui/material/Typography"
import Paper from "@mui/material/Paper"
import { SxProps } from "@mui/material"
import { Prompt } from "@/api/apiSchemas"
import LinearProgress from "@mui/material/LinearProgress"
import { UserChip, NumberChip, DateChip, TextChip } from "../Chips"
import { getMeanLatency, getMeanScore, getTotalCost } from "@/utils"
import Box from "@mui/material/Box"
import Stack from "@mui/material/Stack"

interface PromptPaperProps {
  sx?: SxProps
  prompt: Prompt
  onClick?: () => void
  selected: boolean
}

const PromptPaper: React.FC<PromptPaperProps> = ({
  sx,
  onClick,
  prompt,
  selected = false,
}) => {
  const numberOfMessages: number = prompt.messages.length

  const renderFigures = () => {
    if (!prompt.last_eval) {
      return <LinearProgress sx={{ display: prompt.revision_required ? "none" : "normal" }} />
    }

    const meanScore = getMeanScore(prompt.last_eval)
    const totalCost = getTotalCost(prompt.last_eval)
    const meanLatency = getMeanLatency(prompt.last_eval)

    return (
      <>
        <Stack direction="row" spacing={2} mb={1}>
          <NumberChip
            number={numberOfMessages}
            label={numberOfMessages === 1 ? "Message" : "Messages"}
          />
          <NumberChip labelFirst number={totalCost} label="Cost" unit="$" />
          <NumberChip
            labelFirst
            number={meanScore as number}
            label="Score"
            color={meanScore >= 0.8 ? "success" : meanScore >= 0.4 ? "warning" : "error"}
            variant="filled"
          />
        </Stack>
        <Stack direction="row" spacing={2} mb={1}>
          <NumberChip labelFirst number={meanLatency as number} label="Latency" unit="ms" />
        </Stack>
      </>
    )
  }

  return (
    <Paper
      onClick={onClick}
      elevation={2}
      sx={{ backgroundColor: selected ? "#E8E3F2" : "white", ...sx }}
    >
      <Box sx={{ display: "flex", alignItems: "center", marginBottom: 0.5 }}>
        <Typography variant="h6" sx={{ flex: 1 }}>
          {prompt.ai_function_name} #{prompt.index}
        </Typography>
        <DateChip isoString={prompt.creation_time} />
      </Box>
      <Stack direction="row" mb={2} spacing={2}>
        <UserChip username={prompt.username} />
        <TextChip
          sx={{ display: prompt.revision_required ? "normal" : "none" }}
          label="revision required"
          color="warning"
          variant="filled"
        />
      </Stack>

      {renderFigures()}
    </Paper>
  )
}

export default PromptPaper
