"use client"
import { AIFunctionOverview } from "@/components"
import Button from "@mui/material/Button"
import { useRouter } from "next/navigation"
import { useGetAiFunctions } from "@/api/apiComponents"

export default function Home() {
  const router = useRouter()

  const { data: aiFunctions } = useGetAiFunctions({})

  if (!aiFunctions) {
    return <></>
  }

  return (
    <>
      <AIFunctionOverview aiFunctions={aiFunctions}></AIFunctionOverview>
      <Button
        variant="contained"
        onClick={() => {
          router.push("/create/ai-function")
        }}
      >
        Create AI Function
      </Button>
    </>
  )
}
