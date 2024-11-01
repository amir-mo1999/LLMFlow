"use client"
import { ProjectForm } from "@/components"
import { useContext } from "react"
import { ProjectContext } from "../layout"

export default function Page() {
  const { aiFunctions, prompts, onSubmitProject } = useContext(ProjectContext)

  return (
    <ProjectForm
      onSubmitProject={onSubmitProject}
      aiFunctions={aiFunctions}
      prompts={prompts}
    ></ProjectForm>
  )
}
