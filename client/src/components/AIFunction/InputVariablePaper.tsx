import React from "react"
import { SxProps } from "@mui/material"
import Typography from "@mui/material/Typography"
import Paper from "@mui/material/Paper"
import Divider from "@mui/material/Divider"

interface InputVariablePaperProps {
  varName: string
  content: string
  displayOnly?: boolean
  sx?: SxProps
}

const InputVariablePaper: React.FC<InputVariablePaperProps> = ({
  varName,
  content,
  sx,
  displayOnly = false,
}) => {
  return (
    <Paper
      sx={{
        ...sx,
        padding: 1,
        marginBottom: 1,
        "&:hover": {
          backgroundColor: displayOnly ? "white" : "",
        },
      }}
    >
      <Typography fontWeight={700}>{varName}</Typography>
      <Divider sx={{ marginBottom: 1 }} />
      <Typography>{content}</Typography>
    </Paper>
  )
}

export default InputVariablePaper
