import React from "react"
import Typography from "@mui/material/Typography"
import Paper from "@mui/material/Paper"
import { SxProps } from "@mui/material"
import { Prompt } from "@/api/apiSchemas"
import CircularProgress from "@mui/material/CircularProgress"
import { UserChip, NumberChip, DateChip } from "../Chips"
import Box from "@mui/material/Box"

interface PromptPaperProps {
  sx?: SxProps
  prompt: Prompt
  promptNumber: number
  onClick?: () => void
}

const PromptPaper: React.FC<PromptPaperProps> = ({ sx, onClick, prompt, promptNumber }) => {
  const numberOfMessages: number = prompt.messages.length
  let meanScore: number | undefined = undefined
  let totalCost: number | undefined = undefined

  if (prompt.last_eval) {
    meanScore =
      prompt.last_eval.results.reduce((acc, result) => acc + (result.score as number), 0) /
      prompt.last_eval.results.length
    totalCost = prompt.last_eval.results.reduce((acc, result) => acc + (result.cost as number), 0)

    meanScore = Math.round(meanScore * 100) / 100

    totalCost = Math.round(totalCost * 100000000) / 100000000
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
      <NumberChip
        number={numberOfMessages}
        label={numberOfMessages === 1 ? "Message" : "Messages"}
        sx={{ marginRight: 2 }}
      />
      {prompt.last_eval && totalCost !== undefined && meanScore !== undefined ? (
        <>
          <NumberChip sx={{ marginRight: 2 }} labelFirst number={totalCost} label="Cost" unit="$" />
          <NumberChip
            labelFirst
            number={meanScore as number}
            label="Score"
            color={meanScore >= 0.8 ? "success" : meanScore >= 0.4 ? "warning" : "error"}
            variant="filled"
          />
        </>
      ) : (
        <CircularProgress size={20} />
      )}
    </Paper>
  )
}

export default PromptPaper
