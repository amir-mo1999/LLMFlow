"use client"

import { useContext } from "react"
import { PromptsContext } from "@/contexts"
import { PromptForm } from "@/components"

export default function Page({ params }: { params: { aiFunctionID: string } }) {
  const { addPrompt, refetchAIFunctions, aiFunctions } =
    useContext(PromptsContext)

  const selectedAIFunctionIndx = aiFunctions.findIndex(
    (aiFunction) => aiFunction._id === params.aiFunctionID
  )

  return (
    <PromptForm
      addPrompt={addPrompt}
      aiFunctions={aiFunctions}
      refetchAIFunctions={refetchAIFunctions}
      selectedAIFunctionIndx={selectedAIFunctionIndx}
    ></PromptForm>
  )
}
