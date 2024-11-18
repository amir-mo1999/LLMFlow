"use client"

import React from "react"
import { Box, Typography, Button } from "@mui/material"
const WelcomePage: React.FC = () => {
  return (
    <Box
      width="100%"
      sx={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 25 }}
    >
      <Typography variant="h2" sx={{ mb: 3 }}>
        Welcome to LLM Flow!
      </Typography>
      <Typography variant="h6" align="center" sx={{ width: 1000 }}>
        LLM Flow is a web tool designed to facilitate the process of AI development, starting at
        defining isolated AI use cases (AI Functions), implementing prompts, assessing and improving
        prompt quality, and generating APIs to integrate AI functionality into your own
        applications.
      </Typography>
      <Box
        display="flex"
        sx={{ width: "100%", justifyContent: "space-evenly", alignItems: "center" }}
      ></Box>

      <Box sx={{ display: "flex", marginTop: 6 }}>
        <Button variant="contained" color="primary" href="/ai-functions/create">
          Define your first AI Function 🚀
        </Button>
      </Box>
    </Box>
  )
}

export default WelcomePage
