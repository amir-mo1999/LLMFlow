"use client"

import React, { useState } from "react"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Paper from "@mui/material/Paper"
import Button from "@mui/material/Button"
import Divider from "@mui/material/Divider"
import { Prompt } from "@/api/apiSchemas"
import { useDeletePrompt } from "@/api/apiComponents"
import EvalOverview from "./EvalOverview"

interface PromptSingleOverviewProps {
  prompt: Prompt
  onDelete: () => void
}

const options: Intl.DateTimeFormatOptions = {
  timeZone: "Europe/Berlin",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
}

const PromptSingleOverview: React.FC<PromptSingleOverviewProps> = ({ prompt, onDelete }) => {
  const [disableDelete, setDisableDelete] = useState(false)
  const { mutate: deletePromptAPI } = useDeletePrompt({
    onSuccess: () => {
      onDelete()
    },
  })

  const handleDelete = () => {
    setDisableDelete(true)
    deletePromptAPI({ pathParams: { promptId: prompt._id as string } })
  }

  return (
    <Box width="100%">
      {/* Prompt Name */}
      <Typography variant="h4">{prompt.ai_function_name}</Typography>

      {/* Creation Time */}
      <Typography>{new Date(prompt.creation_time).toLocaleString("de-DE", options)}</Typography>

      <Divider />

      {/* Prompt Messages */}
      <Box sx={{ mt: 2 }}>
        <Typography variant="h5">Messages</Typography>
        {prompt.messages.length === 0 ? (
          <Typography>No messages defined for this Prompt.</Typography>
        ) : (
          <Paper
            sx={{
              padding: 2,
              mt: 1,
              "&:hover": {
                backgroundColor: "#ffffff",
              },
            }}
          >
            {prompt.messages.map((message, index) => (
              <Box key={index}>
                <Typography variant="subtitle1">
                  <strong>{message.role.charAt(0).toUpperCase() + message.role.slice(1)}</strong>
                </Typography>
                <Typography variant="body1">{message.content}</Typography>
              </Box>
            ))}
          </Paper>
        )}
      </Box>

      {/* Evaluation Results Section */}
      <Box mt={2}>
        <Typography variant="h5">Evaluation Results</Typography>
        {prompt.last_eval ? <EvalOverview evalResult={prompt.last_eval}></EvalOverview> : <></>}
      </Box>

      {/* Delete Prompt Button */}
      <Box sx={{ mt: 4 }}>
        <Button variant="contained" color="error" onClick={handleDelete} disabled={disableDelete}>
          Delete Prompt
        </Button>
      </Box>
    </Box>
  )
}

export default PromptSingleOverview
