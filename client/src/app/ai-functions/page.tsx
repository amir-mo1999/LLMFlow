"use client"
import {
  AIFunctionOverview,
  MainContentContainer,
  SideBarContainer,
  PageContainer,
  SearchField,
  AIFunctionSingleOverview,
  AIFunctionForm,
} from "@/components"
import Button from "@mui/material/Button"
import { useGetAiFunctions } from "@/api/apiComponents"
import { useState, useEffect } from "react"
import { AIFunction } from "@/api/apiSchemas"

export default function Home() {
  const [searchValue, setSearchValue] = useState("")
  const [selectedAIFunctionIndx, setSelectedAIFunctionIndx] = useState<number | undefined>()
  const [aiFunctions, setAIFunctions] = useState<AIFunction[]>([])
  const [showCreateForm, setShowCreateForm] = useState(false)

  const onClickCreate = () => {
    setShowCreateForm(true)
  }

  useEffect(() => {
    if (showCreateForm) setSelectedAIFunctionIndx(undefined)
  }, [showCreateForm])

  const addAIFunction = (aiFunction: AIFunction) => {
    setAIFunctions([...aiFunctions, aiFunction])
  }

  const onDeleteAIFunction = () => {
    const updatedAIFunctions = aiFunctions.filter((_, i) => i !== selectedAIFunctionIndx)
    setAIFunctions(updatedAIFunctions)
    setSelectedAIFunctionIndx(undefined)
  }

  const onClickAIFunction = (indx: number) => {
    const f = () => {
      setSelectedAIFunctionIndx(indx)
      setShowCreateForm(false)
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
        {showCreateForm ? (
          <AIFunctionForm
            setShowForm={setShowCreateForm}
            addAIFunction={addAIFunction}
          ></AIFunctionForm>
        ) : selectedAIFunctionIndx !== undefined && aiFunctions ? (
          <AIFunctionSingleOverview
            onDeleteAIFunction={onDeleteAIFunction}
            aiFunction={aiFunctions[selectedAIFunctionIndx]}
          ></AIFunctionSingleOverview>
        ) : (
          <></>
        )}
      </MainContentContainer>
    </PageContainer>
  )
}
