"use client"
import React, { useState, useEffect } from "react"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import InputVariableForm from "./InputVariableForm"
import { TestCaseInput, InputVariable, Assertion, AIFunctionRouteInput } from "@/api/apiSchemas"
import AssertionsForm from "./AssertionsForm.tsx/AssertionsForm"
import TestCasesForm from "./TestCasesForm/TestCasesForm"
import { usePostAiFunction } from "@/api/apiComponents"
import { useRouter } from "next/navigation"

interface AIFunctionFormProps {}

const AIFunctionForm: React.FC<AIFunctionFormProps> = () => {
  const router = useRouter()

  const [name, setName] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const [inputVariables, setInputVariables] = useState<InputVariable[]>([{ name: "" }])
  const [assertions, setAssertions] = useState<Assertion[]>([])
  const [testCases, setTestCases] = useState<TestCaseInput[]>([])

  const {
    mutate: postAiFunction,
    isError,
    data,
    error,
  } = usePostAiFunction({
    onSuccess: (response) => {
      router.push("/")
    },
    onError: (err) => {
      console.log("error status", err.status)
    },
  })

  const onClickSubmit = () => {
    const aiFunction: AIFunctionRouteInput = {
      name: name,
      description: description,
      input_variables: inputVariables,
      assert: assertions,
      test_cases: testCases,
    }

    postAiFunction({ body: aiFunction })
  }

  useEffect(() => setTestCases([]), [inputVariables])
  return (
    <Box>
      <Typography>Name</Typography>
      <TextField value={name} onChange={(e) => setName(e.target.value)} />
      <Typography>Description</Typography>
      <TextField
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        multiline
        minRows={5}
      />
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
      <Button variant="contained" onClick={onClickSubmit}>
        Create AI Function
      </Button>
    </Box>
  )
}

export default AIFunctionForm
