"use client"

import { Dispatch, SetStateAction } from "react"
import { PromptRouteInputT, InputVariableT } from "@/types"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import { useState, useEffect } from "react"
import { Typography } from "@mui/material"
import { useRouter } from "next/navigation"
import { api } from "@/network"
import { PromptRouteInput } from "@/models"
import { useSession } from "next-auth/react"

interface SingleShotPromptFormProps {
  promptType: PromptRouteInputT["prompt_type"]
  setPrompt: Dispatch<SetStateAction<PromptRouteInputT>>
  aiFunctionID: string
  variables: Array<InputVariableT>
}

const SingleShotPromptForm: React.FC<SingleShotPromptFormProps> = ({
  promptType,
  setPrompt,
  aiFunctionID,
  variables,
}) => {
  // get access token
  const { data: session } = useSession()
  const accessToken = session?.user.access_token as string

  const [promptMessage, setPromptMessage] = useState<string>("")

  const [disableSubmit, setDisableSubmit] = useState<boolean>(true)

  function onPromptMessageChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setPromptMessage(e.target.value)
  }

  function onSubmit() {
    // construct the prompt route input object
    const promptRouteInput = PromptRouteInput.parse({
      ai_function_id: aiFunctionID,
      prompt_type: promptType,
      messages: [{ role: "user", content: promptMessage }],
    })

    // post the prompt
    console.log("Trying to post prompt:", promptRouteInput)
    api
      .postPrompt(accessToken, promptRouteInput)
      .then((res) => res.json())
      .then((data) => console.log(data))
  }

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
