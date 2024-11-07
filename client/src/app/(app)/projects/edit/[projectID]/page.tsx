"use client"
import { useContext } from "react"
import { ProjectContext } from "@/contexts"
import { ProjectForm } from "@/components"

export default function Page({ params }: { params: { projectID: string } }) {
  const { projects, aiFunctions, setProject, setSelectedProjectIndx } = useContext(ProjectContext)

  const project = projects.find((project) => project._id === params.projectID)

  if (project === undefined) return <></>
  setSelectedProjectIndx(projects.findIndex((project) => project._id === params.projectID))

  return (
    <ProjectForm
      editProject={project}
      setProject={setProject}
      aiFunctions={aiFunctions}
    ></ProjectForm>
  )
}
