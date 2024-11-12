"use client"
import { useGetProjectApiDocs } from "@/api/apiComponents"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"
import { useState } from "react"
import Button from "@mui/material/Button"
import Snackbar from "@mui/material/Snackbar"
import Alert from "@mui/material/Alert"

import ContentCopyIcon from "@mui/icons-material/ContentCopy"

export default function Page({ params }: { params: { projectID: string } }) {
  const [copySuccess, setCopySuccess] = useState(false)

  const { data: apiDocs } = useGetProjectApiDocs({
    pathParams: { projectId: params.projectID },
  })
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

  if (!apiDocs) return <></>

  return (
    <>
      <Box display="flex" flexDirection="column" alignItems="start" width="100%" gap={3}>
        <Button variant="contained" onClick={handleCopy}>
          <ContentCopyIcon />
        </Button>
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
