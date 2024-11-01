import { Prompt } from "@/api/apiSchemas"
import { SxProps } from "@mui/material"
import Box from "@mui/material/Box"
import PromptMessagePaper from "./PromptMessagePaper"

interface PromptMessagesOverviewProps {
  messages: Prompt["messages"]
  sx?: SxProps
}

const PromptMessagesOverview: React.FC<PromptMessagesOverviewProps> = ({ messages, sx }) => {
  return (
    <Box
      sx={{
        mt: 1,
        display: "flex",
        width: "100%",
        maxHeight: 390,
        pb: 0.3,
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 2,
        alignItems: "flex-start",
        overflow: "auto",
        ...sx,
      }}
    >
      {messages.map((message, indx) => (
        <PromptMessagePaper key={indx} indx={indx} message={message}></PromptMessagePaper>
      ))}
    </Box>
  )
}

export default PromptMessagesOverview
