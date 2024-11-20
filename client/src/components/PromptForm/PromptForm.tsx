import React, { useEffect, useState, useRef } from "react"
import {
  Typography,
  Select,
  MenuItem,
  Button,
  Box,
  TextField,
  Chip,
  Paper,
  IconButton,
  Alert,
} from "@mui/material"
import ClearIcon from "@mui/icons-material/Clear"
import {
  PromptRouteInput,
  PromptMessage,
  Prompt,
  AIFunction,
  GenParams,
  RoleEnum,
  GenRole,
} from "@/api/apiSchemas"
import { AIFunctionPaper, HelpIcon, SelectAIFunctionDialog } from "@/components"
import { usePostPrompt, usePatchPrompt } from "@/api/apiComponents"
import Divider from "@mui/material/Divider"
import Snackbar from "@mui/material/Snackbar"
import AddIcon from "@mui/icons-material/Add"
import CloseIcon from "@mui/icons-material/Close"
import { useGeneratePromptMessages } from "@/api/apiComponents"
import CircularProgress from "@mui/material/CircularProgress"
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome"

interface PromptFormProps {
  addPrompt: (_: Prompt) => void
  aiFunctions: AIFunction[]
  selectedAIFunctionIndx?: number
  refetchAIFunctions: () => void
  edit?: boolean
  prompt?: Prompt
  setPromptMessages?: (_: string, __: PromptMessage[]) => void
}

const options: Intl.DateTimeFormatOptions = {
  timeZone: "Europe/Berlin",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
}

