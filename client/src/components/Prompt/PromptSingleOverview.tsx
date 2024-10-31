"use client"

import React, { useState } from "react"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import Divider from "@mui/material/Divider"
import { Prompt } from "@/api/apiSchemas"
import { useDeletePrompt } from "@/api/apiComponents"
import EvalOverview from "./EvalOverview"
import PromptMessagesOverview from "./PromptMessagesOverview"
import theme from "@/theme"

interface PromptSingleOverviewProps {
  prompt: Prompt
  onDelete: () => void
  onClickEdit: (promptID: string) => void
}

const options: Intl.DateTimeFormatOptions = {
  timeZone: "Europe/Berlin",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
}

const PromptSingleOverview: React.FC<PromptSingleOverviewProps> = ({
  prompt,
  onDelete,
  onClickEdit,
}) => {
  const [disableDelete, setDisableDelete] = useState(false)
  const { mutate: deletePromptAPI } = useDeletePrompt({
    onSuccess: () => {
      onDelete()
    },
  })

  const handleDelete = () => {
    setDisableDelete(true)
    deletePromptAPI({ pathParams: { promptId: prompt._id as string } })
  }

  return (
    <Box sx={{ width: "100%", display: "flex", flexDirection: "column" }}>
      {/* Prompt Name */}
      <Typography variant="h4">
        {prompt.ai_function_name} #{prompt.index}
      </Typography>

      {/* Creation Time */}
      <Typography>{new Date(prompt.creation_time).toLocaleString("de-DE", options)}</Typography>

      <Divider sx={{ marginY: 2 }}></Divider>

      {/* Prompt Messages */}
      <Box sx={{ display: "flex", gap: 2 }}>
        <Typography variant="h5">Messages</Typography>
        <Button size="small" variant="contained" onClick={() => onClickEdit(prompt._id as string)}>
          Edit Messages
        </Button>
      </Box>

      <Box
        sx={{
          borderColor: theme.palette.warning.main,
          borderWidth: 1,
          padding: 1,
          mt: 1,
          borderRadius: 3,
          display: prompt.revision_required ? "normal" : "none",
        }}
      >
        <Typography color={theme.palette.warning.main}>
          The Input Variables for this AI Function have been modified. Please review and update the
          prompt messages to ensure they align with the recent changes.
        </Typography>
      </Box>
      <PromptMessagesOverview messages={prompt.messages}></PromptMessagesOverview>

      <Divider sx={{ marginY: 2 }}></Divider>

      {/* Evaluation Results Section */}
      <Typography variant="h5" paddingBottom={1}>
        Evaluation Results
      </Typography>
      {prompt.last_eval ? <EvalOverview evalResult={prompt.last_eval}></EvalOverview> : <></>}

      <Divider sx={{ marginY: 2 }}></Divider>

      {/* Delete Prompt Button */}
      <Button variant="contained" color="error" onClick={handleDelete} disabled={disableDelete}>
        Delete Prompt
      </Button>
    </Box>
  )
}

export default PromptSingleOverview
