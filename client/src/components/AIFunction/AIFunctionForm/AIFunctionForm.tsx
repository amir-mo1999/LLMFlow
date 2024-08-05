"use client"
import * as React from "react"
import { useState, useEffect } from "react"
import InputVariableForm from "./InputVariableForm"
import Typography from "@mui/material/Typography"
import TextField from "@mui/material/TextField"
import { AIFunctionT, InputVariableT, OutputAssertionT } from "@/types"
import OutputAssertionsForm from "./OutputAssertionsForm"
import Button from "@mui/material/Button"
import { AIFunctionRouteInput } from "@/models"
import DatasetForm from "./DatasetForm"

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

  // validation dataset stuff
  const [dataset, setDataset] = useState<AIFunctionT["dataset"]>([])

  const [disableCreateButton, setDisableCreateButton] = useState<boolean>(true)
  function checkDisableCreateButton() {
    if (functionName === "" || description === "") {
      setDisableCreateButton(true)
    } else {
      setDisableCreateButton(false)
    }
  }
  useEffect(checkDisableCreateButton, [])
  useEffect(checkDisableCreateButton, [functionName, description])

  function onCreate() {
    const aiFunction = AIFunctionRouteInput.parse({
      name: functionName,
      description: description,
      input_variables: inputVariables,
      output_assertions: outputAssertions,
      dataset: dataset,
    })

    console.log(aiFunction)
  }
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

      <Typography>Validation Dataset</Typography>
      <DatasetForm
        inputVariables={inputVariables}
        dataset={dataset}
        setDataset={setDataset}
      ></DatasetForm>
      <Button variant="contained" disabled={disableCreateButton} onClick={onCreate}>
        Create
      </Button>
    </>
  )
}

export default AIFunctionForm
