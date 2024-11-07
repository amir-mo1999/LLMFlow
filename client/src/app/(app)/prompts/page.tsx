"use client"

import { useContext, useEffect } from "react"
import { PromptsContext } from "@/contexts"

export default function Page() {
  const { setSelectedPromptIndx } = useContext(PromptsContext)
  useEffect(() => setSelectedPromptIndx(undefined), [setSelectedPromptIndx])
  return <></>
}
