"use client"

import { useAIFunction } from "@/hooks"
import { AIFunctionDetailedOverview } from "@/components"

export default function Page({ params }: { params: { aiFunctionID: string } }) {
  const aiFunction = useAIFunction(params.aiFunctionID)

  if (!aiFunction) {
    return <></>
  }

  return <AIFunctionDetailedOverview aiFunction={aiFunction}></AIFunctionDetailedOverview>
}
