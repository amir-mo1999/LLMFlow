import React, { useState, useEffect } from "react"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import TextField from "@mui/material/TextField"
import InputVariableForm from "./InputVariableForm"
import { AIFunctionRouteInput } from "@/api/apiSchemas"
import AssertionsForm from "./AssertionsForm.tsx/AssertionsForm"

interface AIFunctionFormProps {}

const AIFunctionForm: React.FC<AIFunctionFormProps> = () => {
  const [name, setName] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const [inputVariables, setInputVariables] = useState<AIFunctionRouteInput["input_variables"]>([])
  const [assertions, setAssertions] = useState<AIFunctionRouteInput["assert"]>([])

  useEffect(() => console.log("all assertions", assertions), [assertions])
  return (
    <Box>
      <Typography>Name</Typography>
      <TextField value={name} onChange={(e) => setName(e.target.value)} />
      <Typography>Description</Typography>
      <TextField value={description} onChange={(e) => setDescription(e.target.value)} multiline />
      <Typography>Input Variables</Typography>
      <InputVariableForm inputVariables={inputVariables} setInputVariables={setInputVariables} />
      <Typography>Output Assertions</Typography>
      <AssertionsForm assertions={assertions} setAssertions={setAssertions} />
    </Box>
  )
}

export default AIFunctionForm
