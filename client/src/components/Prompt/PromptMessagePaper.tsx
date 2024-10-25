import { PromptMessage } from "@/api/apiSchemas"
import { SxProps } from "@mui/material"
import Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography"

interface PromptMessagePaperProps {
  message: PromptMessage
  indx: number
  sx?: SxProps
}

const PromptMessagePaper: React.FC<PromptMessagePaperProps> = ({ message, sx, indx }) => {
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
          backgroundColor: "white",
        },
      }}
    >
      <Typography variant="subtitle1">
        <strong>
          {message.role.charAt(0).toUpperCase() + message.role.slice(1) + " #" + (indx + 1)}
        </strong>
      </Typography>
      <Typography variant="body1">{message.content}</Typography>
    </Paper>
  )
}

export default PromptMessagePaper
