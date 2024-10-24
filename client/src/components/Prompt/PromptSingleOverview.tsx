"use client"

import React, { useState } from "react"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Paper from "@mui/material/Paper"
import Button from "@mui/material/Button"
import Divider from "@mui/material/Divider"
import Collapse from "@mui/material/Collapse"
import { ExpandLess, ExpandMore } from "@mui/icons-material"
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

  const [showAllMessages, setShowAllMessages] = useState(false)
  const MAX_VISIBLE_MESSAGES = 2

  const handleToggleMessages = () => {
    setShowAllMessages((prev) => !prev)
  }

  const messagesToDisplay = showAllMessages
    ? prompt.messages
    : prompt.messages.slice(0, MAX_VISIBLE_MESSAGES)

  const extraMessages = showAllMessages ? [] : prompt.messages.slice(MAX_VISIBLE_MESSAGES)
  {
    console.log(prompt.messages[0].content)
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
        <Typography variant="h6">Messages</Typography>
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
            {messagesToDisplay.map((message, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Typography variant="subtitle1">
                  <strong>{message.role.charAt(0).toUpperCase() + message.role.slice(1)}</strong>
                </Typography>
                <Typography variant="body1">{message.content}</Typography>
              </Box>
            ))}

            {extraMessages.length > 0 && (
              <Collapse in={showAllMessages} timeout="auto" unmountOnExit>
                {extraMessages.map((message, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Typography variant="subtitle1">
                      Role: {message.role.charAt(0).toUpperCase() + message.role.slice(1)}
                    </Typography>
                    <Typography variant="body1">{message.content}</Typography>
                  </Box>
                ))}
              </Collapse>
            )}

            {prompt.messages.length > MAX_VISIBLE_MESSAGES && (
              <Box textAlign="center">
                <Button
                  onClick={handleToggleMessages}
                  startIcon={showAllMessages ? <ExpandLess /> : <ExpandMore />}
                >
                  {showAllMessages ? "Show Less" : "Show More"}
                </Button>
              </Box>
            )}
          </Paper>
        )}
      </Box>

      {/* Evaluation Results Section */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">Evaluation Results</Typography>
        {/* Future implementation of Evaluation Results */}
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
