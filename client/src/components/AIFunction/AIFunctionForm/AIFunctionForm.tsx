"use client"
import * as React from "react"
import { MainContentWrapper } from "@/components"
import { useState } from "react"
import InputVariableForm from "./InputVariableForm"
import Typography from "@mui/material/Typography"
import TextField from "@mui/material/TextField"
import { InputVariableT } from "@/types"

//TODO: add validation for the function name so there is no doubles

interface AIFunctionFormProps {}

const AIFunctionForm: React.FC<AIFunctionFormProps> = () => {
  // function Name stuff
  const [functionName, setFunctionName] = useState<string>("")
  const [functionNameError, setFunctionNameError] = useState<boolean>(false)
  const [functionNameHelperText, setFunctionNameHelperText] = useState<boolean>(false)
  const onFunctionNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFunctionName(e.target.value)
  }

  // description stuff
  const [description, setDescription] = useState<string>("")
  const [descriptionError, setDescriptionError] = useState<boolean>(false)
  const [descriptionHelperText, setDescriptionHelperText] = useState<boolean>(false)
  const onDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value)
  }

  // input variables stuff
  const [inputVariables, setInputVariables] = useState<Array<InputVariableT>>([])

  return (
    <MainContentWrapper>
      <Typography>AI Function Name</Typography>
      <TextField
        value={functionName}
        error={functionNameError}
        helperText={functionNameHelperText}
        required={true}
        onChange={onFunctionNameChange}
      ></TextField>

      <Typography>Description</Typography>
      <TextField
        multiline
        value={description}
        error={descriptionError}
        helperText={descriptionHelperText}
        required={true}
        onChange={onDescriptionChange}
        minRows={10}
        maxRows={10}
      ></TextField>

      <Typography>Variables</Typography>
      <InputVariableForm
        inputVariables={inputVariables}
        setInputVariables={setInputVariables}
      ></InputVariableForm>
    </MainContentWrapper>
  )
}

export default AIFunctionForm
