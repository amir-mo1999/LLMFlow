"use client"
import { AIFunctionSingleOverview } from "@/components"
import { useGetAiFunction, useGetPrompts } from "@/api/apiComponents"

export default function Page({ params }: { params: { aiFunctionID: string } }) {
  const { data: aiFunction } = useGetAiFunction({
    pathParams: { aiFunctionId: params.aiFunctionID },
  })

  const { data: prompts } = useGetPrompts({
    pathParams: { aiFunctionId: params.aiFunctionID },
  })

  if (!aiFunction) {
    return <></>
  }
  return (
    <AIFunctionSingleOverview
      aiFunction={aiFunction}
      prompts={prompts ? prompts : []}
    ></AIFunctionSingleOverview>
  )
}
