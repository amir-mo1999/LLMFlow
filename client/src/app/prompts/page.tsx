"use client"
import {
  PromptOverview,
  PromptForm,
  PromptSingleOverview,
  MainContentContainer,
  SideBarContainer,
  PageContainer,
  SearchField,
} from "@/components"
import Button from "@mui/material/Button"
import { useGetAllPrompts, useGetAiFunctions } from "@/api/apiComponents"
import { useState, useEffect } from "react"
import { Prompt } from "@/api/apiSchemas"

export default function Home() {
  const [searchValue, setSearchValue] = useState("")
  const [selectedPromptIndx, setSelectedPromptIndx] = useState<number | undefined>()
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [showCreateForm, setShowCreateForm] = useState(false)

  const onClickCreate = () => {
    setShowCreateForm(true)
  }

  useEffect(() => {
    if (showCreateForm) setSelectedPromptIndx(undefined)
  }, [showCreateForm])

  const addPrompt = (prompt: Prompt) => {
    setPrompts([...prompts, prompt])
    setShowCreateForm(false)
  }

  const onDeletePrompt = () => {
    const updatedPrompts = prompts.filter((_, i) => i !== selectedPromptIndx)
    setPrompts(updatedPrompts)
    setSelectedPromptIndx(undefined)
  }

  const { data: promptsAPI, isFetching, refetch } = useGetAllPrompts({})

  const { data: aiFunctions } = useGetAiFunctions({})

  useEffect(() => {
    if (promptsAPI && !isFetching) setPrompts(promptsAPI)
  }, [promptsAPI, isFetching])

  if (!aiFunctions) {
    return <></>
  }

  return (
    <PageContainer>
      <SideBarContainer>
        <SearchField value={searchValue} setValue={setSearchValue} placeholder=""></SearchField>
        <Button sx={{ marginTop: 2 }} variant="contained" onClick={onClickCreate}>
          Create Prompt
        </Button>
        <PromptOverview
          prompts={prompts}
          selectedPromptIndx={selectedPromptIndx}
          setSelectedPromptIndx={setSelectedPromptIndx}
        ></PromptOverview>
      </SideBarContainer>
      <MainContentContainer>
        {showCreateForm ? (
          <PromptForm aiFunctions={aiFunctions} addPrompt={addPrompt}></PromptForm>
        ) : selectedPromptIndx !== undefined && prompts ? (
          <PromptSingleOverview
            prompt={prompts[selectedPromptIndx]}
            deletePrompt={onDeletePrompt}
          ></PromptSingleOverview>
        ) : (
          <></>
        )}
      </MainContentContainer>
    </PageContainer>
  )
}
