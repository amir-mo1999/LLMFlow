import { PromptMessage } from "@/api/apiSchemas"
import { SxProps } from "@mui/material"
import Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography"
import Divider from "@mui/material/Divider"

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
        maxHeight: 400,
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
      <Typography fontWeight={700} align="center">
        <strong>
          {message.role.charAt(0).toUpperCase() + message.role.slice(1) + " #" + (indx + 1)}
        </strong>
      </Typography>
      <Divider sx={{ mb: 1, mt: 0.5 }} />
      <Typography variant="body1">{message.content}</Typography>
    </Paper>
  )
}

export default PromptMessagePaper
