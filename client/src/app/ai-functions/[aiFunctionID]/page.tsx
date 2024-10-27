"use client"
import { AIFunctionSingleOverview } from "@/components"
import { useContext } from "react"
import { AIFunctionsContext } from "../layout"

export default function Page({ params }: { params: { aiFunctionID: string } }) {
  const aiFunctionID = params.aiFunctionID
  const { aiFunctions, onDeleteAIFunction } = useContext(AIFunctionsContext)

  const aiFunction = aiFunctions.find((aiFunction) => aiFunction._id === aiFunctionID)

  if (aiFunction === undefined) return <></>

  return (
    <AIFunctionSingleOverview
      onDeleteAIFunction={onDeleteAIFunction}
      aiFunction={aiFunction}
    ></AIFunctionSingleOverview>
  )
}
