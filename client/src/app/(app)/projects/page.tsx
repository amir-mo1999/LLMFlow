"use client"

import { useContext, useEffect } from "react"
import { ProjectContext } from "@/contexts"

export default function Page() {
  const { setSelectedProjectIndx } = useContext(ProjectContext)
  useEffect(() => setSelectedProjectIndx(undefined), [setSelectedProjectIndx])
  return <></>
}
