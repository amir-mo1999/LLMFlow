"use client"

import { useContext } from "react"
import { PromptsContext } from "../layout"
import { PromptForm } from "@/components"

export default function Page() {
  const { addPrompt, refetchAIFunctions, aiFunctions } = useContext(PromptsContext)

  return (
    <PromptForm
      addPrompt={addPrompt}
      aiFunctions={aiFunctions}
      refetchAIFunctions={refetchAIFunctions}
    ></PromptForm>
  )
}
