"use client"

import React, { ProviderExoticComponent, useState } from "react"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import Divider from "@mui/material/Divider"
import InputLabel from "@mui/material/InputLabel"
import { Prompt, Provider } from "@/api/apiSchemas"
import { useDeletePrompt } from "@/api/apiComponents"
import EvalOverview from "../EvalOverview/EvalOverview"
import FormControl from "@mui/material/FormControl"

import Select, { SelectChangeEvent } from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"
import theme from "@/theme"
import { PromptMessagesOverview } from "@/components"
import EditIcon from "@mui/icons-material/Edit"

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
  const [selectedProvider, setSelectedProvider] = useState<Provider | undefined>(
    prompt.evals ? (Object.keys(prompt.evals)[0] as Provider) : undefined
  )

  const { mutate: deletePromptAPI } = useDeletePrompt({
    onSuccess: () => {
      onDelete()
    },
  })

  const handleSelectedProviderChange = (event: SelectChangeEvent) => {
    setSelectedProvider(event.target.value as Provider)
  }

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
        <Button size="small" onClick={() => onClickEdit(prompt._id as string)}>
          <EditIcon />
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

      {prompt.evals && (
        <>
          <FormControl>
            <InputLabel id="provider-select">Provider</InputLabel>
            <Select
              labelId="provider-select"
              value={selectedProvider}
              label="Provider"
              onChange={handleSelectedProviderChange}
            >
              {Object.keys(prompt.evals).map((provider, indx) => {
                return (
                  <MenuItem key={indx} value={provider}>
                    {provider}
                  </MenuItem>
                )
              })}
            </Select>
          </FormControl>
          {selectedProvider && <EvalOverview evalResult={prompt.evals[selectedProvider]} />}
        </>
      )}

      <Divider sx={{ marginY: 2 }}></Divider>

      {/* Delete Prompt Button */}
      <Button variant="contained" color="error" onClick={handleDelete} disabled={disableDelete}>
        Delete Prompt
      </Button>
    </Box>
  )
}

export default PromptSingleOverview
