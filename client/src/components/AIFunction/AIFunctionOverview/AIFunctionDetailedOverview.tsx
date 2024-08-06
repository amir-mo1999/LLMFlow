"use client"

import { AIFunctionT } from "@/types"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import { useRouter } from "next/navigation"
import { formatDateTime } from "@/utils"

interface AIFunctionDetailedOverviewProps {
  aiFunction: AIFunctionT
}

const AIFunctionDetailedOverview: React.FC<AIFunctionDetailedOverviewProps> = ({ aiFunction }) => {
  const router = useRouter()

  function onClickAddPrompt() {
    router.push(`/ai-function/${aiFunction._id}/create-prompt`)
  }

  return (
    <>
      <Typography variant="h5">{aiFunction.name}</Typography>
      <Typography variant="body1">{aiFunction.description}</Typography>
      <Typography variant="body1">{formatDateTime(aiFunction.creation_time)}</Typography>
      <Typography variant="body1">{aiFunction.username}</Typography>
      <Button variant="contained" onClick={onClickAddPrompt}>
        Add Prompt
      </Button>
    </>
  )
}

export default AIFunctionDetailedOverview
