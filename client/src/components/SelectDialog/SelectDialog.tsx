import React from "react"

import Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle"
import DialogContent from "@mui/material/DialogContent"
import { ItemOverview } from "@/components"
import { AIFunction, Prompt } from "@/api/apiSchemas"

interface SelectAIFunctionDialogProps {
  open: boolean
  setOpen: (open: boolean) => void
  aiFunctions?: AIFunction[]
  prompts?: Prompt[]
  onClick?: (indx: number) => void
}

const SelectDialog: React.FC<SelectAIFunctionDialogProps> = ({
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
          <ItemOverview
            itemType="AIFunction"
            items={aiFunctions}
            onClick={onClickPaper}
          ></ItemOverview>
        </DialogContent>
      </Dialog>
    )
  } else if (prompts) {
    return (
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Select Prompt</DialogTitle>
        <DialogContent>
          <ItemOverview itemType="Prompt" items={prompts} onClick={onClickPaper}></ItemOverview>
        </DialogContent>
      </Dialog>
    )
  }
}

export default SelectDialog
