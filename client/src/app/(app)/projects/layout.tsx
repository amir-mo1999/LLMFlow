"use client"

import {
  MainContentContainer,
  SideBarContainer,
  PageContainer,
  SearchField,
  ItemOverview,
} from "@/components"
import Button from "@mui/material/Button"
import { useState, createContext, useContext } from "react"
import { AIFunction, Prompt, Project } from "@/api/apiSchemas"
import { useRouter } from "next/navigation"
import { AppContext } from "../layout"

interface ProjectContextProps {
  projects: Project[]
  aiFunctions: AIFunction[]
  prompts: Prompt[]
  onSubmitProject: (project: Project) => void
  setProject: (project: Project) => void
  onDeleteProject: () => void
  onClickEdit: (projectID: string) => void
  setSelectedProjectIndx: (indx: number | undefined) => void
}

export const ProjectContext = createContext<ProjectContextProps>({
  projects: [],
  aiFunctions: [],
  prompts: [],
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

  const [searchValue, setSearchValue] = useState("")
  const [selectedProjectIndx, setSelectedProjectIndx] = useState<number | undefined>()

  const router = useRouter()

  const onClickCreate = () => {
    setSelectedProjectIndx(undefined)
    router.push("/projects/create")
  }

  const addAIFunction = (aiFunction: AIFunction) => {
    setAIFunctions([...aiFunctions, aiFunction])
    router.push("/ai-functions")
  }

  const onDeleteProject = () => {
    router.push("/ai-functions")
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
        <SearchField
          value={searchValue}
          setValue={setSearchValue}
          placeholder="Project Name"
        ></SearchField>
        <Button sx={{ marginTop: 2 }} variant="contained" onClick={onClickCreate}>
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
            prompts: prompts,
            onSubmitProject: onSubmitProject,
            setProject: setProject,
            onDeleteProject: () => {},
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
