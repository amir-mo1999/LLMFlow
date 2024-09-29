"use client"

import React, { useState } from "react"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import Divider from "@mui/material/Divider"
import { ExpandLess, ExpandMore } from "@mui/icons-material"
import PromptPaper from "./PromptPaper"
import { useDeletePrompt } from "@/api/apiComponents"
import { Prompt } from "@/api/apiSchemas"

interface PromptOverviewProps {
  prompts: Prompt[]
  setPrompts: React.Dispatch<React.SetStateAction<Prompt[]>>
}

const PromptOverview: React.FC<PromptOverviewProps> = ({ prompts, setPrompts }) => {
  const [showAllPrompts, setShowAllPrompts] = useState(false)
  const MAX_VISIBLE_PROMPTS = 3

  const toggleShowAllPrompts = () => {
    setShowAllPrompts((prev) => !prev)
  }

  const { mutate: deletePrompt, error } = useDeletePrompt({})

  const onDeletePrompt = (promptID: string) => {
    const updatedPrompts = prompts.filter((prompt) => (prompt._id as string) !== promptID)
    setPrompts([...updatedPrompts])
    deletePrompt({ pathParams: { promptId: promptID } })
  }

  return (
    <Box sx={{ marginTop: 4 }}>
      <Typography variant="h5" gutterBottom>
        Prompts
      </Typography>
      {prompts.length === 0 ? (
        <Typography variant="body2">No prompts defined for this AI Function.</Typography>
      ) : (
        <>
          {prompts
            .slice(0, showAllPrompts ? prompts.length : MAX_VISIBLE_PROMPTS)
            .map((prompt, index) => (
              <PromptPaper key={index} prompt={prompt} onDeletePrompt={onDeletePrompt} />
            ))}
          {prompts.length > MAX_VISIBLE_PROMPTS && (
            <Box textAlign="center">
              <Button
                onClick={toggleShowAllPrompts}
                startIcon={showAllPrompts ? <ExpandLess /> : <ExpandMore />}
              >
                {showAllPrompts ? "Show Less" : "Show More"}
              </Button>
            </Box>
          )}
        </>
      )}
      <Divider sx={{ marginTop: 2 }} />
    </Box>
  )
}

export default PromptOverview
