"use client"
import React, { useState, useEffect, useRef } from "react"
import { InputVariableForm, JsonSchemaEditor, AssertionsForm, TestCasesForm } from "@/components"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import Alert from "@mui/material/Alert"
import TextField from "@mui/material/TextField"
import Checkbox from "@mui/material/Checkbox"
import ListItemText from "@mui/material/ListItemText"
import OutlinedInput from "@mui/material/OutlinedInput"
import CloseIcon from "@mui/icons-material/Close"
import IconButton from "@mui/material/IconButton"
import {
  parseJsonSchema,
  addTitlesToSchema,
  getAIFunctionDiff,
  providersArray,
  areKeysMatching,
} from "@/utils"
import {
  TestCaseInput,
  InputVariable,
  Assertion,
  AIFunctionRouteInput,
  AIFunction,
  JsonSchemaInput,
  Provider,
  GenParams,
} from "@/api/apiSchemas"
import Snackbar from "@mui/material/Snackbar"

import { useGenerateTestCases } from "@/api/apiComponents"
import Select, { SelectChangeEvent } from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"
import Divider from "@mui/material/Divider"
import { usePostAiFunction, usePatchAiFunction } from "@/api/apiComponents"
import examples from "@/examples/aiFunctions.json"

interface AIFunctionFormProps {
  addAIFunction: (_: AIFunction) => void
  aiFunction?: AIFunction
  setAIFunction?: (_: AIFunction) => void
}

