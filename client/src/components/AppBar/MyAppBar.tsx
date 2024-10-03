"use client"

import React from "react"
import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import IconButton from "@mui/material/IconButton"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import Box from "@mui/material/Box"
import HomeIcon from "@mui/icons-material/Home"
import UserAvatar from "./UserAvatar"
import { useSession } from "next-auth/react"

interface AppBarProps {}

const MyAppBar: React.FC<AppBarProps> = () => {
  const { data: session } = useSession()

  let initials: string
  if (session?.user === undefined) {
    initials = "AA"
  } else {
    initials = (
      session?.user.first_name.slice(0, 1) + session?.user.last_name.slice(0, 1)
    ).toUpperCase()
  }

  return (
    <AppBar position="static">
      <Toolbar sx={{ gap: 15 }}>
        {/* Left Section: App Icon and App Name */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="app-icon"
            sx={{ mr: 2 }}
          >
            <HomeIcon />
          </IconButton>
          <Typography variant="h6" component="div">
            MyApp
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
