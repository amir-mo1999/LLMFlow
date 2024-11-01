"use client"

import { MainContentContainer, SideBarContainer, PageContainer, SearchField } from "@/components"
import Button from "@mui/material/Button"
import { useGetAiFunctions, useGetAllPrompts } from "@/api/apiComponents"
import { useState, useEffect, createContext } from "react"
import { AIFunction, Prompt, Project } from "@/api/apiSchemas"
import { useRouter } from "next/navigation"

interface ProjectContextProps {
  projects: Project[]
  aiFunctions: AIFunction[]
  prompts: Prompt[]
  onSubmitProject: (project: Project) => void
  onPatchProject: (project: Partial<Project>) => void
  onDeleteProject: () => void
  onClickEdit: (projectID: string) => void
  setSelectedProjectIndx: (indx: number | undefined) => void
}

export const ProjectContext = createContext<ProjectContextProps>({
  projects: [],
  aiFunctions: [],
  prompts: [],
  onSubmitProject: (project: Project) => {},
  onPatchProject: (project: Partial<Project>) => {},
  onDeleteProject: () => {},
  onClickEdit: (projectID: string) => {},
  setSelectedProjectIndx: (indx: number | undefined) => {},
})

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [searchValue, setSearchValue] = useState("")
  const [projects, setProjects] = useState<Project[]>([])
  const [aiFunctions, setAIFunctions] = useState<AIFunction[]>([])
  const [prompts, setPrompts] = useState<Prompt[]>([])
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

  const setProject = (newProject: Project) => {
    router.push("/projects")
    const updateIndx = projects.findIndex((project) => project._id === newProject._id)
    const newProjects = [...projects]
    newProjects[updateIndx] = newProject
    setProjects(newProjects)
  }

  const { data: aiFunctionsAPI, isFetching: isFetchingAIFunctions } = useGetAiFunctions({})
  const { data: promptsAPI, isFetching: isFetchingPrompts } = useGetAllPrompts({})

  useEffect(() => {
    if (aiFunctionsAPI && !isFetchingAIFunctions) setAIFunctions(aiFunctionsAPI)
    if (promptsAPI && !isFetchingPrompts) setPrompts(promptsAPI)
  }, [aiFunctionsAPI, isFetchingAIFunctions, promptsAPI, isFetchingPrompts])

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
      </SideBarContainer>
      <MainContentContainer>
        <ProjectContext.Provider
          value={{
            projects: projects,
            aiFunctions: aiFunctions,
            prompts: prompts,
            onSubmitProject: (project: Project) => {},
            onPatchProject: (project: Partial<Project>) => {},
            onDeleteProject: () => {},
            onClickEdit: (projectID: string) => {},
            setSelectedProjectIndx: (indx: number | undefined) => {},
          }}
        >
          {children}
        </ProjectContext.Provider>
      </MainContentContainer>
    </PageContainer>
  )
}
