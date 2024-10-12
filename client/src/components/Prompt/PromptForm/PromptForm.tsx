"use client"
import Typography from "@mui/material/Typography"
import Select, { SelectChangeEvent } from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"
import { useEffect, useState } from "react"
import { PromptRouteInput, PromptMessage, AIFunction } from "@/api/apiSchemas"
import { usePostPrompt } from "@/api/apiComponents"
import Button from "@mui/material/Button"
import Box from "@mui/material/Box"
import TextField from "@mui/material/TextField"

interface PromptFormProps {
  aiFunctions: AIFunction[]
}

const PromptForm: React.FC<PromptFormProps> = ({ aiFunctions }) => {
  const [selectedAIFunctionIndx, setSelectedAIFunctionIndx] = useState<number>(0)
  const [messages, setMessages] = useState<PromptMessage[]>([{ role: "user", content: "" }])
  const [disableSubmit, setDisableSubmit] = useState<boolean>(true)

  const inputVarsInMessage = (message: string) => {
    if (!selectedAIFunctionIndx) return false

    const aiFunction = aiFunctions[selectedAIFunctionIndx]
    if (
      aiFunction.input_variables.every((inputVariable) =>
        message.includes("{{" + inputVariable.name + "}}")
      )
    )
      return true
    else return false
  }

  const updateDisableSubmit = () => {
    let messagesJoined: string = ""

    if (messages.some((msg) => msg.content === "")) {
      messagesJoined = ""
    } else {
      messagesJoined = ""
      messages.forEach((msg) => (messagesJoined += msg.content))
    }

    if (inputVarsInMessage(messagesJoined)) setDisableSubmit(false)
    else setDisableSubmit(true)
  }

  useEffect(updateDisableSubmit, [messages])

  const onSelectedAIFunctionChange = (e: SelectChangeEvent) => {
    setSelectedAIFunctionIndx(Number(e.target.value))
  }

  const { mutate: postPrompt } = usePostPrompt({
    onSuccess: () => {},
    onError: (err) => {},
  })

  const onClickSubmit = () => {
    if (!selectedAIFunctionIndx) {
      return
    }
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
  return (
    <Box sx={{ width: "100%" }}>
      <Select value={selectedAIFunctionIndx.toString()} onChange={onSelectedAIFunctionChange}>
        {aiFunctions.map((aiFunction, indx) => {
          return (
            <MenuItem key={indx} value={indx}>
              {aiFunction.name}
            </MenuItem>
          )
        })}
      </Select>
      <Typography>Select Prompt Type</Typography>
      <Box sx={{ width: "100%" }}>
        {messages.map((message, index) => (
          <Box key={index} sx={{ marginBottom: 2 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                marginBottom: 1,
              }}
            >
              <Box sx={{ minWidth: 120 }}>
                <Select
                  value={message.role}
                  onChange={(e) =>
                    handleRoleChange(index, e.target.value as "user" | "system" | "assistant")
                  }
                  fullWidth
                >
                  <MenuItem value="user">User</MenuItem>
                  <MenuItem value="system">System</MenuItem>
                  <MenuItem value="assistant">Assistant</MenuItem>
                </Select>
              </Box>
              <TextField
                label="Content"
                value={message.content}
                onChange={(e) => handleContentChange(index, e.target.value)}
                multiline
                minRows={3}
                fullWidth
              />
            </Box>
          </Box>
        ))}
        <Box textAlign="center">
          <Button variant="contained" color="primary" onClick={addMessage}>
            Add Message
          </Button>
        </Box>
      </Box>
      {aiFunctions[selectedAIFunctionIndx].input_variables.map((variable, indx) => (
        <Typography key={indx}>- {variable.name}</Typography>
      ))}
      <Button variant="contained" onClick={onClickSubmit} disabled={disableSubmit}>
        Add Prompt
      </Button>
    </Box>
  )
}

export default PromptForm
