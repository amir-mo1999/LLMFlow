"use client"
import { ItemOverview, MainContentContainer, SideBarContainer, PageContainer } from "@/components"
import Button from "@mui/material/Button"
import { useEvaluate } from "@/api/apiComponents"
import { useState, useEffect, useContext } from "react"
import { useRouter } from "next/navigation"
import { AppContext, PromptContextProvider } from "@/contexts"

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { aiFunctions, prompts, setPrompts, refetchPrompts } = useContext(AppContext)

  const [selectedPromptIndx, setSelectedPromptIndx] = useState<number | undefined>()

  const router = useRouter()

  const onClickCreate = () => {
    setSelectedPromptIndx(undefined)
    router.push("/prompts/create")
  }

  const onClickPrompt = (indx: number) => {
    const f = () => {
      router.push(`/prompts/${prompts[indx]._id}`)
      setSelectedPromptIndx(indx)
    }
    return f
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
    <PageContainer>
      <SideBarContainer>
        <Button
          sx={{ marginBottom: 2 }}
          variant="contained"
          disabled={aiFunctions.length === 0 ? true : false}
          onClick={onClickCreate}
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
        <PromptContextProvider>{children}</PromptContextProvider>
      </MainContentContainer>
    </PageContainer>
  )
}
