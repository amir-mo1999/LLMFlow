"use client"
import React from "react"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Divider from "@mui/material/Divider"
import { AIFunction, Project } from "@/api/apiSchemas"
import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from "@mui/icons-material/Edit"
import { useDeleteProject } from "@/api/apiComponents"
import SwaggerUI from "swagger-ui-react"
import "swagger-ui-react/swagger-ui.css"
import { OpenAPI } from "@/api/apiSchemas"
import CircularProgress from "@mui/material/CircularProgress"

interface ProjectSingleOverviewProps {
  onDeleteProject: () => void
  project: Project
  apiDocs?: OpenAPI
  isFetchingApiDocs?: boolean
  aiFunctions: AIFunction[]
  onClickEdit?: (aiFunctionID: string) => void
}

const ProjectSingleOverview: React.FC<ProjectSingleOverviewProps> = ({
  onDeleteProject,
  project,
  apiDocs,
  isFetchingApiDocs = false,
  onClickEdit = () => {},
}) => {
  const { mutate: deleteProject } = useDeleteProject({})

  const onClickDelete = () => {
    onDeleteProject()
    deleteProject({ pathParams: { projectId: project._id as string } })
  }

  return (
    <Box sx={{ width: "100%", display: "flex", flexDirection: "column" }}>
      {apiDocs === undefined && isFetchingApiDocs ? (
        <CircularProgress />
      ) : apiDocs && !isFetchingApiDocs ? (
        <SwaggerUI
          spec={apiDocs}
          requestInterceptor={(req) => {
            if (req.url === "/openapi.json") {
              return req
            }
            const parsedUrl = new URL(req.url)
            req.url = "/api/proxy" + parsedUrl.pathname + parsedUrl.search + parsedUrl.hash
            return req
          }}
        ></SwaggerUI>
      ) : (
        <></>
      )}
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
        .scheme-container {
          background: transparent !important;
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
