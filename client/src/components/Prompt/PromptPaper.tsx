"use client"

import React, { useState } from "react"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import Collapse from "@mui/material/Collapse"
import Paper from "@mui/material/Paper"
import Button from "@mui/material/Button"
import { ExpandLess, ExpandMore } from "@mui/icons-material"
import { Prompt } from "@/api/apiSchemas"

interface PromptPaperProps {
  prompt: Prompt
}

const PromptPaper: React.FC<PromptPaperProps> = ({ prompt }) => {
  const [open, setOpen] = useState(false)

  const toggleOpen = () => {
    setOpen((prev) => !prev)
  }

  return (
    <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">
          Prompt Type: {prompt.prompt_type.replace("-", " ").toUpperCase()}
        </Typography>
        <Button onClick={toggleOpen} startIcon={open ? <ExpandLess /> : <ExpandMore />}>
          {open ? "Hide Messages" : "Show Messages"}
        </Button>
      </Box>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <Box mt={2}>
          <List>
            {prompt.messages.map((message, index) => (
              <ListItem key={index} alignItems="flex-start">
                <ListItemText
                  primary={
                    <Typography variant="subtitle2" color="textSecondary">
                      Role: {message.role.charAt(0).toUpperCase() + message.role.slice(1)}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body1" color="textPrimary">
                      {message.content}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Collapse>
    </Paper>
  )
}

export default PromptPaper
