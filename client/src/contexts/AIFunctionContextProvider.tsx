"use client"

import { useState, createContext, useContext } from "react"
import { AIFunction } from "@/api/apiSchemas"
import { useRouter } from "next/navigation"
import { AppContext } from "@/contexts"

interface AIFunctionsContextProps {
  aiFunctions: AIFunction[]
  addAIFunction: (_: AIFunction) => void
  onDeleteAIFunction: () => void
  setSelectedAIFunctionIndx: (_: number | undefined) => void
  setAIFunction: (_: AIFunction) => void
  onClickEdit: (_: string) => void
  onClickAddPrompt: (_: string) => void
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

export default function AIFunctionContextProvider({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { aiFunctions, setAIFunctions } = useContext(AppContext)

  const [selectedAIFunctionIndx, setSelectedAIFunctionIndx] = useState<number | undefined>()

  const router = useRouter()

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
  )
}
