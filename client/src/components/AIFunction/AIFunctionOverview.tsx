"use client"
import React, { useEffect } from "react"
import { Paper, Typography, Grid } from "@mui/material"
import { useGetAiFunctions } from "@/api/apiComponents"
import { AIFunction } from "@/api/apiSchemas"
import { format } from "date-fns"
import { toZonedTime } from "date-fns-tz"
import { useRouter } from "next/navigation"

const AIFunctionOverview: React.FC = () => {
  const router = useRouter()

  const { data: aiFunctions, error } = useGetAiFunctions({})
  useEffect(() => console.log(error), [error])

  if (!aiFunctions) return <></>

  return (
    <Grid container spacing={2}>
      {aiFunctions.map((aiFunction: AIFunction) => {
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
            if (typeof aiFunctionID === "string") router.push(`/ai-function/${aiFunctionID}`)
          }
          return f
        }
        return (
          <Grid item xs={12} sm={6} md={4} key={aiFunction._id}>
            <Paper onClick={redirectOnClick(aiFunction._id)} elevation={3} sx={{ padding: "16px" }}>
              <Typography variant="h6" gutterBottom>
                {aiFunction.name}
              </Typography>
              <Typography variant="caption" display="block">
                {formattedDate}
              </Typography>
              <Typography variant="body2" gutterBottom>
                {aiFunction.description}
              </Typography>
              <Typography variant="caption" display="block" gutterBottom>
                <strong>Assertions:</strong> {numberOfAssertions}
              </Typography>
              <Typography variant="caption" display="block" gutterBottom>
                <strong>Prompts:</strong> {aiFunction.number_of_prompts}
              </Typography>
            </Paper>
          </Grid>
        )
      })}
    </Grid>
  )
}

export default AIFunctionOverview
