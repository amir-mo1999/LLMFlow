"use client"

import { useContext, useEffect } from "react"
import { ProjectContext } from "./layout"

export default function Page() {
  const { setSelectedProjectIndx } = useContext(ProjectContext)
  useEffect(() => setSelectedProjectIndx(undefined), [])
  return <></>
}
