import React, { useEffect, useState, useRef } from "react"
import { Typography, Button, Box, TextField } from "@mui/material"
import ClearIcon from "@mui/icons-material/Clear"
import { AIFunction, ProjectRouteInput } from "@/api/apiSchemas"
import { Project } from "@/api/apiSchemas"
import AIFunctionPaper from "../AIFunctionPaper/AIFunctionPaper"
import Divider from "@mui/material/Divider"
import AddIcon from "@mui/icons-material/Add"
import SelectDialog from "@/components/SelectDialog/SelectDialog"
import { usePostProject, usePatchProject } from "@/api/apiComponents"
import { getProjectDiff } from "@/utils"
import { ProjectAPIRoute } from "@/api/apiSchemas"

interface ProjectFormProps {
  onSubmitProject?: (project: Project) => void
  setProject?: (project: Project) => void
  editProject?: Project
  aiFunctions: AIFunction[]
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
const pathSegmentNameCharLimit = 20

const ProjectForm: React.FC<ProjectFormProps> = ({
  onSubmitProject,
  setProject,
  editProject,
  aiFunctions,
}) => {
  const [initProject, _] = useState<Project>(
    editProject ? JSON.parse(JSON.stringify(editProject)) : undefined
  )

  const [name, setName] = useState<string>(editProject?.name || "")
  const nameRef = useRef<null | HTMLDivElement>(null)
  const [nameError, setNameError] = useState<boolean>(false)
  const [pathSegmentName, setPathSegmentName] = useState(editProject?.path_segment_name || "")
  const pathSegmentNameRef = useRef<null | HTMLDivElement>(null)
  const [pathSegmentNameError, setPathSegmentNameError] = useState(false)
  const [description, setDescription] = useState<string>(editProject?.description || "")
  const [apiRoutes, setApiRoutes] = useState<ProjectAPIRoute[]>(editProject?.api_routes || [])
  const [disableSubmit, setDisableSubmit] = useState<boolean>(true)
  const [openSelectAIFunction, setOpenSelectAIFunction] = useState(false)

  const { mutate: postProject } = usePostProject({
    onSuccess: (project: Project) => {
      onSubmitProject?.(project)
    },
    onError: (err) => {
      //@ts-ignore
      if (err.stack.status === 409) {
        setNameError(true)
        if (nameRef.current) {
          nameRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
        }
      }
    },
  })

  const { mutate: patchProject } = usePatchProject({
    onSuccess: (project: Project) => {
      setProject?.(project)
    },
    onError: (err) => {
      //@ts-ignore
      if (err.stack.status === 409) {
        setNameError(true)
        if (nameRef.current) {
          nameRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
        }
      }
    },
  })

  const onClickSubmit = () => {
    setDisableSubmit(true)
    const body: ProjectRouteInput = {
      name: name,
      description: description,
      path_segment_name: pathSegmentName,
      api_routes: apiRoutes,
    }

    if (initProject) {
      patchProject({
        body: getProjectDiff(initProject, body),
        pathParams: { projectId: initProject._id as string },
      })
    } else {
      postProject({ body: body })
    }
  }

  const onClickAIFunction = (indx: number) => {
    const aiFunctionID = aiFunctions[indx]._id

    if (!apiRoutes.find((route) => route.ai_function_id === aiFunctionID)) {
      const newApiRoutes: ProjectAPIRoute[] = [
        ...apiRoutes,
        { ai_function_id: aiFunctionID as string, path_segment_name: "" },
      ]
      setApiRoutes(newApiRoutes)
    }
  }

  const updateDisableSubmit = () => {
    const pathSegmentNames = apiRoutes.reduce((acc, route) => {
      acc.push(route.path_segment_name)
      return acc
    }, [] as string[])
    const pathSegmentNamesSet = new Set(pathSegmentNames)
    if (name === "") setDisableSubmit(true)
    else if (description === "") setDisableSubmit(true)
    else if (apiRoutes.length === 0) setDisableSubmit(true)
    else if (apiRoutes.some((route) => route.path_segment_name === "")) setDisableSubmit(true)
    else if (pathSegmentNamesSet.size !== pathSegmentNames.length) setDisableSubmit(true)
    else setDisableSubmit(false)
  }

  useEffect(updateDisableSubmit, [name, description, apiRoutes])

  const onNameChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newName = e.target.value
    if (newName.length <= nameCharLimit) {
      setName(e.target.value)
      setNameError(false)
    }
  }

  const onPathSegmentNameChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newName = e.target.value.replace(/[^A-Za-z0-9._~-]/g, "")
    if (newName.length <= pathSegmentNameCharLimit) {
      setPathSegmentName(newName)
      setPathSegmentNameError(false)
    }
  }

  const onRoutePathSegmentNameChange = (indx: number) => {
    const f = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const newName = e.target.value.replace(/[^A-Za-z0-9._~-]/g, "")
      const newApiRoutes = [...apiRoutes]
      if (newName.length <= pathSegmentNameCharLimit) {
        newApiRoutes[indx].path_segment_name = newName
        setApiRoutes(newApiRoutes)
      }
    }
    return f
  }

  const onDescriptionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newDescription = e.target.value
    if (newDescription.length <= descriptionCharLimit) {
      setDescription(e.target.value)
    }
  }

  const onClickRemoveAIFunction = (indx: number) => {
    const f = () => {
      const newApiRoutes = apiRoutes.filter((_, i) => i !== indx)
      setApiRoutes(newApiRoutes)
    }
    return f
  }

  return (
    <>
      <Box sx={{ width: "100%", display: "flex", flexDirection: "column", marginBottom: 20 }}>
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
          API Path Segment Name
        </Typography>
        <TextField
          ref={pathSegmentNameRef}
          sx={{ width: "100%" }}
          value={pathSegmentName}
          onChange={onPathSegmentNameChange}
          helperText={`${pathSegmentName.length}/${pathSegmentNameCharLimit} ${pathSegmentNameError ? "Project with this path segment name already exists" : ""}`}
          error={pathSegmentNameError}
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
          {apiRoutes.map((apiRoute, indx) => {
            const aiFunction = aiFunctions.find(
              (aiFunction) => aiFunction._id === apiRoute.ai_function_id
            )
            return (
              <Box key={indx} sx={{ display: "flex", alignItems: "center", gap: 5 }}>
                <AIFunctionPaper
                  aiFunction={aiFunction as AIFunction}
                  sx={{ width: "50%" }}
                  disableHover
                ></AIFunctionPaper>
                <Box>
                  <Typography>Path Segment Name</Typography>
                  <TextField
                    value={apiRoute.path_segment_name}
                    onChange={onRoutePathSegmentNameChange(indx)}
                    size="small"
                    helperText={`${apiRoute.path_segment_name.length}/${pathSegmentNameCharLimit}`}
                    sx={{ minWidth: 240 }}
                  ></TextField>
                </Box>
                <Button onClick={onClickRemoveAIFunction(indx)}>
                  <ClearIcon />
                </Button>
              </Box>
            )
          })}
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
        aiFunctions={aiFunctions}
        setOpen={setOpenSelectAIFunction}
        onClick={onClickAIFunction}
      ></SelectDialog>
    </>
  )
}
export default ProjectForm
