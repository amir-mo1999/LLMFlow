"use client"
import { AIFunctionSingleOverview } from "@/components"
import { useState, useEffect } from "react"
import { useGetAiFunction, useGetPrompts } from "@/api/apiComponents"
import { Prompt, AIFunction } from "@/api/apiSchemas"

export default function Page({ params }: { params: { aiFunctionID: string } }) {
  const [aiFunction, setAIFunction] = useState<AIFunction>()
  const [prompts, setPrompts] = useState<Prompt[]>([])

  const [aiFunctionSet, setAIFunctionSet] = useState<boolean>(false)
  const [promptsSet, setPromptsSet] = useState<boolean>(false)

  const { data: aiFunctionAPI } = useGetAiFunction({
    pathParams: { aiFunctionId: params.aiFunctionID },
  })

  const { data: promptsAPI, isFetching } = useGetPrompts({
    pathParams: { aiFunctionId: params.aiFunctionID },
  })

  useEffect(() => {
    if (aiFunctionAPI && !aiFunctionSet) {
      setAIFunction(aiFunctionAPI)
      setAIFunctionSet(true)
    }
    if (promptsAPI && !promptsSet) {
      setPrompts(promptsAPI)
      setPromptsSet(true)
    }
  }, [prompts, aiFunctionAPI, isFetching])

  if (!aiFunction || !prompts) {
    return <></>
  }

  return (
    <AIFunctionSingleOverview
      aiFunction={aiFunction}
      prompts={prompts ? prompts : []}
      setPrompts={setPrompts}
    ></AIFunctionSingleOverview>
  )
}
