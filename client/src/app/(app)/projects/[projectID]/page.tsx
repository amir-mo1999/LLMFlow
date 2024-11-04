"use client"
import { ProjectSingleOverview } from "@/components"
import { useContext } from "react"
import { ProjectContext } from "../layout"

export default function Page({ params }: { params: { projectID: string } }) {
  const { projects, onDeleteProject, aiFunctions, onClickEdit } = useContext(ProjectContext)

  const project = projects.find((project) => project._id === params.projectID)

  if (project === undefined) return <></>

  return (
    <ProjectSingleOverview
      onDeleteProject={onDeleteProject}
      project={project}
      aiFunctions={aiFunctions}
      onClickEdit={onClickEdit}
    ></ProjectSingleOverview>
  )
}
