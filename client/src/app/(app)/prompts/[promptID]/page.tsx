"use client"
import { PromptSingleOverview } from "@/components"
import { useContext } from "react"
import { PromptsContext } from "../layout"

export default function Page({ params }: { params: { promptID: string } }) {
  const { prompts, onDeletePrompt, onClickEdit } = useContext(PromptsContext)

  const promptIndx = prompts.findIndex((prompt) => prompt._id === params.promptID)
  const prompt = prompts[promptIndx]
  if (prompt === undefined) return <></>

  return (
    <PromptSingleOverview
      onDelete={onDeletePrompt}
      prompt={prompt}
      onClickEdit={onClickEdit}
    ></PromptSingleOverview>
  )
}