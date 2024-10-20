"use client"

import React from "react"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Paper from "@mui/material/Paper"
import { Prompt } from "@/api/apiSchemas" // Assume this interface is defined appropriately
import { format } from "date-fns"
import { toZonedTime } from "date-fns-tz"
import CircularProgress from "@mui/material/CircularProgress"

interface PromptOverviewProps {
  selectedPromptIndx: number | undefined
  setSelectedPromptIndx: React.Dispatch<React.SetStateAction<number | undefined>>
  prompts: Prompt[]
  onClick: (indx: number) => void
}

const PromptOverview: React.FC<PromptOverviewProps> = ({
  selectedPromptIndx,
  setSelectedPromptIndx,
  prompts,
  onClick,
}) => {
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
        // Convert UTC to Central European Time
        const timeZone = "Europe/Berlin"
        const utcDate = new Date(prompt.creation_time)
        const zonedDate = toZonedTime(utcDate, timeZone)

        // Calculate the number of messages
        const numberOfMessages: number = prompt.messages.length

        // Format the date to 'dd/MM/yyyy'
        const formattedDate = format(zonedDate, "dd/MM/yyyy")

        return (
          <Paper
            key={indx}
            onClick={()=>onClick(indx)}
            elevation={2}
            sx={{
              paddingX: "10px",
              paddingTop: "10px",
              width: "100%",
              height: 150,
            }}
          >
            <Typography variant="h6">{"Prompt name goes here"}</Typography>
            <Typography>{formattedDate}</Typography>
            <Typography>
              <strong>Messages:</strong> {numberOfMessages}
            </Typography>
            <Typography>Score</Typography>
            {prompt.last_eval ? (
              <Typography>
                {prompt.last_eval.results.reduce(
                  (acc, result) => acc + (result.score as number),
                  0
                ) / prompt.last_eval.results.length}
              </Typography>
            ) : (
              <CircularProgress size={20} />
            )}
          </Paper>
        )
      })}
    </Box>
  )
}

export default PromptOverview
