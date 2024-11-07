"use client"
import { AIFunctionSingleOverview } from "@/components"
import { useContext } from "react"
import { AIFunctionsContext } from "../layout"

export default function Page({ params }: { params: { aiFunctionID: string } }) {
  const {
    aiFunctions,
    onDeleteAIFunction,
    onClickEdit,
    onClickAddPrompt,
    setSelectedAIFunctionIndx,
  } = useContext(AIFunctionsContext)

  const aiFunction = aiFunctions.find((aiFunction) => aiFunction._id === params.aiFunctionID)

  if (aiFunction === undefined) return <></>

  setSelectedAIFunctionIndx(
    aiFunctions.findIndex((aiFunction) => aiFunction._id === params.aiFunctionID)
  )

  return (
    <AIFunctionSingleOverview
      onDeleteAIFunction={onDeleteAIFunction}
      aiFunction={aiFunction}
      onClickEdit={onClickEdit}
      onClickAddPrompt={onClickAddPrompt}
    ></AIFunctionSingleOverview>
  )
}
