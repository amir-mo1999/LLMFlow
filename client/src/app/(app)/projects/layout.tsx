"use client"

import { MainContentContainer, SideBarContainer, PageContainer, ItemOverview } from "@/components"
import Button from "@mui/material/Button"
import { useState, createContext, useContext } from "react"
import { AIFunction, Project } from "@/api/apiSchemas"
import { useRouter } from "next/navigation"
import { AppContext } from "../layout"

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

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { aiFunctions, setAIFunctions, prompts, setPrompts, projects, setProjects } =
    useContext(AppContext)

  const [selectedProjectIndx, setSelectedProjectIndx] = useState<number | undefined>()

  const router = useRouter()

  const onClickCreate = () => {
    setSelectedProjectIndx(undefined)
    router.push("/projects/create")
  }

  const onDeleteProject = () => {
    router.push("/projects")
    const updatedProjects = projects.filter((_, i) => i !== selectedProjectIndx)
    setProjects(updatedProjects)
    setSelectedProjectIndx(undefined)
  }

  const onClickProjects = (indx: number) => {
    const f = () => {
      router.push(`/projects/${projects[indx]._id}`)
      setSelectedProjectIndx(indx)
    }
    return f
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
    <PageContainer>
      <SideBarContainer>
        <Button sx={{ marginBottom: 2 }} variant="contained" onClick={onClickCreate}>
          Create Project
        </Button>
        <ItemOverview
          itemType="Project"
          selectedIndx={selectedProjectIndx}
          items={projects}
          onClick={onClickProjects}
        ></ItemOverview>
      </SideBarContainer>
      <MainContentContainer>
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
      </MainContentContainer>
    </PageContainer>
  )
}
