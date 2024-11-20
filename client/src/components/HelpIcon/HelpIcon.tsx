import React, { useState } from "react"
import { IconButton, Tooltip } from "@mui/material"
import HelpOutlineIcon from "@mui/icons-material/HelpOutline"

interface HelpIconProps {
  title: string
}

const HelpIcon: React.FC<HelpIconProps> = ({ title }) => {
  const [open, setOpen] = useState(false)

  const handleTooltipOpen = () => {
    setOpen((prev) => !prev)
  }

  const handleTooltipClose = () => {
    setOpen(false)
  }

  return (
    <Tooltip arrow title={title} placement="top" open={open} onClose={handleTooltipClose}>
      <IconButton onClick={handleTooltipOpen}>
        <HelpOutlineIcon />
      </IconButton>
    </Tooltip>
  )
}

export default HelpIcon
