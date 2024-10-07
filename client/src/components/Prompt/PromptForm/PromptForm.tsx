"use client"
import Typography from "@mui/material/Typography"
import Select, { SelectChangeEvent } from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"
import { useEffect, useState } from "react"
import SingleShotPromptForm from "./SingleShotPromptForm"
import ChatPromptForm from "./ChatPromptForm"
import { PromptRouteInput, PromptMessage, AIFunction } from "@/api/apiSchemas"
import { usePostPrompt } from "@/api/apiComponents"
import Button from "@mui/material/Button"
import Box from "@mui/material/Box"

interface PromptFormProps {
  aiFunctions: AIFunction[]
}

const PromptForm: React.FC<PromptFormProps> = ({ aiFunctions }) => {
  const [selectedAIFunctionIndx, setSelectedAIFunctionIndx] = useState<number>(0)
  const [type, setType] = useState<PromptRouteInput["prompt_type"]>("single_shot")
  const [messages, setMessages] = useState<PromptMessage[]>([{ role: "user", content: "" }])
  const [message, setMessage] = useState<string>("")
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

    if (type === "single_shot") {
      messagesJoined = message
    } else if (type === "chat") {
      if (messages.some((msg) => msg.content === "")) {
        messagesJoined = ""
      } else {
        messagesJoined = ""
        messages.forEach((msg) => (messagesJoined += msg.content))
      }
    }

    if (inputVarsInMessage(messagesJoined)) setDisableSubmit(false)
    else setDisableSubmit(true)
  }

  useEffect(updateDisableSubmit, [message, messages])

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
      prompt_type: type,
      messages: messages,
      ai_function_id: aiFunctions[selectedAIFunctionIndx]._id as string,
    }

    if (type === "single_shot") {
      newPrompt.messages = [{ role: "user", content: message }]
    }

    postPrompt({ body: newPrompt })
  }

  const onPromptTypeChange = (e: SelectChangeEvent) => {
    setType(e.target.value as PromptRouteInput["prompt_type"])
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
      <Select value={type} onChange={onPromptTypeChange}>
        <MenuItem value={"single_shot"}>Single Shot Prompt</MenuItem>
        <MenuItem value={"chat"}>Chat Prompt</MenuItem>
      </Select>
      {type === "single_shot" ? (
        <SingleShotPromptForm message={message} setMessage={setMessage}></SingleShotPromptForm>
      ) : type === "chat" ? (
        <ChatPromptForm messages={messages} setMessages={setMessages}></ChatPromptForm>
      ) : (
        "Invalid Prompt Type"
      )}
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
