"use client"
import { AIFunctionForm } from "@/components"
import { useContext } from "react"
import { AIFunctionsContext } from "@/contexts"

export default function Page() {
  const { addAIFunction } = useContext(AIFunctionsContext)

  return <AIFunctionForm addAIFunction={addAIFunction}></AIFunctionForm>
}
