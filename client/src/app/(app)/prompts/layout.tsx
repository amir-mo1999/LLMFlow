"use client"
import { ItemOverview, MainContentContainer, SideBarContainer, PageContainer } from "@/components"
import Button from "@mui/material/Button"
import { useEvaluate } from "@/api/apiComponents"
import { useState, useEffect, createContext, useContext } from "react"
import { Prompt, AIFunction, PromptMessage } from "@/api/apiSchemas"
import { useRouter } from "next/navigation"
import { AppContext } from "../layout"

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
  const { aiFunctions, prompts, setPrompts, refetchAIFunctions, refetchPrompts } =
    useContext(AppContext)

  const [selectedPromptIndx, setSelectedPromptIndx] = useState<number | undefined>()

  const router = useRouter()

  const onClickCreate = () => {
    setSelectedPromptIndx(undefined)
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
    newPrompts[promptToUpdateIndx].evals = undefined
    newPrompts[promptToUpdateIndx].revision_required = false
    setPrompts([...newPrompts])
    router.push("/prompts")
  }

  useEffect(() => {
    for (let i = 0; i < prompts.length; i++) {
      if (!prompts[i].evals && !prompts[i].revision_required) {
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
        newPrompts[promptIndx].evals = response
        setPrompts([...newPrompts])
        refetchPrompts()
      }
    },
  })

  if (!aiFunctions) {
    return <></>
  }

  return (
    <PageContainer>
      <SideBarContainer>
        <Button
          sx={{ marginBottom: 2 }}
          variant="contained"
          disabled={aiFunctions.length === 0 ? true : false}
          onClick={onClickCreate}
          href="/prompts/create"
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
