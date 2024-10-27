"use client"
import React, { useState, useEffect, useRef } from "react"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import InputVariableForm from "./InputVariableForm"
import JsonSchemaEditor from "@/components/JsonSchemaEditor"
import { parseJsonSchema } from "@/utils"
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
  addAIFunction: (aiFunction: AIFunction) => void
}

const AIFunctionForm: React.FC<AIFunctionFormProps> = ({ addAIFunction }) => {
  const nameCharLimit = 40
  const descriptionCharLimit = 1000
  const nameRef = useRef<null | HTMLDivElement>(null)

  const [name, setName] = useState<string>("")
  const [nameError, setNameError] = useState<boolean>(false)
  const [description, setDescription] = useState<string>("")
  const [inputVariables, setInputVariables] = useState<InputVariable[]>([])
  const [outputSchema, setOutputSchema] = useState<JsonSchemaInput>({
    type: "string",
    title: "root",
  })
  const [useJsonSchema, setUseJsonSchema] = useState<boolean>(false)
  const [assertions, setAssertions] = useState<Assertion[]>([])
  const [jsonAssertions, setJsonAssertions] = useState<Assertion[]>([])
  const [testCases, setTestCases] = useState<TestCaseInput[]>([])
  const [disableSubmit, setDisableSubmit] = useState<boolean>(true)

  //@ts-ignore
  let parsedExamples: AIFunctionRouteInput[] = examples

  const onClickExample = (aiFunction: AIFunctionRouteInput) => {
    const f = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
      setName(aiFunction.name)
      setDescription(aiFunction.description)
      setInputVariables(aiFunction.input_variables)
      setOutputSchema(aiFunction.output_schema)
      setAssertions(aiFunction.assert)
      setTestCases(aiFunction.test_cases)

      if (aiFunction.output_schema.type !== "string") {
        setUseJsonSchema(true)
      }
    }

    return f
  }

  const onNameChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newName = e.target.value
    if (newName.length <= nameCharLimit) {
      setName(e.target.value)
      setNameError(false)
    }
  }

  const onDescriptionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newDescription = e.target.value
    if (newDescription.length <= descriptionCharLimit) {
      setDescription(e.target.value)
    }
  }

  const { mutate: postAiFunction } = usePostAiFunction({
    onSuccess: (response) => {
      addAIFunction(response)
    },
    onError: (err) => {
      if (err.status === 409) {
        setNameError(true)
        if (nameRef.current) {
          nameRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
        }
      }
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

  useEffect(() => {
    if (useJsonSchema) {
      const parsedJsonSchema = parseJsonSchema(outputSchema)
      const outputSchemaAssertion: Assertion = {
        type: "is-json",
        value: parsedJsonSchema,
        weight: 10,
      }
      setJsonAssertions([outputSchemaAssertion])
    } else {
      setJsonAssertions([])
    }
  }, [useJsonSchema, outputSchema])

  const onClickSubmit = () => {
    setDisableSubmit(true)

    const aiFunction: AIFunctionRouteInput = {
      name: name,
      description: description,
      input_variables: inputVariables,
      output_schema: useJsonSchema
        ? (jsonAssertions[0].value as JsonSchemaInput)
        : { type: "string" },
      assert: [...assertions, ...jsonAssertions],
      test_cases: testCases,
    }

    postAiFunction({ body: aiFunction })
  }

  return (
    <Box sx={{ width: "100%", display: "flex", flexDirection: "column" }}>
      <Typography variant="h5" sx={{ paddingBottom: 1 }}>
        Create from Example
      </Typography>
      <Select
        renderValue={() => "Select an example"}
        defaultValue={"Select an example"}
        fullWidth
        MenuProps={{
          PaperProps: {
            style: {
              maxWidth: 200,
            },
          },
        }}
      >
        <MenuItem value="Select an example" sx={{ display: "none" }}>
          Select an example
        </MenuItem>
        {parsedExamples.map((example, indx) => {
          return (
            <MenuItem
              onClick={onClickExample(parsedExamples[indx])}
              key={indx + 1}
              value={indx.toString()}
              sx={{ p: 2, userSelect: "none" }}
            >
              <Box>
                <Typography variant="h6">{example.name}</Typography>
                <Typography
                  sx={{
                    display: "-webkit-box",
                    overflow: "hidden",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 1,
                  }}
                >
                  {example.description}
                </Typography>
              </Box>
            </MenuItem>
          )
        })}
      </Select>
      <Divider sx={{ marginY: 2 }}></Divider>
      <Typography variant="h5" sx={{ paddingBottom: 1 }}>
        Name
      </Typography>
      <TextField
        ref={nameRef}
        sx={{ width: "100%" }}
        value={name}
        onChange={onNameChange}
        helperText={`${name.length}/${nameCharLimit} ${nameError ? "AI Function with this name already exists" : ""}`}
        error={nameError}
      />
      <Divider sx={{ marginY: 2 }}></Divider>

      <Typography variant="h5" sx={{ paddingBottom: 1 }}>
        Description
      </Typography>
      <TextField
        value={description}
        onChange={onDescriptionChange}
        multiline
        minRows={5}
        helperText={`${description.length}/${descriptionCharLimit}`}
        sx={{ width: "100%" }}
      />
      <Divider sx={{ marginY: 2 }}></Divider>

      <InputVariableForm inputVariables={inputVariables} setInputVariables={setInputVariables} />
      <Divider sx={{ marginY: 2 }}></Divider>
      <Typography variant="h5" sx={{ paddingBottom: 1 }}>
        Output Type
      </Typography>
      <Select
        value={useJsonSchema ? "json" : "string"}
        size="small"
        sx={{ width: 100 }}
        onChange={(e) => {
          if (e.target.value === "string") setUseJsonSchema(false)
          else setUseJsonSchema(true)
        }}
      >
        <MenuItem value="string">string</MenuItem>
        <MenuItem value="json">json</MenuItem>
      </Select>
      {useJsonSchema ? (
        <>
          <Typography variant="h6" sx={{ my: 1 }}>
            JSON Schema
          </Typography>
          <JsonSchemaEditor schema={outputSchema} setSchema={setOutputSchema}></JsonSchemaEditor>
        </>
      ) : (
        <></>
      )}
      <Divider sx={{ marginY: 2 }}></Divider>

      <AssertionsForm
        assertions={[...assertions, ...jsonAssertions]}
        setAssertions={setAssertions}
      />
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
