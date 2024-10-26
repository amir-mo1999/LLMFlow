"use client"

import React from "react"
import Chip from "@mui/material/Chip"
import { SxProps, Theme } from "@mui/material/styles"

interface TextChipProps {
  label: string
  sx?: SxProps<Theme>
  variant?: "outlined" | "filled"
  color?: "primary" | "secondary" | "success" | "warning" | "error"
}

const TextChip: React.FC<TextChipProps> = ({
  label,
  sx,
  variant = "outlined",
  color = "primary",
}) => {
  return <Chip sx={sx} variant={variant} color={color} size="small" label={label} />
}

export default TextChip
