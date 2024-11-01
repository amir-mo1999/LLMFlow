import React, { useEffect, useState, useRef } from "react"
import { Typography, Button, Box, TextField } from "@mui/material"
import ClearIcon from "@mui/icons-material/Clear"
import { Prompt, AIFunction, ProjectRouteInput } from "@/api/apiSchemas"
import { Project } from "@/api/apiSchemas"
import AIFunctionPaper from "../AIFunctionPaper/AIFunctionPaper"
import Divider from "@mui/material/Divider"
import AddIcon from "@mui/icons-material/Add"
import SelectDialog from "@/components/SelectDialog/SelectDialog"
import PromptPaper from "../PromptPaper/PromptPaper"
import { usePostProject } from "@/api/apiComponents"

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
  const [implementedAIFunctions, setImplementedAIFunctions] = useState<AIFunction[]>([])
  const [promptIDs, setPromptIDs] = useState<string[]>(editProject?.prompt_ids || [])
  const [disableSubmit, setDisableSubmit] = useState<boolean>(true)
  const [openSelectAIFunction, setOpenSelectAIFunction] = useState(false)
  const [openSelectPrompt, setOpenSelectPrompt] = useState(false)
  const [selectedAIFunctionIndx, setSelectedAIFunctionIndx] = useState(0)

  const [selectedAIFunctionIndices, setSelectedAIFunctionIndices] = useState<number[]>([])

  const [promptsMapping, setPromptsMapping] = useState<Record<number, Prompt>>({})

  const { mutate: postProject } = usePostProject({
    onSuccess: (project: Project) => {
      onSubmitProject?.(project)
    },
  })

  const onClickSubmit = () => {
    setDisableSubmit(true)

    // construct project
    const newProject: ProjectRouteInput = {
      name: name,
      description: description,
      prompt_ids: Object.values(promptsMapping).reduce((acc: string[], prompt: Prompt) => {
        acc.push(prompt._id as string)
        return acc
      }, [] as string[]),
    }

    postProject({ body: newProject })
  }

  useEffect(() => {
    setImplementedAIFunctions(aiFunctions.filter((aiFunction) => aiFunction.implemented))
    setSelectedAIFunctionIndices([])
  }, [aiFunctions])

  const onClickAIFunction = (indx: number) => {
    if (!selectedAIFunctionIndices.includes(indx)) {
      const newIndices = [...selectedAIFunctionIndices]
      newIndices.push(indx)
      setSelectedAIFunctionIndices(newIndices)
    }
  }

  const onClickPrompt = (aiFunctionIndx: number) => {
    const f = (promptIndx: number) => {
      const newMapping = { ...promptsMapping }
      newMapping[aiFunctionIndx] = prompts[promptIndx]
      setPromptsMapping(newMapping)
    }
    return f
  }

  const updateDisableSubmit = () => {
    if (name === "") setDisableSubmit(true)
    else if (description === "") setDisableSubmit(true)
    else if (selectedAIFunctionIndices.length === 0) setDisableSubmit(true)
    else if (selectedAIFunctionIndices.some((indx) => !(indx in promptsMapping)))
      setDisableSubmit(true)
    else setDisableSubmit(false)
  }

  useEffect(updateDisableSubmit, [name, description, selectedAIFunctionIndices, promptsMapping])

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

  const onClickSelectPrompt = (aiFunctionIndx: number) => {
    const f = () => {
      setSelectedAIFunctionIndx(aiFunctionIndx)
      setOpenSelectPrompt(true)
    }
    return f
  }

  const onClickRemoveAIFunction = (aiFunctionIndx: number) => {
    const f = () => {
      const newIndices = selectedAIFunctionIndices.filter((indx) => indx !== aiFunctionIndx)
      setSelectedAIFunctionIndices(newIndices)
      delete promptsMapping[aiFunctionIndx]
    }
    return f
  }

  return (
    <>
      <Box sx={{ width: "100%", display: "flex", flexDirection: "column", marginBottom: 40 }}>
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
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {selectedAIFunctionIndices.map((indx) => (
            <Box key={indx} sx={{ display: "flex", justifyContent: "space-between" }}>
              <AIFunctionPaper
                aiFunction={aiFunctions[indx]}
                sx={{ width: "45%" }}
                disableHover
              ></AIFunctionPaper>
              {indx in promptsMapping ? (
                <PromptPaper
                  prompt={promptsMapping[indx]}
                  sx={{ width: "45%" }}
                  onClick={onClickSelectPrompt(indx)}
                ></PromptPaper>
              ) : (
                <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
                  <Button
                    variant="contained"
                    size="small"
                    sx={{ marginRight: 40 }}
                    onClick={onClickSelectPrompt(indx)}
                  >
                    Select Prompt
                  </Button>
                </Box>
              )}
              <Box sx={{ height: "100%", display: "flex", alignItems: "center" }}>
                <Button size="large" onClick={onClickRemoveAIFunction(indx)}>
                  <ClearIcon fontSize="large" />
                </Button>
              </Box>
            </Box>
          ))}
        </Box>

        <Divider sx={{ marginY: 2 }}></Divider>
        <Box>
          <Button
            variant="contained"
            color="primary"
            disabled={disableSubmit}
            onClick={onClickSubmit}
          >
            Submit
          </Button>
        </Box>
      </Box>

      <SelectDialog
        open={openSelectAIFunction}
        aiFunctions={implementedAIFunctions}
        setOpen={setOpenSelectAIFunction}
        onClick={onClickAIFunction}
      ></SelectDialog>

      <SelectDialog
        open={openSelectPrompt}
        onClick={onClickPrompt(selectedAIFunctionIndx)}
        prompts={prompts.filter(
          (prompt) => prompt.ai_function_id === aiFunctions[selectedAIFunctionIndx]._id
        )}
        setOpen={setOpenSelectPrompt}
      ></SelectDialog>
    </>
  )
}
export default ProjectForm
