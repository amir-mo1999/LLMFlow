import React, { useEffect, useState, useRef } from "react"
import { Typography, Select, MenuItem, Button, Box, TextField, Chip, Paper } from "@mui/material"
import ClearIcon from "@mui/icons-material/Clear"
import { SelectChangeEvent } from "@mui/material/Select"
import { PromptRouteInput, PromptMessage, AIFunction, Prompt } from "@/api/apiSchemas"
import { AIFunctionPaper } from "@/components/AIFunction"
import { usePostPrompt } from "@/api/apiComponents"
import Divider from "@mui/material/Divider"
import AddIcon from "@mui/icons-material/Add"
import theme from "@/theme"

interface PromptFormProps {
  aiFunctions: AIFunction[]
  addPrompt: (prompt: Prompt) => void
}

const PromptForm: React.FC<PromptFormProps> = ({ aiFunctions, addPrompt }) => {
  const [selectedAIFunctionIndx, setSelectedAIFunctionIndx] = useState<number>(0)
  const [messages, setMessages] = useState<PromptMessage[]>([{ role: "user", content: "" }])
  const [disableSubmit, setDisableSubmit] = useState<boolean>(true)
  const textFieldRefs = useRef<(HTMLTextAreaElement | null)[]>([])

  useEffect(() => {
    textFieldRefs.current = textFieldRefs.current.slice(0, messages.length)
  }, [messages])

  const inputVarsInMessage = (message: string) => {
    const aiFunction = aiFunctions[selectedAIFunctionIndx]
    return aiFunction.input_variables.every((inputVariable) =>
      message.includes(`{{${inputVariable.name}}}`)
    )
  }

  const updateDisableSubmit = () => {
    const messagesJoined = messages.every((msg) => msg.content !== "")
      ? messages.map((msg) => msg.content).join("")
      : ""

    setDisableSubmit(!inputVarsInMessage(messagesJoined))
  }

  useEffect(updateDisableSubmit, [messages, selectedAIFunctionIndx])

  const onSelectedAIFunctionChange = (e: SelectChangeEvent) => {
    setSelectedAIFunctionIndx(Number(e.target.value))
  }

  const { mutate: postPrompt } = usePostPrompt({
    onSuccess: (response) => {
      addPrompt(response as Prompt)
    },
    onError: (err) => {},
  })

  const onClickSubmit = () => {
    setDisableSubmit(true)
    const newPrompt: PromptRouteInput = {
      messages: messages,
      ai_function_id: aiFunctions[selectedAIFunctionIndx]._id as string,
    }
    postPrompt({ body: newPrompt })
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
    const schema = JSON.stringify(
      aiFunctions[selectedAIFunctionIndx].output_schema,
      (key, value) => {
        if (value !== null) return value
      },
      2
    )

    insertTextAtCursor("\n" + schema, index)
  }

  return (
    <Box sx={{ width: "100%", display: "flex", flexDirection: "column" }}>
      <Typography variant="h5" gutterBottom>
        Select AI Function
      </Typography>
      <Select
        value={selectedAIFunctionIndx.toString()}
        renderValue={() => aiFunctions[selectedAIFunctionIndx].name}
        onChange={onSelectedAIFunctionChange}
        sx={{ width: 500 }}
        MenuProps={{
          PaperProps: {
            style: {
              maxWidth: 100,
              borderRadius: 16,
              display: "flex",
              gap: 2,
              flexDirection: "column",
              padding: 1,
              background: theme.palette.background.default,
            },
          },
        }}
      >
        {aiFunctions.map((aiFunction, indx) => (
          <MenuItem
            key={indx}
            value={indx.toString()}
            sx={{
              padding: 0,
              borderRadius: 16,
            }}
          >
            <AIFunctionPaper aiFunction={aiFunction}></AIFunctionPaper>
          </MenuItem>
        ))}
      </Select>

      <Divider sx={{ marginY: 2 }}></Divider>

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
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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
    </Box>
  )
}

export default PromptForm
