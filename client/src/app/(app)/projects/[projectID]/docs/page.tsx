"use client"
import { useGetProjectApiDocs } from "@/api/apiComponents"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"
import { useState, useContext } from "react"
import Button from "@mui/material/Button"
import Snackbar from "@mui/material/Snackbar"
import Alert from "@mui/material/Alert"
import DownloadIcon from "@mui/icons-material/Download"
import { ProjectContext } from "@/contexts"

import ContentCopyIcon from "@mui/icons-material/ContentCopy"

export default function Page({ params }: { params: { projectID: string } }) {
  const { projects } = useContext(ProjectContext)
  const project = projects.find((project) => project._id === params.projectID)

  const { data: apiDocs } = useGetProjectApiDocs({
    pathParams: { projectId: params.projectID },
  })

  const [copySuccess, setCopySuccess] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(apiDocs, null, 2))
      setCopySuccess(true)
    } catch (err) {
      console.error("Failed to copy API key:", err)
    }
  }
  const handleCloseSnackbar = () => {
    setCopySuccess(false)
  }

  const downloadApiSpec = () => {
    const jsonString = JSON.stringify(apiDocs, null, 2)
    const blob = new Blob([jsonString], { type: "application/json" })
    const url = URL.createObjectURL(blob)

    const link = document.createElement("a")
    link.href = url
    link.download = `${project?.name.replace(" ", "-").toLowerCase()}-api-spec.json`

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    URL.revokeObjectURL(url)
  }

  if (!apiDocs || !project) return <></>

  return (
    <>
      <Box display="flex" flexDirection="column" alignItems="start" width="100%" gap={3}>
        <Box display="flex" alignItems="center" gap={2}>
          <Button variant="contained" onClick={handleCopy}>
            <ContentCopyIcon />
          </Button>
          <Button variant="contained" onClick={downloadApiSpec}>
            <DownloadIcon />
          </Button>
        </Box>
        <Typography>{JSON.stringify(apiDocs, null, 2)}</Typography>
      </Box>
      <Snackbar
        open={copySuccess}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: "100%" }}>
          API docs copied to clipboard!
        </Alert>
      </Snackbar>
    </>
  )
}
