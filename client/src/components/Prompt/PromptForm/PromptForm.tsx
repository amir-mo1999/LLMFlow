"use client"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import Select, { SelectChangeEvent } from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"
import { AIFunctionT, PromptT } from "@/types"
import { useState } from "react"
import SingleShotPromptForm from "./SingleShotPromptForm"
import ChatPromptForm from "./ChatPromptForm"
import { Prompt } from "@/models"

interface PromptFormProps {
  aiFunction: AIFunctionT
}

const PromptForm: React.FC<PromptFormProps> = ({ aiFunction }) => {
  const [prompt, setPrompt] = useState<PromptT>(Prompt.parse({}))

  function onPromptTypeChange(e: SelectChangeEvent) {
    const aux = prompt
    aux.promptType = e.target.value as PromptT["promptType"]
    setPrompt({ ...aux })
  }

  return (
    <>
      <Typography>Select Prompt Type</Typography>
      <Select value={prompt.promptType} onChange={onPromptTypeChange}>
        <MenuItem value={"single_shot"}>Single Shot Prompt</MenuItem>
        <MenuItem value={"chat"}>Chat Prompt</MenuItem>
      </Select>
      {prompt.promptType === "single_shot" ? (
        <SingleShotPromptForm
          prompt={prompt}
          setPrompt={setPrompt}
          variables={aiFunction.input_variables}
        ></SingleShotPromptForm>
      ) : prompt.promptType === "chat" ? (
        <ChatPromptForm prompt={prompt} setPrompt={setPrompt}></ChatPromptForm>
      ) : (
        "Invalid Prompt Type"
      )}
    </>
  )
}

export default PromptForm
