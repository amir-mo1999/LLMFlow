"use client"

import React from "react"
import Chip from "@mui/material/Chip"
import Typography from "@mui/material/Typography"
import { SxProps, Theme } from "@mui/material/styles"

interface NumberChipProps {
  number: number
  label: string
  sx?: SxProps<Theme>
}

const NumberChip: React.FC<NumberChipProps> = ({ number, label, sx }) => {
  return (
    <Chip
      sx={{
        ...sx,
        fontSize: "0.9rem",
      }}
      variant="outlined"
      color="primary"
      size="small"
      label={
        <>
          <strong> {number}</strong> {label}
        </>
      }
    />
  )
}

export default NumberChip
