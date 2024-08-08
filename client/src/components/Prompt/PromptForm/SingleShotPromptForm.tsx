"use client"

import { Dispatch, SetStateAction } from "react"
import { PromptT, InputVariableT } from "@/types"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import { useState, useEffect } from "react"
import { Typography } from "@mui/material"

interface SingleShotPromptFormProps {
  prompt: PromptT
  setPrompt: Dispatch<SetStateAction<PromptT>>
  variables: Array<InputVariableT>
}

const SingleShotPromptForm: React.FC<SingleShotPromptFormProps> = ({
  prompt,
  setPrompt,
  variables,
}) => {
  const [promptMessage, setPromptMessage] = useState<string>("")

  const [disableSubmit, setDisableSubmit] = useState<boolean>(true)

  function onPromptMessageChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setPromptMessage(e.target.value)
  }

  function onSubmit() {}

  function updateDisableSubmit() {
    let disable = false
    variables.forEach((variable) => {
      if (!promptMessage.includes(`{{${variable.name}}}`)) disable = true
    })
    setDisableSubmit(disable)
  }
  useEffect(updateDisableSubmit, [promptMessage])

  return (
    <>
      <TextField
        value={promptMessage}
        onChange={onPromptMessageChange}
        multiline
        minRows={10}
        maxRows={20}
      ></TextField>
      <Typography>Must include the following variables:</Typography>
      {variables.map((variable, indx) => (
        <Typography key={indx}>- {variable.name}</Typography>
      ))}
      <Button variant="contained" disabled={disableSubmit} onClick={onSubmit}>
        Submit
      </Button>
    </>
  )
}

export default SingleShotPromptForm
