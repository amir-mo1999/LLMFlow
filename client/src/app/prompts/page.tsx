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
import { useGetAllPrompts, useEvaluate } from "@/api/apiComponents"
import { useState, useEffect } from "react"
import { Prompt } from "@/api/apiSchemas"

const getPromptNumbers = (prompts: Prompt[]) => {
  const nameCountMap = new Map()
  const numbers: number[] = []

  prompts.forEach((prompt) => {
    const name = prompt.ai_function_name
    // Get the current count for the name, default to 0
    const currentCount = nameCountMap.get(name) || 0
    // Increment the count
    const newCount = currentCount + 1
    // Update the map
    nameCountMap.set(name, newCount)
    // Push the new count to the numbers array
    numbers.push(newCount)
  })

  return numbers
}
export default function Home() {
  const [searchValue, setSearchValue] = useState("")
  const [selectedPromptIndx, setSelectedPromptIndx] = useState<number | undefined>()
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [promptNumbers, setPromptNumbers] = useState<number[]>([])

  const onClickCreate = () => {
    setShowCreateForm(true)
  }

  const onClickPrompt = (indx: number) => {
    const f = () => {
      setShowCreateForm(false)
      setSelectedPromptIndx(indx)
    }
    return f
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

  useEffect(() => {
    for (let i = 0; i < prompts.length; i++) {
      if (!prompts[i].last_eval) {
        evaluate({ pathParams: { promptId: prompts[i]._id as string } })
      }
    }

    setPromptNumbers(getPromptNumbers(prompts))
  }, [prompts])

  const { mutate: evaluate } = useEvaluate({
    onSuccess: (response, vars) => {
      const newPrompts = prompts
      const promptId = vars.pathParams.promptId
      const promptIndx = newPrompts.findIndex((prompt) => prompt._id === promptId)
      if (promptIndx !== undefined) {
        newPrompts[promptIndx].last_eval = response
        setPrompts([...newPrompts])
      }
    },
  })

  const { data: promptsAPI, isFetching } = useGetAllPrompts({})

  useEffect(() => {
    if (promptsAPI && !isFetching) setPrompts(promptsAPI)
  }, [promptsAPI, isFetching])

  return (
    <PageContainer>
      <SideBarContainer>
        <SearchField value={searchValue} setValue={setSearchValue} placeholder=""></SearchField>
        <Button sx={{ marginTop: 2 }} variant="contained" onClick={onClickCreate}>
          Create Prompt
        </Button>
        <PromptOverview
          selectedPromptIndx={selectedPromptIndx}
          prompts={prompts}
          promptNumbers={promptNumbers}
          onClick={onClickPrompt}
        ></PromptOverview>
      </SideBarContainer>
      <MainContentContainer>
        {showCreateForm ? (
          <PromptForm addPrompt={addPrompt}></PromptForm>
        ) : selectedPromptIndx !== undefined && prompts ? (
          <PromptSingleOverview
            prompt={prompts[selectedPromptIndx]}
            promptNumber={promptNumbers[selectedPromptIndx]}
            onDelete={onDeletePrompt}
          ></PromptSingleOverview>
        ) : (
          <></>
        )}
      </MainContentContainer>
    </PageContainer>
  )
}
