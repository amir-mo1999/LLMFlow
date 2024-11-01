"use client"
import { ProjectSingleOverview } from "@/components"
import { useContext } from "react"
import { ProjectContext } from "../layout"
import { AIFunction, Prompt } from "@/api/apiSchemas"

export default function Page({ params }: { params: { projectID: string } }) {
  const { aiFunctions, prompts, projects, onDeleteProject, onClickEdit } =
    useContext(ProjectContext)

  const project = projects.find((project) => project._id === params.projectID)

  if (project === undefined) return <></>

  const projectAIFunctionsPrompts: [AIFunction, Prompt][] = project.prompt_ids.reduce(
    (acc, promptID) => {
      const prompt = prompts.find((p) => p._id === promptID)
      const aiFunction = aiFunctions.find((a) => a._id === prompt?.ai_function_id)
      if (prompt && aiFunction) acc.push([aiFunction, prompt])
      return acc
    },
    [] as [AIFunction, Prompt][]
  )

  return (
    <ProjectSingleOverview
      onDeleteProject={onDeleteProject}
      project={project}
      projectAIFunctionsPrompts={projectAIFunctionsPrompts}
      onClickEdit={onClickEdit}
    ></ProjectSingleOverview>
  )
}
