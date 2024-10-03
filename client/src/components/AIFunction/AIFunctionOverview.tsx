"use client"
import React from "react"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Paper from "@mui/material/Paper"
import { AIFunction } from "@/api/apiSchemas"
import { format } from "date-fns"
import { toZonedTime } from "date-fns-tz"
import { useRouter } from "next/navigation"

interface AIFunctionOverviewProps {
  aiFunctions: AIFunction[]
}

const AIFunctionOverview: React.FC<AIFunctionOverviewProps> = ({ aiFunctions }) => {
  const router = useRouter()

  if (!aiFunctions) return <></>

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
      {aiFunctions.map((aiFunction, indx) => {
        // Convert UTC to Central European Time //TODO: set timezone globally some where
        const timeZone = "Europe/Berlin"
        const utcDate = new Date(aiFunction.creation_time)
        const zonedDate = toZonedTime(utcDate, timeZone)

        // get total number of assertions
        let numberOfAssertions: number = 0
        numberOfAssertions += aiFunction.assert.length
        aiFunction.test_cases.forEach((testCase) => {
          if (testCase.assert !== null) numberOfAssertions += testCase.assert.length
        })

        // Format the date to 'dd/MM/yyyy'
        const formattedDate = format(zonedDate, "dd/MM/yyyy")

        const redirectOnClick = (aiFunctionID: string | null | undefined) => {
          const f = () => {
            if (typeof aiFunctionID === "string") router.push(`/ai-functions/${aiFunctionID}`)
          }
          return f
        }
        return (
          <Paper
            key={indx}
            onClick={redirectOnClick(aiFunction._id)}
            elevation={3}
            sx={{
              borderRadius: 5,
              paddingX: "10px",
              paddingTop: "10px",
              width: "100%",
              height: 150,
            }}
          >
            <Typography variant="h6" gutterBottom>
              {aiFunction.name}
            </Typography>
            <Typography variant="caption" display="block">
              {formattedDate}
            </Typography>
            <Typography variant="caption" display="block" gutterBottom>
              <strong>Input Variables:</strong> {numberOfAssertions}
            </Typography>
            <Typography variant="caption" display="block" gutterBottom>
              <strong>Assertions:</strong> {aiFunction.input_variables.length}
            </Typography>
            <Typography variant="caption" display="block" gutterBottom>
              <strong>Prompts:</strong> {aiFunction.number_of_prompts}
            </Typography>
          </Paper>
        )
      })}
    </Box>
  )
}

export default AIFunctionOverview
