"use client"

import { PromptForm } from "@/components"
import { useAIFunction } from "@/hooks"

export default function Page({ params }: { params: { aiFunctionID: string } }) {
  const aiFunction = useAIFunction(params.aiFunctionID)

  if (!aiFunction) {
    return ""
  }

  return <PromptForm aiFunction={aiFunction}></PromptForm>
}
