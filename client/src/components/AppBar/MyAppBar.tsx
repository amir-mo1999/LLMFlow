"use client"

import React from "react"
import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import Box from "@mui/material/Box"
import UserAvatar from "./UserAvatar"
import { useSession } from "next-auth/react"

function getInitials(fullName: string): string {
  if (!fullName) return ""

  // Split the name by whitespace characters (handles multiple spaces, tabs, etc.)
  const nameParts = fullName.trim().split(/\s+/)

  // Extract the first character of each part and convert to uppercase
  const initials = nameParts.map((part) => part.charAt(0).toUpperCase())

  // Join the initials without any separator
  return initials.join("")
}

const MyAppBar: React.FC = () => {
  const { data: session } = useSession()

  let initials: string
  if (session?.user?.name) {
    initials = getInitials(session.user.name)
  } else {
    initials = "AA"
  }
  return (
    <AppBar position="static">
      <Toolbar sx={{ gap: 15 }}>
        {/* Left Section: App Icon and App Name */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="h6" component="div">
            LLM Flow
          </Typography>
        </Box>

        {/* Middle Section: Navigation Buttons */}
        <Box sx={{ display: "flex", gap: 2, flexGrow: 1 }}>
          <Button color="inherit" href="/ai-functions">
            AI Functions
          </Button>
          <Button color="inherit" href="/prompts">
            Prompts
          </Button>
          <Button color="inherit" href="/projects">
            Projects
          </Button>
        </Box>

        {/* Right Section: User Avatar */}
        <Box sx={{ ml: 4 }}>
          <UserAvatar initials={initials}></UserAvatar>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default MyAppBar
