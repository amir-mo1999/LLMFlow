"use client"

import React from "react"
import Box from "@mui/material/Box"
import { Prompt } from "@/api/apiSchemas"
import PromptPaper from "./PromptPaper"

interface PromptOverviewProps {
  prompts: Prompt[]
  onClick: (indx: number) => () => void
  promptNumbers: number[]
}

const PromptOverview: React.FC<PromptOverviewProps> = ({ prompts, onClick, promptNumbers }) => {
  if (!prompts) return <></>
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        paddingY: 2,
      }}
    >
      {prompts.map((prompt, indx) => {
        return (
          <PromptPaper
            sx={{
              width: "100%",
              paddingX: 2,
              paddingTop: 1,
              paddingBottom: 1.5,
              maxHeight: 150,
            }}
            key={indx}
            promptNumber={promptNumbers[indx]}
            prompt={prompt}
            onClick={onClick ? onClick(indx) : undefined}
          ></PromptPaper>
        )
      })}
    </Box>
  )
}

export default PromptOverview
