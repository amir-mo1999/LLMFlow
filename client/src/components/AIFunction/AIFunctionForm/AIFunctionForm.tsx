"use client"
import React, { useState, useEffect } from "react"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import InputVariableForm from "./InputVariableForm"
import JsonSchemaEditor from "@/components/JsonSchemaEditor"

import {
  TestCaseInput,
  InputVariable,
  Assertion,
  AIFunctionRouteInput,
  AIFunction,
  JsonSchemaInput,
} from "@/api/apiSchemas"
import Select from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"
import Divider from "@mui/material/Divider"

import AssertionsForm from "./AssertionsForm.tsx/AssertionsForm"
import TestCasesForm from "./TestCasesForm/TestCasesForm"
import { usePostAiFunction } from "@/api/apiComponents"
import examples from "@/examples/aiFunctions.json"

interface AIFunctionFormProps {
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>
  addAIFunction: (aiFunction: AIFunction) => void
}

const AIFunctionForm: React.FC<AIFunctionFormProps> = ({ setShowForm, addAIFunction }) => {
  const [name, setName] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const [inputVariables, setInputVariables] = useState<InputVariable[]>([])
  const [outputSchema, setOutputSchema] = useState<JsonSchemaInput>({ type: "string" })
  const [assertions, setAssertions] = useState<Assertion[]>([])
  const [testCases, setTestCases] = useState<TestCaseInput[]>([])
  const [disableSubmit, setDisableSubmit] = useState<boolean>(true)

  //@ts-ignore
  let parsedExamples: AIFunctionRouteInput[] = examples

  const onClickExample = (aiFunction: AIFunctionRouteInput) => {
    const f = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
      setName(aiFunction.name)
      setDescription(aiFunction.description)
      setInputVariables(aiFunction.input_variables)
      setAssertions(aiFunction.assert)
      setTestCases(aiFunction.test_cases)
    }

    return f
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

  const updateDisableSubmit = () => {
    if (name === "") setDisableSubmit(true)
    else if (description === "") setDisableSubmit(true)
    else if (inputVariables.some((inputVariable) => inputVariable.name === ""))
      setDisableSubmit(true)
    else setDisableSubmit(false)
  }

  useEffect(updateDisableSubmit, [name, description, inputVariables, outputSchema])

  const onClickSubmit = () => {
    setDisableSubmit(true)
    const aiFunction: AIFunctionRouteInput = {
      name: name,
      description: description,
      input_variables: inputVariables,
      output_schema: outputSchema,
      assert: assertions,
      test_cases: testCases,
    }

    postAiFunction({ body: aiFunction })
  }

  //useEffect(() => setTestCases([]), [inputVariables])
  return (
    <Box sx={{ width: "100%", display: "flex", flexDirection: "column" }}>
      <Typography variant="h5" sx={{ paddingBottom: 1 }}>
        Create from Example
      </Typography>
      <Select renderValue={(p) => "Select an Example"} value="0" fullWidth>
        {parsedExamples.map((example, indx) => {
          return (
            <MenuItem
              onClick={onClickExample(parsedExamples[indx])}
              key={indx + 1}
              value={indx.toString()}
              sx={{ p: 2, userSelect: "none" }}
            >
              {example.name}
            </MenuItem>
          )
        })}
      </Select>
      <Divider sx={{ marginY: 2 }}></Divider>
      <Typography variant="h5" sx={{ paddingBottom: 1 }}>
        Name
      </Typography>
      <TextField sx={{ width: "100%" }} value={name} onChange={(e) => setName(e.target.value)} />
      <Divider sx={{ marginY: 2 }}></Divider>

      <Typography variant="h5" sx={{ paddingBottom: 1 }}>
        Description
      </Typography>
      <TextField
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        multiline
        minRows={5}
        sx={{ width: "100%" }}
      />
      <Divider sx={{ marginY: 2 }}></Divider>

      <InputVariableForm inputVariables={inputVariables} setInputVariables={setInputVariables} />
      <Divider sx={{ marginY: 2 }}></Divider>
      <JsonSchemaEditor schema={outputSchema} setSchema={setOutputSchema}></JsonSchemaEditor>
      <Divider sx={{ marginY: 2 }}></Divider>

      <AssertionsForm assertions={assertions} setAssertions={setAssertions} />
      <Divider sx={{ marginY: 2 }}></Divider>

      <TestCasesForm
        inputVariables={inputVariables}
        testCases={testCases}
        setTestCases={setTestCases}
      ></TestCasesForm>
      <Divider sx={{ marginY: 2 }}></Divider>

      <Button variant="contained" onClick={onClickSubmit} disabled={disableSubmit}>
        Create AI Function
      </Button>
    </Box>
  )
}

export default AIFunctionForm
