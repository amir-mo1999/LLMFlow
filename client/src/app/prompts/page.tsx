"use client"

import { useContext, useEffect } from "react"
import { PromptsContext } from "./layout"

export default function Page() {
  const { setSelectedPromptIndx } = useContext(PromptsContext)
  useEffect(() => setSelectedPromptIndx(undefined), [])
  return <></>
}
