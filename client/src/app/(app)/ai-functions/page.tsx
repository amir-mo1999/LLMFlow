"use client"

import { useContext, useEffect } from "react"
import { AIFunctionsContext } from "./layout"

export default function Page() {
  const { setSelectedAIFunctionIndx } = useContext(AIFunctionsContext)
  useEffect(() => setSelectedAIFunctionIndx(undefined), [])
  return <></>
}
