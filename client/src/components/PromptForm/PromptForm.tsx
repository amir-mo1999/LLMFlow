import React, { useEffect, useState, useRef } from "react"
import { Typography, Select, MenuItem, Button, Box, TextField, Chip, Paper } from "@mui/material"
import ClearIcon from "@mui/icons-material/Clear"
import { PromptRouteInput, PromptMessage, Prompt, AIFunction } from "@/api/apiSchemas"
import { AIFunctionPaper, SelectAIFunctionDialog } from "@/components"
import { usePostPrompt, usePatchPrompt } from "@/api/apiComponents"
import Divider from "@mui/material/Divider"
import AddIcon from "@mui/icons-material/Add"

interface PromptFormProps {
  addPrompt: (prompt: Prompt) => void
  aiFunctions: AIFunction[]
  selectedAIFunctionIndx?: number
  refetchAIFunctions: () => void
  edit?: boolean
  prompt?: Prompt
  setPromptMessages?: (promptID: string, messages: PromptMessage[]) => void
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

  const textFieldRefs = useRef<(HTMLTextAreaElement | null)[]>([])

  useEffect(() => {
    textFieldRefs.current = textFieldRefs.current.slice(0, messages.length)
  }, [messages])

  const inputVarsInMessage = (message: string) => {
    if (selectedAIFunctionIndx !== undefined) {
      const aiFunction = aiFunctions[selectedAIFunctionIndx]
      return aiFunction.input_variables.every((inputVariable) =>
        message.includes(`{{${inputVariable.name}}}`)
      )
    }
  }

  const updateDisableSubmit = () => {
    const messagesJoined = messages.every((msg) => msg.content !== "")
      ? messages.map((msg) => msg.content).join("")
      : ""

    setDisableSubmit(!inputVarsInMessage(messagesJoined))
  }

  useEffect(updateDisableSubmit, [messages, selectedAIFunctionIndx])

  const { mutate: postPrompt } = usePostPrompt({
    onSuccess: (response) => {
      addPrompt(response as Prompt)
      refetchAIFunctions()
    },
    onError: (err) => {},
  })

  const { mutate: patchPrompt } = usePatchPrompt({
    onSuccess: (response, vars) => {
      if (vars.body !== undefined && prompt) {
        const messages: PromptMessage[] = vars.body
        setPromptMessages(prompt._id as string, messages)
      }
    },
    onError: (err) => {},
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
          <Box sx={{ display: edit ? "none" : "normal" }}>
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

        {selectedAIFunctionIndx === undefined ? (
          <></>
        ) : (
          <>
            <Typography variant="h5" gutterBottom>
              Variables
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {aiFunctions[selectedAIFunctionIndx].input_variables.map((variable, indx) => (
                <Chip
                  key={indx}
                  label={variable.name}
                  onClick={() => insertVariable(variable.name, messages.length - 1)}
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>
            <Divider sx={{ marginY: 2 }}></Divider>
            <Box sx={{ display: "flex", flexDirection: "row", gap: 2, paddingBottom: 1 }}>
              <Typography variant="h5">Prompt Messages</Typography>

              <Button onClick={addMessage}>
                <AddIcon />
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
                    <Box
                      sx={{
                        display:
                          aiFunctions[selectedAIFunctionIndx].output_schema.type === "string"
                            ? "none"
                            : "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Button variant="contained" onClick={() => insertOutputSchema(index)}>
                        Insert Output Schema
                      </Button>
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
    </>
  )
}
export default PromptForm