const AIFunctionForm: React.FC<AIFunctionFormProps> = ({
  addAIFunction,
  aiFunction,
  setAIFunction = () => {},
}) => {
  const [initAIFunction] = useState<AIFunction>(
    aiFunction ? JSON.parse(JSON.stringify(aiFunction)) : undefined
  )

  const nameCharLimit = 40
  const descriptionCharLimit = 1000
  const nameRef = useRef<null | HTMLDivElement>(null)

  const [name, setName] = useState<string>(aiFunction ? aiFunction.name : "")
  const [nameError, setNameError] = useState<boolean>(false)
  const [description, setDescription] = useState<string>(aiFunction ? aiFunction.description : "")
  const [inputVariables, setInputVariables] = useState<InputVariable[]>(
    aiFunction ? [...aiFunction.input_variables] : []
  )
  const [outputSchema, setOutputSchema] = useState<JsonSchemaInput>(
    aiFunction
      ? { ...addTitlesToSchema(aiFunction.output_schema) }
      : {
          type: "string",
          title: "root",
        }
  )
  const [providers, setProviders] = useState<Provider[]>(aiFunction ? aiFunction.providers : [])
  const [useJsonSchema, setUseJsonSchema] = useState<boolean>(false)
  const [assertions, setAssertions] = useState<Assertion[]>([])
  const [jsonAssertion, setJsonAssertion] = useState<Assertion>()
  const [testCases, setTestCases] = useState<TestCaseInput[]>(
    aiFunction ? aiFunction.test_cases : []
  )
  const [disableSubmit, setDisableSubmit] = useState<boolean>(false)

  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [snackbarMsg, setSnackbarMsg] = useState("")

  useEffect(() => {
    if (aiFunction) {
      setAssertions([...aiFunction.assert.filter((assertion) => assertion.type !== "is-json")])

      if (aiFunction.output_schema.type === "object") {
        setUseJsonSchema(true)
        const jsonAssertionIndx = aiFunction.assert.findIndex(
          (assertion) => assertion.type === "is-json"
        )
        setJsonAssertion(aiFunction.assert[jsonAssertionIndx])
      }
    }
  }, [aiFunction])
  //@ts-expect-error: Did not type examples
  const parsedExamples: AIFunctionRouteInput[] = examples

  const onClickExample = (aiFunction: AIFunctionRouteInput) => {
    const f = () => {
      setName(aiFunction.name)
      setDescription(aiFunction.description)
      setInputVariables(aiFunction.input_variables)
      setProviders(aiFunction.providers)
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

  const onProvidersChange = (event: SelectChangeEvent<Provider[]>) => {
    const {
      target: { value },
    } = event
    setProviders((typeof value === "string" ? value.split(",") : value) as Provider[])
  }

  const { mutate: postAiFunction } = usePostAiFunction({
    onSuccess: (response) => {
      addAIFunction(response)
    },
    onError: (err) => {
      //@ts-expect-error: Fetcher does not parse error correctly
      if (err.stack.status === 409) {
        setNameError(true)
        if (nameRef.current) {
          nameRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
        }
      }
    },
  })

  const { mutate: patchAIFunction } = usePatchAiFunction({
    onSuccess: (response) => {
      setAIFunction(response)
    },
    onError: (err) => {
      //@ts-expect-error: Fetcher does not parse error correctly
      if (err.stack.status === 409) {
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
    else if (providers.length === 0) setDisableSubmit(true)
    else setDisableSubmit(false)
  }

  const { mutate: generateTestCases, isPending: isGeneratingTestCases } = useGenerateTestCases({
    onSuccess: (res) => {
      setOpenSnackbar(true)
      setSnackbarMsg(`${res.length} Test ${res.length === 1 ? "Case" : "Cases"} generated`)
      const newTestCases = [...testCases]

      res.forEach((testCase) => {
        const varNames = inputVariables.reduce((acc, inputVar) => {
          acc.push(inputVar.name)
          return acc
        }, [] as string[])

        if (areKeysMatching(testCase.variables, varNames)) {
          newTestCases.push({ vars: testCase.variables, assert: [] })
        }
      })
      setTestCases([...newTestCases])
    },
    onError: () => {
      setOpenSnackbar(true)
      setSnackbarMsg("Failed to generate Test Cases")
    },
  })

  const onGenerate = () => {
    const varNames = inputVariables.reduce((acc, inputVar) => {
      acc.push(inputVar.name)
      return acc
    }, [] as string[])

    if (testCases.length >= 1) {
      const testCase: GenParams["test_case"] = testCases[testCases.length - 1].vars

      const genParams: GenParams = {
        name: name,
        description: description,
        variables: varNames,
        test_case: testCase,
      }

      generateTestCases({ body: genParams })
    }
  }

  useEffect(updateDisableSubmit, [
    name,
    description,
    inputVariables,
    outputSchema,
    assertions,
    providers,
  ])

  useEffect(() => {
    if (useJsonSchema) {
      const parsedJsonSchema = parseJsonSchema(outputSchema)
      const outputSchemaAssertion: Assertion = {
        type: "is-json",
        value: parsedJsonSchema,
        weight: 10,
      }
      setJsonAssertion(outputSchemaAssertion)
    } else {
      setJsonAssertion(undefined)
    }
  }, [useJsonSchema, outputSchema])

  const onClickSubmit = () => {
    setDisableSubmit(true)

    const body: AIFunctionRouteInput = {
      name: name,
      description: description,
      input_variables: inputVariables,
      providers: providers,
      output_schema: useJsonSchema ? (jsonAssertion?.value as JsonSchemaInput) : { type: "string" },
      assert: jsonAssertion ? [jsonAssertion, ...assertions] : [...assertions],
      test_cases: testCases,
    }

    if (initAIFunction) {
      patchAIFunction({
        pathParams: { aiFunctionId: initAIFunction._id as string },
        body: getAIFunctionDiff(initAIFunction, body),
      })
    } else {
      postAiFunction({ body: body })
    }
  }

  return (
    <Box sx={{ width: "100%", display: "flex", flexDirection: "column" }}>
      <Box display={aiFunction ? "none" : "normal"}>
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
      </Box>

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
        Providers
      </Typography>
      <Select
        value={providers}
        multiple
        onChange={onProvidersChange}
        input={<OutlinedInput />}
        renderValue={(selected: Provider[]) => selected.join(", ")}
      >
        {providersArray.map((provider, indx) => (
          <MenuItem key={indx} value={provider}>
            <Checkbox checked={providers.includes(provider)} />
            <ListItemText primary={provider} />
          </MenuItem>
        ))}
      </Select>
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
        assertions={assertions}
        jsonAssertion={jsonAssertion}
        setAssertions={setAssertions}
      />
      <Divider sx={{ marginY: 2 }}></Divider>

      <TestCasesForm
        inputVariables={inputVariables}
        testCases={testCases}
        setTestCases={setTestCases}
        onGenerate={onGenerate}
        isGeneratingTestCases={isGeneratingTestCases}
      ></TestCasesForm>
      <Divider sx={{ marginY: 2 }}></Divider>

      <Button variant="contained" onClick={onClickSubmit} disabled={disableSubmit}>
        Submit
      </Button>

      <Snackbar
        open={openSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        message={snackbarMsg}
        action={
          <IconButton size="small" color="primary" onClick={() => setOpenSnackbar(false)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: "100%" }}>
          {snackbarMsg}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default AIFunctionForm
