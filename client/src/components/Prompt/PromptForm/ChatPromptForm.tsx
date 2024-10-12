"use client"

import React from "react"
import Typography from "@mui/material/Typography"
import { Dispatch, SetStateAction } from "react"
import Box from "@mui/material/Box"
import Select from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import { PromptMessage } from "@/api/apiSchemas"

interface ChatPromptFormProps {
  messages: PromptMessage[]
  setMessages: Dispatch<SetStateAction<PromptMessage[]>>
}

const ChatPromptForm: React.FC<ChatPromptFormProps> = ({ messages, setMessages }) => {
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
  )
}

export default ChatPromptForm
