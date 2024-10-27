"use client"

import {
  AIFunctionOverview,
  MainContentContainer,
  SideBarContainer,
  PageContainer,
  SearchField,
} from "@/components"
import Button from "@mui/material/Button"
import { useGetAiFunctions } from "@/api/apiComponents"
import { useState, useEffect, createContext } from "react"
import { AIFunction } from "@/api/apiSchemas"
import { useRouter } from "next/navigation"

interface AIFunctionsContextProps {
  aiFunctions: AIFunction[]
  addAIFunction: (aiFunction: AIFunction) => void
  onDeleteAIFunction: () => void
  setSelectedAIFunctionIndx: (indx: number | undefined) => void
}

export const AIFunctionsContext = createContext<AIFunctionsContextProps>({
  aiFunctions: [],
  addAIFunction: () => {},
  onDeleteAIFunction: () => {},
  setSelectedAIFunctionIndx: () => {},
})

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [searchValue, setSearchValue] = useState("")
  const [selectedAIFunctionIndx, setSelectedAIFunctionIndx] = useState<number | undefined>()
  const [aiFunctions, setAIFunctions] = useState<AIFunction[]>([])

  const router = useRouter()

  const onClickCreate = () => {
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

  const { data: aiFunctionsAPI, isFetching } = useGetAiFunctions({})

  useEffect(() => {
    if (aiFunctionsAPI && !isFetching) setAIFunctions(aiFunctionsAPI)
  }, [aiFunctionsAPI, isFetching])

  return (
    <PageContainer>
      <SideBarContainer>
        <SearchField
          value={searchValue}
          setValue={setSearchValue}
          placeholder="AI Function Name"
        ></SearchField>
        <Button sx={{ marginTop: 2 }} variant="contained" onClick={onClickCreate}>
          Create AI Function
        </Button>
        <AIFunctionOverview
          selectedIndx={selectedAIFunctionIndx}
          aiFunctions={isFetching || !aiFunctions ? [] : aiFunctions}
          onClick={onClickAIFunction}
        ></AIFunctionOverview>
      </SideBarContainer>
      <MainContentContainer>
        <AIFunctionsContext.Provider
          value={{
            aiFunctions: aiFunctions,
            onDeleteAIFunction: onDeleteAIFunction,
            addAIFunction: addAIFunction,
            setSelectedAIFunctionIndx: setSelectedAIFunctionIndx,
          }}
        >
          {children}
        </AIFunctionsContext.Provider>
      </MainContentContainer>
    </PageContainer>
  )
}
