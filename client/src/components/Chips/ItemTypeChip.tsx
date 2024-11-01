"use client"

import React from "react"
import Chip from "@mui/material/Chip"
import { SxProps, Theme } from "@mui/material/styles"

interface ItemTypeChipProps {
  itemType: "AI Function" | "Prompt" | "Project"
  sx?: SxProps<Theme>
}

const ItemTypeChip: React.FC<ItemTypeChipProps> = ({ itemType, sx }) => {
  return <Chip label={itemType} sx={{ fontSize: "0.8rem", ...sx }} color="primary" size="small" />
}

export default ItemTypeChip