const PromptForm: React.FC<PromptFormProps> = ({
  addPrompt,
  aiFunctions,
  refetchAIFunctions,
  edit = false,
  prompt,
  selectedAIFunctionIndx: aiFunctionIndx,
  setPromptMessages = () => {},
}) => {
  const [selectedAIFunctionIndx, setSelectedAIFunctionIndx] = useState<number | undefined>(
    aiFunctionIndx
  )
  const [messages, setMessages] = useState<PromptMessage[]>(
    prompt ? prompt.messages : [{ role: "user", content: "" }]
  )
  const [disableSubmit, setDisableSubmit] = useState<boolean>(true)
  const [openSelectDialog, setOpenSelectDialog] = useState<boolean>(false)
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [snackbarMsg, setSnackbarMsg] = useState("")

  const textFieldRefs = useRef<(HTMLTextAreaElement | null)[]>([])

  useEffect(() => {
    textFieldRefs.current = textFieldRefs.current.slice(0, messages.length)
  }, [messages])

  useEffect(() => {
    const inputVarsInMessage = (message: string) => {
      if (selectedAIFunctionIndx !== undefined) {
        const aiFunction = aiFunctions[selectedAIFunctionIndx]
        return aiFunction.input_variables.every((inputVariable) =>
          message.includes(`{{${inputVariable.name}}}`)
        )
      }
    }
    const messagesJoined = messages.every((msg) => msg.content !== "")
      ? messages.map((msg) => msg.content).join("")
      : ""

    setDisableSubmit(!inputVarsInMessage(messagesJoined))
  }, [messages, selectedAIFunctionIndx, aiFunctions])

  const { mutate: postPrompt } = usePostPrompt({
    onSuccess: (response) => {
      addPrompt(response as Prompt)
      refetchAIFunctions()
    },
  })

  const { mutate: patchPrompt } = usePatchPrompt({
    onSuccess: (_, vars) => {
      if (vars.body !== undefined && prompt) {
        const messages: PromptMessage[] = vars.body
        setPromptMessages(prompt._id as string, messages)
      }
    },
  })

  const onClickSubmit = () => {
    setDisableSubmit(true)

    if (edit) {
      patchPrompt({ pathParams: { promptId: prompt?._id as string }, body: messages })
    } else {
      if (selectedAIFunctionIndx !== undefined) {
        const newPrompt: PromptRouteInput = {
          messages: messages,
          ai_function_id: aiFunctions[selectedAIFunctionIndx]._id as string,
        }
        postPrompt({ body: newPrompt })
      }
    }
  }

  useEffect(() => {
    if (!edit) setMessages([])
  }, [selectedAIFunctionIndx, edit])

  const handleRoleChange = (index: number, newRole: "user" | "system" | "assistant") => {
    const updatedMessages = [...messages]
    updatedMessages[index].role = newRole
    setMessages(updatedMessages)
  }

  const handleContentChange = (index: number, newContent: string) => {
    const updatedMessages = [...messages]
    updatedMessages[index].content = newContent
    setMessages(updatedMessages)
  }

  const addMessage = () => {
    setMessages([...messages, { role: "user", content: "" }])
  }

  const deleteMessage = (index: number) => {
    if (messages.length > 1) {
      const updatedMessages = messages.filter((_, i) => i !== index)
      setMessages(updatedMessages)
    }
  }

  const insertTextAtCursor = (text: string, index: number) => {
    const textField = textFieldRefs.current[index]
    if (textField) {
      const start = textField.selectionStart
      const end = textField.selectionEnd
      const content = textField.value
      const newContent = content.substring(0, start) + text + content.substring(end)
      handleContentChange(index, newContent)
      // Set cursor position after inserted text
      setTimeout(() => {
        textField.selectionStart = textField.selectionEnd = start + text.length
        textField.focus()
      }, 0)
    }
  }

  const insertVariable = (variable: string, index: number) => {
    insertTextAtCursor(`{{${variable}}}`, index)
  }

  const insertOutputSchema = (index: number) => {
    if (selectedAIFunctionIndx !== undefined) {
      const schema = JSON.stringify(
        aiFunctions[selectedAIFunctionIndx].output_schema,
        (key, value) => {
          if (value !== null) return value
        },
        2
      )

      insertTextAtCursor("\n" + schema, index)
    }
  }

  const onClickAIFunction = (indx: number) => {
    setSelectedAIFunctionIndx(indx)
  }

  const { mutate: generatePromptMessages, isPending: isGenerating } = useGeneratePromptMessages({
    onSuccess: (res) => {
      const newMessages: PromptMessage[] = []

      res.forEach((msg) => {
        const conversion: Record<GenRole, RoleEnum> = {
          System: "system",
          Assistant: "assistant",
          User: "user",
        }

        const newMsg: PromptMessage = {
          role: conversion[msg.role],
          content: msg.content,
        }

        newMessages.push(newMsg)
      })

      setMessages([...newMessages])

      setSnackbarMsg("Prompt generated")
      setOpenSnackbar(true)
    },
    onError: () => {
      setSnackbarMsg("Failed to generate prompt")
      setOpenSnackbar(true)
    },
  })

  const onClickGenerate = () => {
    if (selectedAIFunctionIndx !== undefined) {
      const aiFunction = aiFunctions[selectedAIFunctionIndx]

      const varNames = aiFunction.input_variables.reduce((acc, inputVar) => {
        acc.push(inputVar.name)
        return acc
      }, [] as string[])

      if (aiFunction.test_cases.length >= 1) {
        const body: GenParams = {
          name: aiFunction.name,
          description: aiFunction.description,
          test_case: aiFunction.test_cases[0].vars,
          variables: varNames,
          output_schema:
            aiFunction.output_schema.type === "string"
              ? null
              : JSON.stringify(aiFunction.output_schema, null, 2),
        }

        generatePromptMessages({ body: body })
      }
    }
  }

  if (aiFunctions.length === 0) {
    return <></>
  }

  return (
    <>
      <Box sx={{ width: "100%", display: "flex", flexDirection: "column" }}>
        {edit && prompt && (
          <Box>
            <Typography variant="h4">
              {prompt.ai_function_name} #{prompt.index}
            </Typography>
            {/* Creation Time */}
            <Typography>
              {new Date(prompt.creation_time).toLocaleString("de-DE", options)}
            </Typography>
          </Box>
        )}
        {selectedAIFunctionIndx !== undefined && (
          <Box>
            <Divider sx={{ marginY: 2 }}></Divider>
            <Typography variant="h5" gutterBottom>
              Selected AI Function
            </Typography>
            <AIFunctionPaper
              sx={{
                width: 500,
                "&:hover": {
                  backgroundColor: "white",
                },
              }}
              aiFunction={aiFunctions[selectedAIFunctionIndx]}
            ></AIFunctionPaper>
          </Box>
        )}
        <Box mt={2} sx={{ display: edit ? "none" : "normal" }}>
          <Button variant="contained" onClick={() => setOpenSelectDialog(true)}>
            Select AI Function
          </Button>
        </Box>
        <Divider sx={{ marginY: 2 }}></Divider>
        {selectedAIFunctionIndx !== undefined && (
          <>
            <Box sx={{ display: "flex", flexDirection: "row", gap: 2, paddingBottom: 1 }}>
              <Typography variant="h5">Prompt Messages</Typography>
              <HelpIcon title="Use System messages to define the overall rules, instructions and behavior of the model, User messages for the main input and context, and Assistant messages to give examples for what a model response may look like. The prompt must include all parameters of the AI Function. Consider also including the output schema for AI Functions with a structured output. You can click on the parameters and output schema to insert them." />
              <Button onClick={addMessage}>
                <AddIcon />
              </Button>
              <Button onClick={onClickGenerate} disabled={isGenerating ? true : false}>
                {isGenerating ? <CircularProgress size={23} /> : <AutoAwesomeIcon />}
              </Button>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {messages.map((message, index) => (
                <Paper
                  key={index}
                  elevation={3}
                  sx={{
                    p: 2,
                    "&:hover": {
                      backgroundColor: "white",
                    },
                  }}
                >
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Select
                        value={message.role}
                        onChange={(e) =>
                          handleRoleChange(index, e.target.value as "user" | "system" | "assistant")
                        }
                        sx={{ flexGrow: 1 }}
                      >
                        <MenuItem value="user">User</MenuItem>
                        <MenuItem value="system">System</MenuItem>
                        <MenuItem value="assistant">Assistant</MenuItem>
                      </Select>
                      {messages.length === 1 ? (
                        <></>
                      ) : (
                        <Button
                          onClick={() => deleteMessage(index)}
                          disabled={messages.length === 1}
                          color="primary"
                        >
                          <ClearIcon />
                        </Button>
                      )}
                    </Box>
                    <TextField
                      label="Content"
                      value={message.content}
                      onChange={(e) => handleContentChange(index, e.target.value)}
                      multiline
                      minRows={3}
                      fullWidth
                      inputRef={(el) => (textFieldRefs.current[index] = el)}
                    />
                    <Box display="flex" gap={1} alignItems="center">
                      <Chip
                        variant="outlined"
                        color="primary"
                        sx={{
                          display:
                            aiFunctions[selectedAIFunctionIndx].output_schema.type === "string"
                              ? "none"
                              : "flex",
                        }}
                        onClick={() => insertOutputSchema(index)}
                        label="Output Schema"
                      ></Chip>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        {aiFunctions[selectedAIFunctionIndx].input_variables.map(
                          (variable, indx) => (
                            <Chip
                              key={indx}
                              label={variable.name}
                              onClick={() => insertVariable(variable.name, messages.length - 1)}
                              color="primary"
                              variant="outlined"
                            />
                          )
                        )}
                      </Box>
                    </Box>
                  </Box>
                </Paper>
              ))}
            </Box>
            <Divider sx={{ marginY: 2 }}></Divider>
            <Button variant="contained" onClick={onClickSubmit} disabled={disableSubmit}>
              Submit Prompt
            </Button>
          </>
        )}
      </Box>
      <SelectAIFunctionDialog
        open={openSelectDialog}
        setOpen={setOpenSelectDialog}
        aiFunctions={aiFunctions}
        onClick={onClickAIFunction}
      ></SelectAIFunctionDialog>
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
    </>
  )
}
export default PromptForm
