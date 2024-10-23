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
  unit?: string
}

const NumberChip: React.FC<NumberChipProps> = ({
  number,
  label,
  sx,
  labelFirst = false,
  variant = "outlined",
  color = "primary",
  unit = "",
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
            {label} <strong>{number}</strong> {unit}
          </>
        ) : (
          <>
            <strong>{number}</strong>
            {unit} {label}
          </>
        )
      }
    />
  )
}

export default NumberChip
