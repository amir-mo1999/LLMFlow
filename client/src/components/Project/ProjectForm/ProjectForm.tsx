import React, { useEffect, useState, useRef } from "react"
import { Typography, Select, MenuItem, Button, Box, TextField, Chip, Paper } from "@mui/material"
import ClearIcon from "@mui/icons-material/Clear"
import { PromptRouteInput, PromptMessage, Prompt, AIFunction } from "@/api/apiSchemas"
import { ProjectRouteInput, Project } from "@/api/apiSchemas"
import { AIFunctionPaper } from "@/components/AIFunction"
import { usePatchPrompt } from "@/api/apiComponents"
import Divider from "@mui/material/Divider"
import AddIcon from "@mui/icons-material/Add"
import SelectDialog from "@/components/Prompt/SelectDialog"
import { AIFunctionOverview } from "@/components/AIFunction"

interface ProjectFormProps {
  onSubmitProject?: (project: Project) => void
  onPatchProject?: (project: Partial<Project>) => void
  editProject?: Project
  aiFunctions: AIFunction[]
  prompts: Prompt[]
}

const options: Intl.DateTimeFormatOptions = {
  timeZone: "Europe/Berlin",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
}

const nameCharLimit = 40
const descriptionCharLimit = 1000

const ProjectForm: React.FC<ProjectFormProps> = ({
  onSubmitProject,
  onPatchProject,
  editProject,
  aiFunctions,
  prompts,
}) => {
  const [name, setName] = useState<string>(editProject?.name || "")
  const nameRef = useRef<null | HTMLDivElement>(null)
  const [nameError, setNameError] = useState<boolean>(false)

  const [description, setDescription] = useState<string>(editProject?.description || "")
  const [promptIDs, setPromptIDs] = useState<string[]>(editProject?.prompt_ids || [])
  const [disableSubmit, setDisableSubmit] = useState<boolean>(true)
  const [openSelectAIFunction, setOpenSelectAIFunction] = useState(false)
  const [openSelectPrompt, setOpenSelectPrompt] = useState(false)

  const [selectedAIFunctionIndices, setSelectedAIFunctionIndices] = useState<number[]>([])

  const onClickAIFunction = (indx: number) => {
    if (!selectedAIFunctionIndices.includes(indx)) {
      const newIndices = [...selectedAIFunctionIndices]
      newIndices.push(indx)
      setSelectedAIFunctionIndices(newIndices)
    }
  }

  const updateDisableSubmit = () => {}

  useEffect(updateDisableSubmit, [name, description, promptIDs])

  const onClickSubmit = () => {
    setDisableSubmit(true)
  }

  const onNameChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newName = e.target.value
    if (newName.length <= nameCharLimit) {
      setName(e.target.value)
      setNameError(false)
    }
  }

  const onDescriptionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newDescription = e.target.value
    if (newDescription.length <= descriptionCharLimit) {
      setDescription(e.target.value)
    }
  }

  return (
    <>
      <Box sx={{ width: "100%", display: "flex", flexDirection: "column" }}>
        {editProject && (
          <Box>
            <Typography variant="h4">{editProject.name}</Typography>
            {/* Creation Time */}
            <Typography>
              {new Date(editProject.creation_time).toLocaleString("de-DE", options)}
            </Typography>
            <Divider sx={{ marginY: 2 }} />
          </Box>
        )}
        <Typography variant="h5" sx={{ paddingBottom: 1 }}>
          Name
        </Typography>
        <TextField
          ref={nameRef}
          sx={{ width: "100%" }}
          value={name}
          onChange={onNameChange}
          helperText={`${name.length}/${nameCharLimit} ${nameError ? "AI Function with this name already exists" : ""}`}
          error={nameError}
        />
        <Divider sx={{ marginY: 2 }}></Divider>

        <Typography variant="h5" sx={{ paddingBottom: 1 }}>
          Description
        </Typography>
        <TextField
          value={description}
          onChange={onDescriptionChange}
          multiline
          minRows={5}
          helperText={`${description.length}/${descriptionCharLimit}`}
          sx={{ width: "100%" }}
        />
        <Divider sx={{ marginY: 2 }}></Divider>

        <Box sx={{ display: "flex", flexDirection: "row", gap: 2, marginBottom: 1 }}>
          <Typography variant="h5">AI Functions</Typography>
          <Button onClick={() => setOpenSelectAIFunction(true)} color="primary">
            <AddIcon />
          </Button>
        </Box>

        {selectedAIFunctionIndices.map((indx) => (
          <Box key={indx} sx={{ display: "flex" }}>
            <AIFunctionPaper
              aiFunction={aiFunctions[indx]}
              sx={{ width: "50%" }}
              disableHover
            ></AIFunctionPaper>
            <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
              <Button
                variant="contained"
                size="small"
                sx={{ marginLeft: 20 }}
                onClick={() => setOpenSelectPrompt(true)}
              >
                Select Prompt
              </Button>
              <Button sx={{ marginLeft: 2 }} size="large">
                <ClearIcon fontSize="large" />
              </Button>
            </Box>
          </Box>
        ))}
      </Box>

      <SelectDialog
        open={openSelectAIFunction}
        aiFunctions={aiFunctions}
        setOpen={setOpenSelectAIFunction}
        onClick={onClickAIFunction}
      ></SelectDialog>

      <SelectDialog
        open={openSelectPrompt}
        prompts={prompts}
        setOpen={setOpenSelectPrompt}
      ></SelectDialog>
    </>
  )
}
export default ProjectForm
