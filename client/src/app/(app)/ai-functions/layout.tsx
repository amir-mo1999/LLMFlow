"use client"

import { ItemOverview, MainContentContainer, SideBarContainer, PageContainer } from "@/components"
import Button from "@mui/material/Button"
import { useState, createContext, useContext } from "react"
import { AIFunction } from "@/api/apiSchemas"
import { useRouter } from "next/navigation"
import { AppContext } from "../layout"

interface AIFunctionsContextProps {
  aiFunctions: AIFunction[]
  addAIFunction: (aiFunction: AIFunction) => void
  onDeleteAIFunction: () => void
  setSelectedAIFunctionIndx: (indx: number | undefined) => void
  setAIFunction: (aiFunction: AIFunction) => void
  onClickEdit: (aiFunctionID: string) => void
  onClickAddPrompt: (aiFunctionID: string) => void
}

export const AIFunctionsContext = createContext<AIFunctionsContextProps>({
  aiFunctions: [],
  addAIFunction: () => {},
  onDeleteAIFunction: () => {},
  setSelectedAIFunctionIndx: () => {},
  setAIFunction: () => {},
  onClickEdit: () => {},
  onClickAddPrompt: () => {},
})

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { aiFunctions, setAIFunctions } = useContext(AppContext)

  const [selectedAIFunctionIndx, setSelectedAIFunctionIndx] = useState<number | undefined>()

  const router = useRouter()

  const onClickCreate = () => {
    setSelectedAIFunctionIndx(undefined)
    router.push("/ai-functions/create")
  }

  const addAIFunction = (aiFunction: AIFunction) => {
    setAIFunctions([...aiFunctions, aiFunction])
    router.push("/ai-functions")
  }

  const onDeleteAIFunction = () => {
    router.push("/ai-functions")
    const updatedAIFunctions = aiFunctions.filter((_, i) => i !== selectedAIFunctionIndx)
    setAIFunctions(updatedAIFunctions)
    setSelectedAIFunctionIndx(undefined)
  }

  const onClickAIFunction = (indx: number) => {
    const f = () => {
      router.push(`/ai-functions/${aiFunctions[indx]._id}`)
      setSelectedAIFunctionIndx(indx)
    }
    return f
  }

  const setAIFunction = (newAIFunction: AIFunction) => {
    router.push("/ai-functions")
    const updateIndx = aiFunctions.findIndex((aiFunction) => aiFunction._id === newAIFunction._id)
    const newAIFunctions = [...aiFunctions]
    newAIFunctions[updateIndx] = newAIFunction
    setAIFunctions(newAIFunctions)
  }

  const onClickAddPrompt = (aiFunctionID: string) => {
    router.push(`/prompts/create/${aiFunctionID}`)
  }

  const onClickEdit = (aiFunctionID: string) => {
    router.push(`/ai-functions/edit/${aiFunctionID}`)
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
        <AIFunctionsContext.Provider
          value={{
            aiFunctions: aiFunctions,
            onDeleteAIFunction: onDeleteAIFunction,
            addAIFunction: addAIFunction,
            setSelectedAIFunctionIndx: setSelectedAIFunctionIndx,
            setAIFunction: setAIFunction,
            onClickEdit: onClickEdit,
            onClickAddPrompt: onClickAddPrompt,
          }}
        >
          {children}
        </AIFunctionsContext.Provider>
      </MainContentContainer>
    </PageContainer>
  )
}
