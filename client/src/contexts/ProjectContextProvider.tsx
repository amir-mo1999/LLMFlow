"use client"

import { useState, createContext, useContext } from "react"
import { AIFunction, Project } from "@/api/apiSchemas"
import { useRouter } from "next/navigation"
import { AppContext } from "@/contexts"

interface ProjectContextProps {
  projects: Project[]
  aiFunctions: AIFunction[]
  onSubmitProject: (project: Project) => void
  setProject: (project: Project) => void
  onDeleteProject: () => void
  onClickEdit: (projectID: string) => void
  setSelectedProjectIndx: (indx: number | undefined) => void
}

export const ProjectContext = createContext<ProjectContextProps>({
  projects: [],
  aiFunctions: [],
  onSubmitProject: (project: Project) => {},
  setProject: (project: Project) => {},
  onDeleteProject: () => {},
  onClickEdit: (projectID: string) => {},
  setSelectedProjectIndx: (indx: number | undefined) => {},
})

export default function ProjectContextProvider({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { aiFunctions, projects, setProjects } = useContext(AppContext)

  const [selectedProjectIndx, setSelectedProjectIndx] = useState<number | undefined>()

  const router = useRouter()

  const onDeleteProject = () => {
    router.push("/projects")
    const updatedProjects = projects.filter((_, i) => i !== selectedProjectIndx)
    setProjects(updatedProjects)
    setSelectedProjectIndx(undefined)
  }

  const onSubmitProject = (project: Project) => {
    router.push("/projects")
    setProjects([...projects, project])
  }

  const onClickEdit = (projectID: string) => {
    router.push(`/projects/edit/${projectID}`)
  }
  const setProject = (newProject: Project) => {
    router.push("/projects")
    const updateIndx = projects.findIndex((project) => project._id === newProject._id)
    const newProjects = [...projects]
    newProjects[updateIndx] = newProject
    setProjects(newProjects)
    setSelectedProjectIndx(undefined)
  }

  return (
    <ProjectContext.Provider
      value={{
        projects: projects,
        aiFunctions: aiFunctions,
        onSubmitProject: onSubmitProject,
        setProject: setProject,
        onDeleteProject: onDeleteProject,
        onClickEdit: onClickEdit,
        setSelectedProjectIndx: (indx: number | undefined) => {},
      }}
    >
      {children}
    </ProjectContext.Provider>
  )
}
