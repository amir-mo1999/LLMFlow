"use client"
import { AIFunctionOverview } from "@/components"
import Button from "@mui/material/Button"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  return (
    <>
      <AIFunctionOverview></AIFunctionOverview>
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
