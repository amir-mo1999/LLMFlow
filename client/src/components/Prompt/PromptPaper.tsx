import React from "react"
import Typography from "@mui/material/Typography"
import Paper from "@mui/material/Paper"
import { SxProps } from "@mui/material"
import { Prompt } from "@/api/apiSchemas"
import { toZonedTime } from "date-fns-tz"
import { format } from "date-fns"
import CircularProgress from "@mui/material/CircularProgress"

interface PromptPaperProps {
  sx?: SxProps
  prompt: Prompt
  onClick?: () => void
}

const PromptPaper: React.FC<PromptPaperProps> = ({ sx, onClick, prompt }) => {
  // Convert UTC to Central European Time
  const timeZone = "Europe/Berlin"
  const utcDate = new Date(prompt.creation_time)
  const zonedDate = toZonedTime(utcDate, timeZone)

  // Calculate the number of messages
  const numberOfMessages: number = prompt.messages.length

  // Format the date to 'dd/MM/yyyy'
  const formattedDate = format(zonedDate, "dd/MM/yyyy")

  return (
    <Paper onClick={onClick} elevation={2} sx={{ ...sx }}>
      <Typography variant="h6">{"Prompt name goes here"}</Typography>
      <Typography>{formattedDate}</Typography>
      <Typography>
        <strong>Messages:</strong> {numberOfMessages}
      </Typography>
      <Typography>Score</Typography>
      {prompt.last_eval ? (
        <Typography>
          {prompt.last_eval.results.reduce((acc, result) => acc + (result.score as number), 0) /
            prompt.last_eval.results.length}
        </Typography>
      ) : (
        <CircularProgress size={20} />
      )}
    </Paper>
  )
}

export default PromptPaper
