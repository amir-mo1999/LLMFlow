import React, { useState, useEffect } from "react"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import TextField from "@mui/material/TextField"
import InputVariableForm from "./InputVariableForm"
import { AIFunctionRouteInput, TestCaseInput, InputVariable, Assertion } from "@/api/apiSchemas"
import AssertionsForm from "./AssertionsForm.tsx/AssertionsForm"
import TestCasesForm from "./TestCasesForm/TestCasesForm"

interface AIFunctionFormProps {}

const AIFunctionForm: React.FC<AIFunctionFormProps> = () => {
  const [name, setName] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const [inputVariables, setInputVariables] = useState<InputVariable[]>([{ name: "" }])
  const [assertions, setAssertions] = useState<Assertion[]>([])
  const [testCases, setTestCases] = useState<TestCaseInput[]>([])

  useEffect(() => console.log("all assertions", assertions), [assertions])
  useEffect(() => setTestCases([]), [inputVariables])
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
      <Typography>Test Cases</Typography>
      <TestCasesForm
        inputVariables={inputVariables}
        testCases={testCases}
        setTestCases={setTestCases}
      ></TestCasesForm>
    </Box>
  )
}

export default AIFunctionForm
