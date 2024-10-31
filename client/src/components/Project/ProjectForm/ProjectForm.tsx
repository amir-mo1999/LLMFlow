import React, { useEffect, useState, useRef } from "react"
import { Typography, Select, MenuItem, Button, Box, TextField, Chip, Paper } from "@mui/material"
import ClearIcon from "@mui/icons-material/Clear"
import { PromptRouteInput, PromptMessage, Prompt, AIFunction } from "@/api/apiSchemas"
import { ProjectRouteInput, Project } from "@/api/apiSchemas"
import { AIFunctionPaper } from "@/components/AIFunction"
import { usePatchPrompt } from "@/api/apiComponents"
import Divider from "@mui/material/Divider"
import AddIcon from "@mui/icons-material/Add"

interface ProjectFormProps {
  addProject: (project: Project) => void
  patchProject: (project: Partial<Project>) => void
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
  addProject,
  patchProject,
  editProject,
  aiFunctions,
  prompts,
}) => {
  const [name, setName] = useState<string>(editProject?.name || "")
  const [nameError, setNameError] = useState<boolean>(false)
  const [description, setDescription] = useState<string>(editProject?.description || "")
  const [promptIDs, setPromptIDs] = useState<string[]>(editProject?.prompt_ids || [])
  const [disableSubmit, setDisableSubmit] = useState<boolean>(true)

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

  if (aiFunctions.length === 0) {
    return <></>
  }

  return (
    <>
      <Box sx={{ width: "100%", display: "flex", flexDirection: "column" }}>
        {editProject ? (
          <Box>
            <Typography variant="h4">{editProject.name}</Typography>
            {/* Creation Time */}
            <Typography>
              {new Date(editProject.creation_time).toLocaleString("de-DE", options)}
            </Typography>
            <Divider sx={{ marginY: 2 }}></Divider>
          </Box>
        ) : (
          <></>
        )}
      </Box>
    </>
  )
}
export default ProjectForm
