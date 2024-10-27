"use client"
import {
  PromptOverview,
  MainContentContainer,
  SideBarContainer,
  PageContainer,
  SearchField,
} from "@/components"
import Button from "@mui/material/Button"
import { useGetAllPrompts, useEvaluate, useGetAiFunctions } from "@/api/apiComponents"
import { useState, useEffect, createContext } from "react"
import { Prompt, AIFunction } from "@/api/apiSchemas"
import { useRouter } from "next/navigation"

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

interface PromptsContextProps {
  prompts: Prompt[]
  aiFunctions: AIFunction[]
  refetchAIFunctions: () => void
  promptNumbers: number[]
  addPrompt: (prompt: Prompt) => void
  onDeletePrompt: () => void
  setSelectedPromptIndx: (indx: number | undefined) => void
}

export const PromptsContext = createContext<PromptsContextProps>({
  prompts: [],
  promptNumbers: [],
  aiFunctions: [],
  refetchAIFunctions: () => {},
  addPrompt: () => {},
  onDeletePrompt: () => {},
  setSelectedPromptIndx: () => {},
})

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [searchValue, setSearchValue] = useState("")
  const [selectedPromptIndx, setSelectedPromptIndx] = useState<number | undefined>()
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [promptNumbers, setPromptNumbers] = useState<number[]>([])

  const router = useRouter()
  const onClickCreate = () => {
    router.push("/prompts/create")
  }

  const onClickPrompt = (indx: number) => {
    const f = () => {
      router.push(`/prompts/${prompts[indx]._id}`)
      setSelectedPromptIndx(indx)
    }
    return f
  }

  const addPrompt = (prompt: Prompt) => {
    setPrompts([...prompts, prompt])
    router.push("/prompts")
  }

  const onDeletePrompt = () => {
    const updatedPrompts = prompts.filter((_, i) => i !== selectedPromptIndx)
    setPrompts(updatedPrompts)
    setSelectedPromptIndx(undefined)
    router.push("/prompts")
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
  const { data: aiFunctions, refetch: refetchAIFunctions } = useGetAiFunctions({})

  const { data: promptsAPI, isFetching } = useGetAllPrompts({})

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
          selectedPromptIndx={selectedPromptIndx}
          prompts={prompts}
          promptNumbers={promptNumbers}
          onClick={onClickPrompt}
        ></PromptOverview>
      </SideBarContainer>
      <MainContentContainer>
        <PromptsContext.Provider
          value={{
            prompts: prompts,
            aiFunctions: aiFunctions,
            refetchAIFunctions: refetchAIFunctions,
            promptNumbers: promptNumbers,
            setSelectedPromptIndx: setSelectedPromptIndx,
            addPrompt: addPrompt,
            onDeletePrompt: onDeletePrompt,
          }}
        >
          {children}
        </PromptsContext.Provider>
      </MainContentContainer>
    </PageContainer>
  )
}
