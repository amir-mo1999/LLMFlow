"use client"
import { useContext } from "react"
import { AIFunctionsContext } from "../../layout"
import { AIFunctionForm } from "@/components"

export default function Page({ params }: { params: { aiFunctionID: string } }) {
  const { aiFunctions, setAIFunction, setSelectedAIFunctionIndx } = useContext(AIFunctionsContext)

  const aiFunction = aiFunctions.find((aiFunction) => aiFunction._id === params.aiFunctionID)

  if (aiFunction === undefined) return <></>

  setSelectedAIFunctionIndx(
    aiFunctions.findIndex((aiFunction) => aiFunction._id === params.aiFunctionID)
  )
  return (
    <AIFunctionForm
      aiFunction={aiFunction}
      setAIFunction={setAIFunction}
      addAIFunction={() => {}}
    ></AIFunctionForm>
  )
}
