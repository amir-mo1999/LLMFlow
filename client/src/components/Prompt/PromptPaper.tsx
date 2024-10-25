import React from "react"
import Typography from "@mui/material/Typography"
import Paper from "@mui/material/Paper"
import { SxProps } from "@mui/material"
import { Prompt } from "@/api/apiSchemas"
import CircularProgress from "@mui/material/CircularProgress"
import { UserChip, NumberChip, DateChip } from "../Chips"
import { getMeanLatency, getMeanScore, getTotalCost } from "@/utils"
import Box from "@mui/material/Box"
import Stack from "@mui/material/Stack"

interface PromptPaperProps {
  sx?: SxProps
  prompt: Prompt
  promptNumber: number
  onClick?: () => void
}

const PromptPaper: React.FC<PromptPaperProps> = ({ sx, onClick, prompt, promptNumber }) => {
  const numberOfMessages: number = prompt.messages.length

  const renderFigures = () => {
    if (!prompt.last_eval) {
      return (
        <NumberChip
          number={numberOfMessages}
          label={numberOfMessages === 1 ? "Message" : "Messages"}
          sx={{ mr: 1 }}
        />
      )
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

        <NumberChip
          labelFirst
          number={meanLatency as number}
          label="Latency"
          unit="ms"
          sx={{ mb: 1 }}
        />
      </>
    )
  }

  return (
    <Paper onClick={onClick} elevation={2} sx={{ ...sx }}>
      <Box sx={{ display: "flex", alignItems: "center", marginBottom: 0.5 }}>
        <Typography variant="h6" sx={{ flex: 1 }}>
          {prompt.ai_function_name} #{promptNumber}
        </Typography>
        <DateChip isoString={prompt.creation_time} />
      </Box>
      <UserChip username={prompt.username} sx={{ marginRight: 10000, marginBottom: 2 }} />

      {renderFigures()}
    </Paper>
  )
}

export default PromptPaper
