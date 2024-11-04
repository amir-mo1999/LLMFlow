"use client"
import React from "react"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import Divider from "@mui/material/Divider"
import { AIFunction, Project } from "@/api/apiSchemas"
import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from "@mui/icons-material/Edit"
import AddIcon from "@mui/icons-material/Add"
import { useDeleteProject } from "@/api/apiComponents"
import { AIFunctionPaper } from "@/components"
import SwaggerUI from "swagger-ui-react"
import "swagger-ui-react/swagger-ui.css"
import { useTheme } from "@mui/material"

interface ProjectSingleOverviewProps {
  onDeleteProject: () => void
  project: Project
  aiFunctions: AIFunction[]
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
  aiFunctions,
  onClickEdit = () => {},
  onClickAddPrompt,
}) => {
  const theme = useTheme()
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
      {/* AI Functions and Prompts */}
      <Typography variant="h5" sx={{ paddingBottom: 1 }}>
        AI Functions
      </Typography>
      <Box sx={{ display: "flex", gap: 3, flexDirection: "column" }}>
        {project.api_routes.map((apiRoute, indx) => {
          return (
            <AIFunctionPaper
              key={indx}
              sx={{ width: "50%" }}
              aiFunction={aiFunctions.find((a) => a._id === apiRoute.ai_function_id) as AIFunction}
            />
          )
        })}
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}></Box>
      {/* API Docs */}
      <Divider sx={{ marginY: 2 }}></Divider>
      <Typography variant="h5" sx={{ paddingBottom: 1 }}>
        API Documentation
      </Typography>

      <SwaggerUI
        url="/openapi.json"
        requestInterceptor={(req) => {
          if (req.url === "/openapi.json") {
            return req
          }
          const parsedUrl = new URL(req.url)
          req.url = "/api/proxy" + parsedUrl.pathname + parsedUrl.search + parsedUrl.hash
          return req
        }}
      ></SwaggerUI>

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
      <style jsx global>{`
        /* Global styles to override Swagger UI defaults */
        .swagger-ui,
        .swagger-ui .wrapper,
        .swagger-ui .swagger-container {
          background-color: white;
        }

        /* Optional: Adjust text colors for better contrast */
        .swagger-ui .topbar,
        .swagger-ui .info,
        .swagger-ui .opblock-summary {
          color: black;
        }
      `}</style>
    </Box>
  )
}

export default ProjectSingleOverview
