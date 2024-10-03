"use client"
import {
  AIFunctionOverview,
  MainContentContainer,
  SideBarContainer,
  PageContainer,
  SearchField,
  AIFunctionSingleOverview,
} from "@/components"
import Button from "@mui/material/Button"
import { useRouter } from "next/navigation"
import { useGetAiFunctions } from "@/api/apiComponents"
import { useState, useEffect } from "react"
import { AIFunction } from "@/api/apiSchemas"

export default function Home() {
  const router = useRouter()

  const [searchValue, setSearchValue] = useState("")
  const [selectedAIFunctionIndx, setSelectedAIFunctionIndx] = useState<number | undefined>()

  const { data: aiFunctions, isFetching } = useGetAiFunctions({})

  const [selectedAIFunction, setSelectedAIFunction] = useState<AIFunction | undefined>()

  useEffect(() => {
    console.log(selectedAIFunctionIndx)

    if (selectedAIFunctionIndx !== undefined && aiFunctions) {
      setSelectedAIFunction(aiFunctions[selectedAIFunctionIndx])
      console.log(selectedAIFunctionIndx)
    }
  }, [selectedAIFunctionIndx])

  return (
    <PageContainer>
      <SideBarContainer>
        <SearchField
          value={searchValue}
          setValue={setSearchValue}
          placeholder="AI Function Name"
        ></SearchField>
        <Button
          sx={{ marginTop: 2 }}
          variant="contained"
          onClick={() => {
            router.push("/create/ai-function")
          }}
        >
          Create AI Function
        </Button>
        <AIFunctionOverview
          aiFunctions={isFetching || !aiFunctions ? [] : aiFunctions}
          selectedAIFunctionIndx={selectedAIFunctionIndx}
          setSelectedAIFunctionIndx={setSelectedAIFunctionIndx}
        ></AIFunctionOverview>
      </SideBarContainer>
      <MainContentContainer>
        {selectedAIFunction ? (
          <AIFunctionSingleOverview aiFunction={selectedAIFunction}></AIFunctionSingleOverview>
        ) : (
          <></>
        )}
      </MainContentContainer>
    </PageContainer>
  )
}
