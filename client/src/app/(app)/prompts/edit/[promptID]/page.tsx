"use client"

import { useContext } from "react"
import { PromptsContext } from "../../layout"
import { PromptForm } from "@/components"

export default function Page({ params }: { params: { promptID: string } }) {
  const {
    prompts,
    addPrompt,
    setPromptMessages,
    refetchAIFunctions,
    aiFunctions,
    setSelectedPromptIndx,
  } = useContext(PromptsContext)

  const promptIndx = prompts.findIndex((prompt) => prompt._id === params.promptID)
  const prompt = prompts[promptIndx]
  const selectedAIFunctionIndx = aiFunctions.findIndex(
    (aiFunction) => aiFunction._id === prompt.ai_function_id
  )
  if (prompt === undefined) return <></>

  setSelectedPromptIndx(prompts.findIndex((prompt) => prompt._id === params.promptID))

  return (
    <PromptForm
      addPrompt={addPrompt}
      aiFunctions={aiFunctions}
      refetchAIFunctions={refetchAIFunctions}
      edit
      prompt={prompt}
      setPromptMessages={setPromptMessages}
      selectedAIFunctionIndx={selectedAIFunctionIndx}
    ></PromptForm>
  )
}
