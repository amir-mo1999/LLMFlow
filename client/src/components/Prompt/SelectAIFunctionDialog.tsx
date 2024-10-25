import React from "react"

import Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle"
import DialogContent from "@mui/material/DialogContent"
import { AIFunctionOverview } from "../AIFunction"
import { AIFunction } from "@/api/apiSchemas"

interface SelectAIFunctionDialogProps {
  open: boolean
  setOpen: (open: boolean) => void
  setSelectedAIFunctionIndx: (indx: number) => void
  aiFunctions: AIFunction[]
}

const SelectAIFunctionDialog: React.FC<SelectAIFunctionDialogProps> = ({
  open,
  setOpen,
  setSelectedAIFunctionIndx,
  aiFunctions,
}) => {
  const onClickAIFunction = (indx: number) => {
    const f = () => {
      setSelectedAIFunctionIndx(indx)
      setOpen(false)
    }
    return f
  }

  return (
    <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
      <DialogTitle>Select AI Function</DialogTitle>
      <DialogContent>
        <AIFunctionOverview
          aiFunctions={aiFunctions}
          onClick={onClickAIFunction}
        ></AIFunctionOverview>
      </DialogContent>
    </Dialog>
  )
}

export default SelectAIFunctionDialog
