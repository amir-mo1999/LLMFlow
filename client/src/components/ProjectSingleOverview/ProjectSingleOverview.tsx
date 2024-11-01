"use client"
import React from "react"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import Divider from "@mui/material/Divider"
import { Project } from "@/api/apiSchemas"
import Chip from "@mui/material/Chip"
import { addTitlesToSchema } from "@/utils"
import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from "@mui/icons-material/Edit"
import AddIcon from "@mui/icons-material/Add"
import { useDeleteProject } from "@/api/apiComponents"
import { JsonSchemaEditor, AssertionsOverview, TestCasesOverview } from "@/components"

interface ProjectSingleOverviewProps {
  onDeleteProject: () => void
  project: Project
  onClickEdit?: (aiFunctionID: string) => void
  onClickAddPrompt?: (aiFunctionID: string) => void
}

const options: Intl.DateTimeFormatOptions = {
  timeZone: "Europe/Berlin",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
}

const ProjectSingleOverview: React.FC<ProjectSingleOverviewProps> = ({
  onDeleteProject,
  project,
  onClickEdit = () => {},
  onClickAddPrompt,
}) => {
  const { mutate: deleteProject } = useDeleteProject({})

  const onClickDelete = () => {
    onDeleteProject()
    deleteProject({ pathParams: { projectId: project._id as string } })
  }

  return (
    <Box sx={{ width: "100%", display: "flex", flexDirection: "column" }}>
      {/* Project Name */}
      <Typography variant="h4">{project.name}</Typography>

      {/* Creation Time */}
      <Typography gutterBottom>
        {new Date(project.creation_time).toLocaleString("de-DE", options)}
      </Typography>

      {/* Description */}
      <Typography variant="body1">{project.description}</Typography>
      <Divider sx={{ marginY: 2 }}></Divider>

      <Divider sx={{ marginY: 2 }}></Divider>

      <Divider sx={{ marginY: 2 }}></Divider>
      <Box>
        <Button
          variant="contained"
          sx={{ mr: 5 }}
          onClick={() => onClickEdit(project._id as string)}
          startIcon={<EditIcon sx={{ mb: 0.4 }} />}
        >
          Edit
        </Button>
        <Button
          variant="contained"
          sx={{ mr: 5, display: onClickAddPrompt ? "normal" : "none" }}
          onClick={() => onClickAddPrompt?.(project._id as string)}
          startIcon={<AddIcon sx={{ mb: 0.4 }} />}
        >
          Add Prompt
        </Button>
        <Button
          variant="contained"
          color="error"
          startIcon={<DeleteIcon sx={{ mb: 0.4 }} />}
          onClick={onClickDelete}
        >
          Delete
        </Button>
      </Box>
    </Box>
  )
}

export default ProjectSingleOverview
