"use client"

import { useGetAllPrompts, useGetAiFunctions, useGetProjects } from "@/api/apiComponents"
import { useState, useEffect, createContext } from "react"
import { Prompt, AIFunction, Project } from "@/api/apiSchemas"

interface AppContextProps {
  aiFunctions: AIFunction[]
  prompts: Prompt[]
  projects: Project[]
  setAIFunctions: (aiFunctions: AIFunction[]) => void
  setPrompts: (prompts: Prompt[]) => void
  setProjects: (projects: Project[]) => void
  refetchAIFunctions: () => void
  refetchPrompts: () => void
}

export const AppContext = createContext<AppContextProps>({
  aiFunctions: [],
  prompts: [],
  projects: [],
  setAIFunctions: () => {},
  setPrompts: () => {},
  setProjects: () => {},
  refetchAIFunctions: () => {},
  refetchPrompts: () => {},
})

export default function AppContextProvider({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [aiFunctions, setAIFunctions] = useState<AIFunction[]>([])
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [projects, setProjects] = useState<Project[]>([])

  const {
    data: aiFunctionsAPI,
    isFetching: isFetchingAIFunctions,
    refetch: refetchAIFunctions,
  } = useGetAiFunctions({})
  const {
    data: promptsAPI,
    isFetching: isFetchingPrompts,
    refetch: refetchPrompts,
  } = useGetAllPrompts({})
  const { data: projectsAPI, isFetching: isFetchingProjects } = useGetProjects({})

  useEffect(() => {
    if (aiFunctionsAPI && !isFetchingAIFunctions) {
      setAIFunctions(aiFunctionsAPI)
    }
  }, [aiFunctionsAPI, isFetchingAIFunctions, setAIFunctions])

  useEffect(() => {
    if (promptsAPI && !isFetchingPrompts) {
      setPrompts(promptsAPI)
    }
  }, [promptsAPI, isFetchingPrompts, setPrompts])

  useEffect(() => {
    if (projectsAPI && !isFetchingProjects) {
      setProjects(projectsAPI)
    }
  }, [projectsAPI, isFetchingProjects, setProjects])

  const contextValue: AppContextProps = {
    aiFunctions: aiFunctions,
    prompts: prompts,
    projects: projects,
    setAIFunctions,
    setPrompts,
    setProjects,
    refetchAIFunctions: refetchAIFunctions,
    refetchPrompts: refetchPrompts,
  }

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
}
