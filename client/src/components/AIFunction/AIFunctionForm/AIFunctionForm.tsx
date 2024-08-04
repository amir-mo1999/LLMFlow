"use client"
import * as React from "react"
import { useState } from "react"
import InputVariableForm from "./InputVariableForm"
import Typography from "@mui/material/Typography"
import TextField from "@mui/material/TextField"
import { InputVariableT, OutputAssertionT } from "@/types"
import OutputAssertionsForm from "./OutputAssertionsForm"

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

  // output assertions stuff
  const [outputAssertions, setOutputAssertions] = useState<Array<OutputAssertionT>>([])

  return (
    <>
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

      <Typography>Output Assertions</Typography>
      <OutputAssertionsForm
        outputAssertions={outputAssertions}
        setOutputAssertions={setOutputAssertions}
      ></OutputAssertionsForm>
    </>
  )
}

export default AIFunctionForm
