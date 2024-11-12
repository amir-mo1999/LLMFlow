"use client"
import React, { useState } from "react"
import Box from "@mui/material/Box"
import TextField from "@mui/material/TextField"
import InputAdornment from "@mui/material/InputAdornment"
import IconButton from "@mui/material/IconButton"
import Tooltip from "@mui/material/Tooltip"
import Button from "@mui/material/Button"
import VisibilityIcon from "@mui/icons-material/Visibility"
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff"
import Divider from "@mui/material/Divider"
import Snackbar from "@mui/material/Snackbar"
import Alert from "@mui/material/Alert"
import { AIFunction, Project } from "@/api/apiSchemas"
import { useDeleteProject } from "@/api/apiComponents"
import SwaggerUI from "swagger-ui-react"
import "swagger-ui-react/swagger-ui.css"
import { OpenAPI } from "@/api/apiSchemas"
import CircularProgress from "@mui/material/CircularProgress"
import { EditButton, DeleteButton } from "@/components"
import ContentCopyIcon from "@mui/icons-material/ContentCopy"

interface ProjectSingleOverviewProps {
  onDeleteProject: () => void
  project: Project
  apiDocs?: OpenAPI
  isFetchingApiDocs?: boolean
  aiFunctions: AIFunction[]
  onClickEdit?: (_: string) => void
  onClickViewDocs?: () => void
}

const ProjectSingleOverview: React.FC<ProjectSingleOverviewProps> = ({
  onDeleteProject,
  project,
  apiDocs,
  isFetchingApiDocs = false,
  onClickEdit = () => {},
  onClickViewDocs = () => {},
}) => {
  const { mutate: deleteProject } = useDeleteProject({})
  const [showApiKey, setShowApiKey] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)

  const onClickDelete = () => {
    onDeleteProject()
    deleteProject({ pathParams: { projectId: project._id as string } })
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(project.api_key)
      setCopySuccess(true)
    } catch (err) {
      console.error("Failed to copy API key:", err)
    }
  }
  const handleCloseSnackbar = () => {
    setCopySuccess(false)
  }

  return (
    <>
      <Box sx={{ width: "100%", display: "flex", flexDirection: "column", paddingTop: 3 }}>
        {apiDocs === undefined && isFetchingApiDocs ? (
          <CircularProgress />
        ) : apiDocs && !isFetchingApiDocs ? (
          <>
            <TextField
              variant="outlined"
              fullWidth
              value={project.api_key}
              onClick={handleCopy}
              InputProps={{
                readOnly: true,
                startAdornment: (
                  <InputAdornment position="start">
                    <Tooltip title={showApiKey ? "Hide API Key" : "Show API Key"}>
                      <IconButton
                        onClick={() => {
                          setShowApiKey(!showApiKey)
                        }}
                        edge="start"
                      >
                        {showApiKey ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip title="Copy API Key">
                      <IconButton onClick={handleCopy} edge="end">
                        <ContentCopyIcon />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
              type={showApiKey ? "text" : "password"}
              label="API Key"
              sx={{
                "& .MuiInputBase-input": {
                  cursor: "default",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "primary.main",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "primary.main",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "primary.main",
                },
              }}
            />
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
          </>
        ) : (
          <></>
        )}
        <Divider sx={{ marginY: 2 }}></Divider>

        <Box>
          <Button variant="contained" onClick={onClickViewDocs} sx={{ mr: 5 }}>
            view json
          </Button>
          <EditButton onClick={() => onClickEdit(project._id as string)} />
          <DeleteButton onClick={onClickDelete} />
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
      <Snackbar
        open={copySuccess}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: "100%" }}>
          API Key copied to clipboard!
        </Alert>
      </Snackbar>
    </>
  )
}

export default ProjectSingleOverview
