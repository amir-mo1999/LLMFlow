"use client"
import Typography from "@mui/material/Typography"
import Select, { SelectChangeEvent } from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"
import { AIFunctionT, PromptRouteInputT } from "@/types"
import { useState } from "react"
import SingleShotPromptForm from "./SingleShotPromptForm"
import ChatPromptForm from "./ChatPromptForm"
import { PromptRouteInput } from "@/models"

interface PromptFormProps {
  aiFunction: AIFunctionT
}

const PromptForm: React.FC<PromptFormProps> = ({ aiFunction }) => {
  const [prompt, setPrompt] = useState<PromptRouteInputT>(PromptRouteInput.parse({}))

  function onPromptTypeChange(e: SelectChangeEvent) {
    const aux = prompt
    aux.prompt_type = e.target.value as PromptRouteInputT["prompt_type"]
    setPrompt({ ...aux })
  }

  return (
    <>
      <Typography>Select Prompt Type</Typography>
      <Select value={prompt.prompt_type} onChange={onPromptTypeChange}>
        <MenuItem value={"single_shot"}>Single Shot Prompt</MenuItem>
        <MenuItem value={"chat"}>Chat Prompt</MenuItem>
      </Select>
      {prompt.prompt_type === "single_shot" ? (
        <SingleShotPromptForm
          promptType={prompt.prompt_type}
          setPrompt={setPrompt}
          aiFunctionID={aiFunction._id}
          variables={aiFunction.input_variables}
        ></SingleShotPromptForm>
      ) : prompt.prompt_type === "chat" ? (
        <ChatPromptForm prompt={prompt} setPrompt={setPrompt}></ChatPromptForm>
      ) : (
        "Invalid Prompt Type"
      )}
    </>
  )
}

export default PromptForm
