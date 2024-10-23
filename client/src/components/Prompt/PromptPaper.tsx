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
  onClick?: () => void
}

const PromptPaper: React.FC<PromptPaperProps> = ({ sx, onClick, prompt }) => {
  const numberOfMessages: number = prompt.messages.length
  const meanScore = prompt.last_eval
    ? prompt.last_eval.results.reduce((acc, result) => acc + (result.score as number), 0) /
      prompt.last_eval.results.length
    : undefined

  const totalCost = prompt.last_eval
    ? prompt.last_eval.results.reduce((acc, result) => acc + (result.cost as number), 0)
    : undefined

  console.log(totalCost)
  return (
    <Paper onClick={onClick} elevation={2} sx={{ ...sx }}>
      <Box sx={{ display: "flex", alignItems: "center", marginBottom: 0.5 }}>
        <Typography variant="h6" sx={{ flex: 1 }}>
          {prompt.ai_function_name}
        </Typography>
        <DateChip isoString={prompt.creation_time} />
      </Box>
      <UserChip username={prompt.username} sx={{ marginRight: 10000, marginBottom: 2 }} />
      <NumberChip
        number={numberOfMessages}
        label={numberOfMessages === 1 ? "Message" : "Messages"}
        sx={{ marginRight: 2 }}
      />
      {meanScore === undefined ? (
        <CircularProgress size={20} />
      ) : (
        <NumberChip
          labelFirst
          number={meanScore}
          label="Score"
          sx={{ marginRight: 2 }}
          color={meanScore >= 0.8 ? "success" : meanScore >= 0.4 ? "warning" : "error"}
          variant="filled"
        />
      )}

      {totalCost === undefined ? (
        <CircularProgress size={20} />
      ) : (
        <NumberChip labelFirst number={totalCost} label="Cost" variant="filled" unit="$" />
      )}
    </Paper>
  )
}

export default PromptPaper
