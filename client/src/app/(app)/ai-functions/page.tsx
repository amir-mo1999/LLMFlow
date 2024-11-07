"use client"

import { useContext, useEffect } from "react"
import { AIFunctionsContext } from "@/contexts"

export default function Page() {
  const { setSelectedAIFunctionIndx } = useContext(AIFunctionsContext)
  useEffect(() => setSelectedAIFunctionIndx(undefined), [])
  return <></>
}
