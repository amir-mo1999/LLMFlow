"use client"

import { useContext } from "react"
import { PromptsContext } from "../../layout"
import { PromptForm } from "@/components"

export default function Page({ params }: { params: { promptID: string } }) {
  const { prompts, promptNumbers, addPrompt, setPromptMessages, refetchAIFunctions, aiFunctions } =
    useContext(PromptsContext)

  const promptIndx = prompts.findIndex((prompt) => prompt._id === params.promptID)
  const prompt = prompts[promptIndx]
  const promptNumber = promptNumbers[promptIndx]
  const selectedAIFunctionIndx = aiFunctions.findIndex(
    (aiFunction) => aiFunction._id === prompt.ai_function_id
  )
  if (prompt === undefined) return <></>

  return (
    <PromptForm
      addPrompt={addPrompt}
      aiFunctions={aiFunctions}
      refetchAIFunctions={refetchAIFunctions}
      edit
      prompt={prompt}
      promptNumber={promptNumber}
      setPromptMessages={setPromptMessages}
      selectedAIFunctionIndx={selectedAIFunctionIndx}
    ></PromptForm>
  )
}
