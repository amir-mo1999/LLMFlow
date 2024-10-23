"use client"

import React from "react"
import Chip from "@mui/material/Chip"
import { SxProps, Theme } from "@mui/material/styles"

interface NumberChipProps {
  number: number
  label: string
  sx?: SxProps<Theme>
  labelFirst?: boolean
  variant?: "outlined" | "filled"
  color?: "primary" | "secondary" | "success" | "warning" | "error"
}

const NumberChip: React.FC<NumberChipProps> = ({
  number,
  label,
  sx,
  labelFirst = false,
  variant = "outlined",
  color = "primary",
}) => {
  return (
    <Chip
      sx={{
        ...sx,
        fontSize: "0.9rem",
      }}
      variant={variant}
      color={color}
      size="small"
      label={
        labelFirst ? (
          <>
            {label} <strong> {number}</strong>
          </>
        ) : (
          <>
            <strong> {number}</strong> {label}
          </>
        )
      }
    />
  )
}

export default NumberChip
