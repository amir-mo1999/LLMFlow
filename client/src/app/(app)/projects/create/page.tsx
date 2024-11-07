"use client"
import { ProjectForm } from "@/components"
import { useContext } from "react"
import { ProjectContext } from "@/contexts"

export default function Page() {
  const { aiFunctions, onSubmitProject } = useContext(ProjectContext)

  return <ProjectForm onSubmitProject={onSubmitProject} aiFunctions={aiFunctions}></ProjectForm>
}
