"use client"

import { useAIFunction } from "@/hooks"

export default function Page({ params }: { params: { aiFunctionID: string } }) {
  const aiFunction = useAIFunction(params.aiFunctionID)

  if (!aiFunction) {
    return <></>
  }

  console.log("AI Function:", aiFunction)
  return <div>AI Function ID: {params.aiFunctionID}</div>
}
