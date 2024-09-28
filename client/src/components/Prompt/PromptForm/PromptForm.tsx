"use client"
import Typography from "@mui/material/Typography"
import Select, { SelectChangeEvent } from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"
import { useState } from "react"
import SingleShotPromptForm from "./SingleShotPromptForm"
import ChatPromptForm from "./ChatPromptForm"
import { PromptRouteInput, PromptMessage } from "@/api/apiSchemas"
import { useGetAiFunction, usePostPrompt } from "@/api/apiComponents"
import Button from "@mui/material/Button"
import { useRouter } from "next/navigation"

interface PromptFormProps {
  aiFunctionID: string
}

const PromptForm: React.FC<PromptFormProps> = ({ aiFunctionID }) => {
  const router = useRouter()

  const { data: aiFunction } = useGetAiFunction({
    pathParams: { aiFunctionId: aiFunctionID },
  })
  const [type, setType] = useState<PromptRouteInput["prompt_type"]>("single_shot")
  const [messages, setMessages] = useState<PromptMessage[]>([])
  const [message, setMessage] = useState<string>("")

  const {
    mutate: postPrompt,
    isError,
    data,
    error,
  } = usePostPrompt({
    onSuccess: () => {
      router.push("/ai-function/" + aiFunctionID)
    },
    onError: (err) => {
      console.log("error status", err)
    },
  })

  const onClickSubmit = () => {
    const newPrompt: PromptRouteInput = {
      prompt_type: type,
      messages: messages,
      ai_function_id: aiFunctionID,
    }

    if (type === "single_shot") {
      newPrompt.messages = [{ role: "user", content: message }]
    }

    postPrompt({ body: newPrompt })
  }

  const onPromptTypeChange = (e: SelectChangeEvent) => {
    setType(e.target.value as PromptRouteInput["prompt_type"])
  }

  return !aiFunction ? (
    <>Not Found</>
  ) : (
    <>
      <Typography>Select Prompt Type</Typography>
      <Select value={type} onChange={onPromptTypeChange}>
        <MenuItem value={"single_shot"}>Single Shot Prompt</MenuItem>
        <MenuItem value={"chat"}>Chat Prompt</MenuItem>
      </Select>
      {type === "single_shot" ? (
        <SingleShotPromptForm
          message={message}
          setMessage={setMessage}
          variables={aiFunction ? aiFunction.input_variables : []}
        ></SingleShotPromptForm>
      ) : type === "chat" ? (
        <ChatPromptForm messages={messages} setMessages={setMessages}></ChatPromptForm>
      ) : (
        "Invalid Prompt Type"
      )}
      <Button variant="contained" onClick={onClickSubmit}>
        Add Prompt
      </Button>
    </>
  )
}

export default PromptForm
