"use client"
import {
  ItemOverview,
  MainContentContainer,
  SideBarContainer,
  PageContainer,
  SearchField,
} from "@/components"
import Button from "@mui/material/Button"
import { useGetAllPrompts, useEvaluate, useGetAiFunctions } from "@/api/apiComponents"
import { useState, useEffect, createContext } from "react"
import { Prompt, AIFunction, PromptMessage } from "@/api/apiSchemas"
import { useRouter } from "next/navigation"

interface PromptsContextProps {
  prompts: Prompt[]
  aiFunctions: AIFunction[]
  refetchAIFunctions: () => void
  addPrompt: (prompt: Prompt) => void
  onDeletePrompt: () => void
  setSelectedPromptIndx: (indx: number | undefined) => void
  onClickEdit: (promptID: string) => void
  setPromptMessages: (promptID: string, messages: PromptMessage[]) => void
}

export const PromptsContext = createContext<PromptsContextProps>({
  prompts: [],
  aiFunctions: [],
  refetchAIFunctions: () => {},
  addPrompt: () => {},
  onDeletePrompt: () => {},
  setSelectedPromptIndx: () => {},
  onClickEdit: () => {},
  setPromptMessages: () => {},
})

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [searchValue, setSearchValue] = useState("")
  const [selectedPromptIndx, setSelectedPromptIndx] = useState<number | undefined>()
  const [prompts, setPrompts] = useState<Prompt[]>([])

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

  const onClickEdit = (promptID: string) => {
    router.push(`/prompts/edit/${promptID}`)
  }

  const setPromptMessages = (promptID: string, messages: PromptMessage[]) => {
    const newPrompts = [...prompts]
    const promptToUpdateIndx = prompts.findIndex((prompt) => prompt._id === promptID)
    newPrompts[promptToUpdateIndx].messages = messages
    newPrompts[promptToUpdateIndx].last_eval = undefined
    newPrompts[promptToUpdateIndx].revision_required = false
    setPrompts([...newPrompts])
    router.push("/prompts")
  }

  useEffect(() => {
    for (let i = 0; i < prompts.length; i++) {
      if (!prompts[i].last_eval && !prompts[i].revision_required) {
        evaluate({ pathParams: { promptId: prompts[i]._id as string } })
      }
    }
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
        <Button
          sx={{ marginTop: 2 }}
          variant="contained"
          onClick={onClickCreate}
          disabled={aiFunctions.length === 0 ? true : false}
        >
          Create Prompt
        </Button>
        <ItemOverview
          itemType="Prompt"
          selectedIndx={selectedPromptIndx}
          items={prompts}
          onClick={onClickPrompt}
        ></ItemOverview>
      </SideBarContainer>
      <MainContentContainer>
        <PromptsContext.Provider
          value={{
            prompts: prompts,
            aiFunctions: aiFunctions,
            refetchAIFunctions: refetchAIFunctions,
            setSelectedPromptIndx: setSelectedPromptIndx,
            addPrompt: addPrompt,
            onDeletePrompt: onDeletePrompt,
            onClickEdit: onClickEdit,
            setPromptMessages: setPromptMessages,
          }}
        >
          {children}
        </PromptsContext.Provider>
      </MainContentContainer>
    </PageContainer>
  )
}
