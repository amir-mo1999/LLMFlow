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
        minWidth: "20%",
        padding: 1,
        maxHeight: 210,
        height: "auto",
        position: "relative",
        overflow: "auto",
        overflowX: "hidden",
        maxWidth: "100%",
        "&:hover": {
          backgroundColor: displayOnly ? "white" : "",
        },
      }}
    >
      <Typography fontWeight={700} align="center">
        {varName}
      </Typography>
      <Divider />
      <Typography mt={1}>{content}</Typography>
    </Paper>
  )
}

export default InputVariablePaper
