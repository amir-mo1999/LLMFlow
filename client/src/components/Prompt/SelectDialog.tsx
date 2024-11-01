import React from "react"

import Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle"
import DialogContent from "@mui/material/DialogContent"
import { AIFunctionOverview } from "../AIFunction"
import PromptOverview from "./PromptOverview"
import { AIFunction, Prompt } from "@/api/apiSchemas"

interface SelectAIFunctionDialogProps {
  open: boolean
  setOpen: (open: boolean) => void
  aiFunctions?: AIFunction[]
  prompts?: Prompt[]
  onClick?: (indx: number) => void
}

const SelectAIFunctionDialog: React.FC<SelectAIFunctionDialogProps> = ({
  open,
  setOpen,
  aiFunctions,
  prompts,
  onClick,
}) => {
  const onClickPaper = (indx: number) => {
    const f = () => {
      onClick?.(indx)
      setOpen(false)
    }
    return f
  }

  if (aiFunctions) {
    return (
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Select AI Function</DialogTitle>
        <DialogContent>
          <AIFunctionOverview aiFunctions={aiFunctions} onClick={onClickPaper}></AIFunctionOverview>
        </DialogContent>
      </Dialog>
    )
  } else if (prompts) {
    return (
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Select Prompt</DialogTitle>
        <DialogContent>
          <PromptOverview prompts={prompts} onClick={onClickPaper}></PromptOverview>
        </DialogContent>
      </Dialog>
    )
  }
}

export default SelectAIFunctionDialog
