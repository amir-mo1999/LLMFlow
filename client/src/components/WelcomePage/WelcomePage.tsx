"use client"

import React from "react"
import { Box, Typography, Button } from "@mui/material"
const WelcomePage: React.FC = () => {
  return (
    <Box
      width="100%"
      sx={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 5 }}
    >
      <Typography variant="h2" sx={{ mb: 3 }}>
        Welcome to the LMM Flow!
      </Typography>
      <Typography variant="h6" align="center" sx={{ mb: 5, width: 1000 }}>
        LLM Flow simplifies the process of working with AI models, starting from defining AI powered
        functions, fine tuning prompts and exposing external APIs to execute them. Enjoy a rich set
        of features ranging from validating LLM responses, evaluating prompts, comparing models, and
        many more!
      </Typography>
      <Box
        display="flex"
        sx={{ width: "100%", justifyContent: "space-evenly", alignItems: "center" }}
      >
        <Box width="20%">
          <Typography variant="h4" align="center" gutterBottom>
            AI Functions
          </Typography>
          <Typography align="center" variant="body1">
            {/* Placeholder text */}
            AI Functions represent contracts between your own business logic and an LLM provider,
            which are made robust through a set of assertions on the LLM output across example data.
            They allow to directly define the parameters of an AI use case and the expected output.
          </Typography>
        </Box>
        <Box width="20%">
          <Typography variant="h4" align="center" gutterBottom>
            Prompts
          </Typography>
          <Typography variant="body1" align="center">
            {/* Placeholder text */}
            Prompts sit at the core the core of any AI Function. They are responsible for making
            models understand your task. An AI Function&apos;s performance is directly linked to the
            quality of its prompts. Assess prompt quality across example data using the predefined
            assertion logic of the respective AI Function. Assertions can range from simple
            comparisons to complete Python or JavaScript scripts that define custom assertion logic.
          </Typography>
        </Box>

        <Box width="20%">
          <Typography variant="h4" align="center" gutterBottom>
            Projects
          </Typography>
          <Typography variant="body1" align="center">
            {/* Placeholder text */}
            Join different AI Functions together in Projects and make them directly accessible in
            your own applications through an automatically generated API.
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: "flex", marginTop: 8 }}>
        <Button variant="contained" color="primary" href="/ai-functions/create">
          Define your first AI Function 🚀
        </Button>
      </Box>
    </Box>
  )
}

export default WelcomePage
