"use client"

import { AIFunctionContextProvider } from "@/contexts"
import { ItemOverview, MainContentContainer, SideBarContainer, PageContainer } from "@/components"
import Button from "@mui/material/Button"
import { useState, useContext } from "react"
import { useRouter } from "next/navigation"
import { AppContext } from "@/contexts"

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { aiFunctions } = useContext(AppContext)

  const [selectedAIFunctionIndx, setSelectedAIFunctionIndx] = useState<number | undefined>()

  const router = useRouter()

  const onClickCreate = () => {
    setSelectedAIFunctionIndx(undefined)
    router.push("/ai-functions/create")
  }

  const onClickAIFunction = (indx: number) => {
    const f = () => {
      router.push(`/ai-functions/${aiFunctions[indx]._id}`)
      setSelectedAIFunctionIndx(indx)
    }
    return f
  }

  return (
    <PageContainer>
      <SideBarContainer>
        <Button sx={{ marginBottom: 2 }} variant="contained" onClick={onClickCreate}>
          Create AI Function
        </Button>
        <ItemOverview
          itemType="AI Function"
          selectedIndx={selectedAIFunctionIndx}
          items={aiFunctions}
          onClick={onClickAIFunction}
        ></ItemOverview>
      </SideBarContainer>
      <MainContentContainer>
        <AIFunctionContextProvider>{children}</AIFunctionContextProvider>
      </MainContentContainer>
    </PageContainer>
  )
}
