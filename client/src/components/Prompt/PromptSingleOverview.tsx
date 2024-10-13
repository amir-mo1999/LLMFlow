"use client"

import React, { useState } from "react"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Paper from "@mui/material/Paper"
import Button from "@mui/material/Button"
import Divider from "@mui/material/Divider"
import { ExpandLess, ExpandMore } from "@mui/icons-material"
import { Prompt } from "@/api/apiSchemas"
import { useDeletePrompt } from "@/api/apiComponents"

interface PromptSingleOverviewProps {
  prompt: Prompt
  deletePrompt: (prompt: Prompt) => void
}

const PromptSingleOverview: React.FC<PromptSingleOverviewProps> = ({ prompt, deletePrompt }) => {
  const { mutate: deletePromptAPI } = useDeletePrompt({
    onSuccess: () => {
      deletePrompt(prompt)
    },
    onError: (err) => {},
  })

  const onClickDelete = () => {
    deletePromptAPI({ pathParams: { promptId: prompt._id as string } })
  }

  if (!prompt) {
    return (
      <Box>
        <Typography>Prompt not found.</Typography>
      </Box>
    )
  }
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
            {prompt.messages.map((message, index) => (
              <Box key={index} sx={{ padding: 2 }}>
                <Typography variant="subtitle1">
                  Role: {message.role.charAt(0).toUpperCase() + message.role.slice(1)}
                </Typography>
                <Typography variant="body1">{message.content}</Typography>
              </Box>
            ))}
          </Paper>
        )}
      </Box>
      <Button variant="contained" color="error" onClick={onClickDelete}>
        Delete Prompt
      </Button>
    </Box>
  )
}

export default PromptSingleOverview
