"use client"
import React, { useState, useEffect } from "react"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import Popover from "@mui/material/Popover"
import TextField from "@mui/material/TextField"
import InputVariableForm from "./InputVariableForm"
import {
  TestCaseInput,
  InputVariable,
  Assertion,
  AIFunctionRouteInput,
  AIFunction,
} from "@/api/apiSchemas"
import AssertionsForm from "./AssertionsForm.tsx/AssertionsForm"
import TestCasesForm from "./TestCasesForm/TestCasesForm"
import { usePostAiFunction } from "@/api/apiComponents"
import examples from "@/examples/aiFunctions.json"
import JSONSchemaForm from "@/components/JSONSchemaForm"

interface AIFunctionFormProps {
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>
  addAIFunction: (aiFunction: AIFunction) => void
}

const AIFunctionForm: React.FC<AIFunctionFormProps> = ({ setShowForm, addAIFunction }) => {
  const [name, setName] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const [inputVariables, setInputVariables] = useState<InputVariable[]>([])
  const [outputSchema, setOutputSchema] = useState<Object>({})
  const [assertions, setAssertions] = useState<Assertion[]>([])
  const [testCases, setTestCases] = useState<TestCaseInput[]>([])
  const [disableSubmit, setDisableSubmit] = useState<boolean>(true)

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)
  const open = Boolean(anchorEl)
  const id = open ? "simple-popover" : undefined

  //@ts-ignore
  let parsedExamples: AIFunctionRouteInput[] = examples
  const onClickCreateFromExample = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const onClickExample = (aiFunction: AIFunctionRouteInput) => {
    const f = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
      setName(aiFunction.name)
      setDescription(aiFunction.description)
      setInputVariables(aiFunction.input_variables)
      setAssertions(aiFunction.assert)
      setTestCases(aiFunction.test_cases)
      onClosePopover()
    }

    return f
  }

  const onClosePopover = () => {
    setAnchorEl(null)
  }

  const { mutate: postAiFunction } = usePostAiFunction({
    onSuccess: (response) => {
      setShowForm(false)
      addAIFunction(response)
    },
    onError: (err) => {
      console.log("error status", err)
    },
  })

  const onGenerateAssertionFromOutputSchema = () => {
    const newAssertion: Assertion = { type: "is-json" }
    setAssertions([...assertions, newAssertion])
  }

  const updateDisableSubmit = () => {
    console.log()
    if (name === "") setDisableSubmit(true)
    else if (description === "") setDisableSubmit(true)
    else if (inputVariables.some((inputVariable) => inputVariable.name === ""))
      setDisableSubmit(true)
    else if (Object.keys(outputSchema).length === 0) setDisableSubmit(true)
    else setDisableSubmit(false)
  }

  useEffect(updateDisableSubmit, [name, description, inputVariables, outputSchema])

  const onClickSubmit = () => {
    setDisableSubmit(true)
    const aiFunction: AIFunctionRouteInput = {
      name: name,
      description: description,
      input_variables: inputVariables,
      assert: assertions,
      test_cases: testCases,
    }

    postAiFunction({ body: aiFunction })
  }

  //useEffect(() => setTestCases([]), [inputVariables])
  return (
    <Box sx={{ width: "100%" }}>
      <Button variant="contained" onClick={onClickCreateFromExample}>
        Create From Example
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={onClosePopover}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        {parsedExamples.map((example, indx) => {
          return (
            <Typography
              key={indx}
              sx={{ p: 2, userSelect: "none" }}
              onClick={onClickExample(example)}
            >
              {example.name}
            </Typography>
          )
        })}
      </Popover>
      <Typography>Name</Typography>
      <TextField
        sx={{ width: "100%", paddingBottom: 2 }}
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Typography>Description</Typography>
      <TextField
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        multiline
        minRows={5}
        sx={{ width: "100%", paddingBottom: 2 }}
      />
      <Typography>Input Variables</Typography>
      <InputVariableForm
        inputVariables={inputVariables}
        setInputVariables={setInputVariables}
        sx={{ paddingBottom: 2 }}
      />
      <Typography>Output Schema</Typography>
      <JSONSchemaForm
        JSONSchema={outputSchema}
        setJSONSchema={setOutputSchema}
        onGenerateAssertion={onGenerateAssertionFromOutputSchema}
      ></JSONSchemaForm>
      <Typography>Output Assertions</Typography>
      <AssertionsForm assertions={assertions} setAssertions={setAssertions} />
      <Typography>Test Cases</Typography>
      <TestCasesForm
        inputVariables={inputVariables}
        testCases={testCases}
        setTestCases={setTestCases}
      ></TestCasesForm>
      <Button variant="contained" onClick={onClickSubmit} disabled={disableSubmit}>
        Create AI Function
      </Button>
    </Box>
  )
}

export default AIFunctionForm
