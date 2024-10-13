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
} from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete"
import { SelectChangeEvent } from "@mui/material/Select"
import { PromptRouteInput, PromptMessage, AIFunction, Prompt } from "@/api/apiSchemas"
import { usePostPrompt } from "@/api/apiComponents"

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
    <Box sx={{ width: "100%" }}>
      <Typography variant="h5" gutterBottom>
        Prompt Form
      </Typography>
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Select AI Function
        </Typography>
        <Select
          value={selectedAIFunctionIndx.toString()}
          onChange={onSelectedAIFunctionChange}
          fullWidth
        >
          {aiFunctions.map((aiFunction, indx) => (
            <MenuItem key={indx} value={indx}>
              {aiFunction.name}
            </MenuItem>
          ))}
        </Select>
      </Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Input Variables
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
      </Box>
      <Box sx={{ mb: 3 }}>
        {messages.map((message, index) => (
          <Paper
            key={index}
            elevation={3}
            sx={{
              p: 2,
              mb: 2,
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
                  sx={{ flexGrow: 1, mr: 2 }}
                >
                  <MenuItem value="user">User</MenuItem>
                  <MenuItem value="system">System</MenuItem>
                  <MenuItem value="assistant">Assistant</MenuItem>
                </Select>
                <IconButton
                  onClick={() => deleteMessage(index)}
                  disabled={messages.length === 1}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
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
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Button variant="outlined" onClick={() => insertOutputSchema(index)}>
                  Insert Output Schema
                </Button>
              </Box>
            </Box>
          </Paper>
        ))}
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
        <Button variant="contained" onClick={addMessage}>
          Add Message
        </Button>
        <Button variant="contained" onClick={onClickSubmit} disabled={disableSubmit}>
          Submit Prompt
        </Button>
      </Box>
    </Box>
  )
}

export default PromptForm
