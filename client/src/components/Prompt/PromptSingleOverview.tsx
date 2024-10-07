"use client"

import React, { useState } from "react"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Paper from "@mui/material/Paper"
import Button from "@mui/material/Button"
import Divider from "@mui/material/Divider"
import { ExpandLess, ExpandMore } from "@mui/icons-material"
import { Prompt } from "@/api/apiSchemas"

interface PromptSingleOverviewProps {
  prompt: Prompt
}

const PromptSingleOverview: React.FC<PromptSingleOverviewProps> = ({ prompt }) => {
  const [showAllMessages, setShowAllMessages] = useState(false)

  const toggleShowAllMessages = () => {
    setShowAllMessages((prev) => !prev)
  }

  const MAX_VISIBLE_MESSAGES = 2

  if (!prompt) {
    return (
      <Box>
        <Typography>Prompt not found.</Typography>
      </Box>
    )
  }

  const messagesToDisplay = showAllMessages
    ? prompt.messages
    : prompt.messages.slice(0, MAX_VISIBLE_MESSAGES)

  return (
    <Box>
      {/* Prompt Name */}
      <Typography variant="h4">{"name goes here"}</Typography>

      {/* Creation Time */}
      <Typography>Created At: {new Date(prompt.creation_time).toLocaleString()}</Typography>

      <Divider />

      {/* Prompt Messages */}
      <Box>
        <Typography variant="h6">Prompt Messages</Typography>
        {prompt.messages.length === 0 ? (
          <Typography>No messages defined for this Prompt.</Typography>
        ) : (
          <Paper>
            {messagesToDisplay.map((message, index) => (
              <Box key={index} sx={{ padding: 2 }}>
                <Typography variant="subtitle1">
                  Role: {message.role.charAt(0).toUpperCase() + message.role.slice(1)}
                </Typography>
                <Typography variant="body1">{message.content}</Typography>
              </Box>
            ))}
          </Paper>
        )}
        {prompt.messages.length > MAX_VISIBLE_MESSAGES && (
          <Box textAlign="center" mt={1}>
            <Button
              onClick={toggleShowAllMessages}
              startIcon={showAllMessages ? <ExpandLess /> : <ExpandMore />}
            >
              {showAllMessages ? "Show Less" : "Show More"}
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default PromptSingleOverview
