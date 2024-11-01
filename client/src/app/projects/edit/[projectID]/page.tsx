"use client"
import { useContext } from "react"
import { AIFunctionsContext } from "../../layout"
import { AIFunctionForm } from "@/components"

export default function Page({ params }: { params: { aiFunctionID: string } }) {
  const { aiFunctions, setAIFunction } = useContext(AIFunctionsContext)

  const aiFunction = aiFunctions.find((aiFunction) => aiFunction._id === params.aiFunctionID)

  if (aiFunction === undefined) return <></>

  return (
    <AIFunctionForm
      aiFunction={aiFunction}
      setAIFunction={setAIFunction}
      addAIFunction={() => {}}
    ></AIFunctionForm>
  )
}
