import React from "react"

import Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle"
import Box from "@mui/material/Box"
import DialogContent from "@mui/material/DialogContent"
import { ItemOverview } from "@/components"
import { AIFunction, Prompt } from "@/api/apiSchemas"

interface SelectAIFunctionDialogProps {
  open: boolean
  setOpen: (_: boolean) => void
  aiFunctions?: AIFunction[]
  prompts?: Prompt[]
  onClick?: (_: number) => void
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
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <ItemOverview
              itemType="AI Function"
              items={aiFunctions}
              onClick={onClickPaper}
            ></ItemOverview>
          </Box>
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

export default SelectAIFunctionDialog
