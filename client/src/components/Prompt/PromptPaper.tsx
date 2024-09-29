"use client"

import React, { useState, Dispatch, SetStateAction } from "react"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import Collapse from "@mui/material/Collapse"
import Paper from "@mui/material/Paper"
import Button from "@mui/material/Button"
import DeleteIcon from "@mui/icons-material/Delete"
import { ExpandLess, ExpandMore } from "@mui/icons-material"
import { Prompt, EvaluateResult } from "@/api/apiSchemas"
import { useDeletePrompt, useGetPrompts } from "@/api/apiComponents"

interface PromptPaperProps {
  prompt: Prompt
  onDeletePrompt: (promptID: string) => void
}

const PromptPaper: React.FC<PromptPaperProps> = ({ prompt, onDeletePrompt }) => {
  const [open, setOpen] = useState(false)

  const toggleOpen = () => {
    setOpen((prev) => !prev)
  }

  const { mutate: deletePrompt, error } = useDeletePrompt({})

  const getAverageScore = (results: EvaluateResult[]) => {
    let avgScore: number = 0

    results.forEach((result) => (avgScore += result.score ? result.score : 0))

    avgScore /= results.length

    return avgScore.toPrecision(3)
  }

  return (
    <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography>Prompt Type: {prompt.prompt_type.replace("_", " ")}</Typography>
        <Typography>
          Score: {prompt.last_eval && getAverageScore(prompt.last_eval.results)}
        </Typography>
        <Button onClick={toggleOpen}>{open ? <ExpandLess /> : <ExpandMore />}</Button>
        <Button onClick={() => onDeletePrompt(prompt._id as string)}>
          <DeleteIcon />
        </Button>
      </Box>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <Box mt={2}>
          <List>
            {prompt.messages.map((message, index) => (
              <ListItem key={index} alignItems="flex-start">
                <ListItemText
                  primary={
                    <>
                      <Typography>
                        Role: {message.role.charAt(0).toUpperCase() + message.role.slice(1)}
                      </Typography>
                      <Typography>{message.content}</Typography>
                    </>
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
