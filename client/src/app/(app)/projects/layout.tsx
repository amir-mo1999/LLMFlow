"use client"

import { MainContentContainer, SideBarContainer, PageContainer, ItemOverview } from "@/components"
import Button from "@mui/material/Button"
import { useState, useContext } from "react"
import { useRouter } from "next/navigation"
import { AppContext, ProjectContextProvider } from "@/contexts"

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { projects } = useContext(AppContext)

  const [selectedProjectIndx, setSelectedProjectIndx] = useState<number | undefined>()

  const router = useRouter()

  const onClickCreate = () => {
    setSelectedProjectIndx(undefined)
    router.push("/projects/create")
  }

  const onClickProjects = (indx: number) => {
    const f = () => {
      router.push(`/projects/${projects[indx]._id}`)
      setSelectedProjectIndx(indx)
    }
    return f
  }

  return (
    <PageContainer>
      <SideBarContainer>
        <Button sx={{ marginBottom: 2 }} variant="contained" onClick={onClickCreate}>
          New Project
        </Button>
        <ItemOverview
          itemType="Project"
          selectedIndx={selectedProjectIndx}
          items={projects}
          onClick={onClickProjects}
        ></ItemOverview>
      </SideBarContainer>
      <MainContentContainer>
        <ProjectContextProvider> {children}</ProjectContextProvider>
      </MainContentContainer>
    </PageContainer>
  )
}
