"use client"
import { AIFunctionT } from "@/types"
import Paper from "@mui/material/Paper"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import { useState } from "react"
import { SxProps } from "@mui/material"
import { useRouter } from "next/navigation"

interface AIFunctionPaperProps {
  aiFunction: AIFunctionT
  sx?: SxProps
}

const AIFunctionPaper: React.FC<AIFunctionPaperProps> = ({ aiFunction, sx }) => {
  const router = useRouter()

  const [isHover, setIsHover] = useState<boolean>(false)

  function onMouseEnter() {
    setIsHover(true)
  }

  function onMouseLeave() {
    setIsHover(false)
  }

  function redirectToAIFunction() {
    router.push(`/ai-function/${aiFunction._id}`)
  }

  return (
    <>
      <Paper
        elevation={isHover ? 15 : 2}
        sx={{
          elevation: 15,
          padding: 0.5,
          ...sx,
        }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={redirectToAIFunction}
      >
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography variant="h6">{aiFunction.name}</Typography>
          <Typography variant="body1">{aiFunction.description}</Typography>
        </Box>
      </Paper>
    </>
  )
}

export { AIFunctionPaper }
