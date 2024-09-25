"use client"

import TextField from "@mui/material/TextField"
import { useState, Dispatch, SetStateAction } from "react"
import { Typography } from "@mui/material"
import { InputVariable } from "@/api/apiSchemas"

interface SingleShotPromptFormProps {
  message: string
  setMessage: Dispatch<SetStateAction<string>>
  variables: InputVariable[]
}

const SingleShotPromptForm: React.FC<SingleShotPromptFormProps> = ({
  message,
  setMessage,
  variables,
}) => {
  return (
    <>
      <TextField
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        multiline
        minRows={10}
        maxRows={20}
      ></TextField>
      <Typography>Must include the following variables:</Typography>
      {variables.map((variable, indx) => (
        <Typography key={indx}>- {variable.name}</Typography>
      ))}
    </>
  )
}

export default SingleShotPromptForm
