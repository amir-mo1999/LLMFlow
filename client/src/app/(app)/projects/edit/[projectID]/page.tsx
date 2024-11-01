"use client"
import { useContext } from "react"
import { ProjectContext } from "../../layout"
import { ProjectForm } from "@/components"

export default function Page({ params }: { params: { projectID: string } }) {
  const { projects, aiFunctions, prompts, setProject } = useContext(ProjectContext)

  const project = projects.find((project) => project._id === params.projectID)

  if (project === undefined) return <></>

  return (
    <ProjectForm
      editProject={project}
      setProject={setProject}
      aiFunctions={aiFunctions}
      prompts={prompts}
    ></ProjectForm>
  )
}
