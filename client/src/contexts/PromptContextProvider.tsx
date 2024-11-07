"use client"

import { useEvaluate } from "@/api/apiComponents"
import { useState, useEffect, createContext, useContext } from "react"
import { Prompt, AIFunction, PromptMessage } from "@/api/apiSchemas"
import { useRouter } from "next/navigation"
import { AppContext } from "@/contexts"

interface PromptsContextProps {
  prompts: Prompt[]
  aiFunctions: AIFunction[]
  refetchAIFunctions: () => void
  addPrompt: (_: Prompt) => void
  onDeletePrompt: () => void
  setSelectedPromptIndx: (_: number | undefined) => void
  onClickEdit: (_: string) => void
  setPromptMessages: (_: string, __: PromptMessage[]) => void
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

export default function PromptContextProvider({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { aiFunctions, prompts, setPrompts, refetchAIFunctions, refetchPrompts } =
    useContext(AppContext)

  const [selectedPromptIndx, setSelectedPromptIndx] = useState<number | undefined>()

  const router = useRouter()

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

  useEffect(() => {
    for (let i = 0; i < prompts.length; i++) {
      if (!prompts[i].evals && !prompts[i].revision_required) {
        evaluate({ pathParams: { promptId: prompts[i]._id as string } })
      }
    }
  }, [prompts, evaluate])

  if (!aiFunctions) {
    return <></>
  }

  return (
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
  )
}
