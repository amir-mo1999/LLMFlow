"use client"

import React from "react"
import Chip from "@mui/material/Chip"
import PersonIcon from "@mui/icons-material/Person"
import { SxProps, Theme } from "@mui/material/styles"

interface UserChipProps {
  username: string
  sx?: SxProps<Theme>
}

const UserChip: React.FC<UserChipProps> = ({ username, sx }) => {
  return (
    <Chip
      icon={<PersonIcon />}
      label={username}
      sx={{ fontSize: "0.8rem", ...sx }}
      color="primary"
      variant="filled"
      size="small"
    />
  )
}

export default UserChip
