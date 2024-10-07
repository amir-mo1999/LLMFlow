"use client"

import TextField from "@mui/material/TextField"
import { Dispatch, SetStateAction } from "react"
import { Typography } from "@mui/material"
import Box from "@mui/material/Box"

interface SingleShotPromptFormProps {
  message: string
  setMessage: Dispatch<SetStateAction<string>>
}

const SingleShotPromptForm: React.FC<SingleShotPromptFormProps> = ({ message, setMessage }) => {
  return (
    <Box sx={{ width: "100%" }}>
      <TextField
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        multiline
        minRows={10}
        maxRows={20}
      ></TextField>
      <Typography>Must include the following variables:</Typography>
    </Box>
  )
}

export default SingleShotPromptForm
