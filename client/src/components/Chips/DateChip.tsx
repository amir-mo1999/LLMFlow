"use client"

import React from "react"
import Chip from "@mui/material/Chip"
import { SxProps, Theme } from "@mui/material/styles"

interface DateChipProps {
  isoString: string
  sx?: SxProps<Theme>
}

const DateChip: React.FC<DateChipProps> = ({ isoString, sx }) => {
  const date = new Date(isoString)
  const options: Intl.DateTimeFormatOptions = {
    timeZone: "Europe/Berlin",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }
  const formattedDate = date.toLocaleString("de-DE", options)

  return <Chip label={formattedDate} sx={sx} color="primary" size="small" />
}

export default DateChip
