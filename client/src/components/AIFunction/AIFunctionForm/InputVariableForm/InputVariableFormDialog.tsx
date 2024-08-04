import * as React from "react"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import Box from "@mui/material/Box"
import DialogTitle from "@mui/material/DialogTitle"
import TextField from "@mui/material/TextField"
import { useState, useEffect, Dispatch, SetStateAction } from "react"
import { InputVariableT } from "@/types"
import { Typography } from "@mui/material"

interface InputVariableFormDialogProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  inputVariables: Array<InputVariableT>
  setInputVariables: Dispatch<SetStateAction<Array<InputVariableT>>>
  indx: number
}

const InputVariableFormDialog: React.FC<InputVariableFormDialogProps> = ({
  open,
  setOpen,
  inputVariables,
  setInputVariables,
  indx,
}) => {
  // check if we are adding a new variable or editing an existing one
  const addingNewVariable = indx >= inputVariables.length

  // name of input variable
  const [name, setName] = useState<string>(addingNewVariable ? "" : inputVariables[indx].name)

  // when input variable name changes
  function onNameChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setName(e.target.value)
  }

  // reset the form when the dialog is opened and we are adding a new variable
  function resetForm() {
    setName(addingNewVariable ? "" : inputVariables[indx].name)
  }
  useEffect(resetForm, [open])

  // event handler for when dialog is closed
  function onClose(reason: string) {
    const f = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      if (reason !== "backdropClick") {
        setOpen(false)
      }
    }
    return f
  }

  // event handler create button is clicked in dialog
  function onCreate() {
    const auxArray = inputVariables
    if (indx >= inputVariables.length) {
      auxArray.push({ name: name })
    } else {
      auxArray[indx] = { name: name }
    }
    setInputVariables([...auxArray])
    setOpen(false)
  }

  // variable for checking if the create button should be disabled
  const [disableCreateButton, setDisableCreateButton] = useState<boolean>(true)

  // checks if the create button the dialog should be disabled or not
  function checkDisableCreateButton() {
    if (name === "") {
      setDisableCreateButton(true)
    } else {
      setDisableCreateButton(false)
    }
  }

  // disable or enable the create button based on the name and the nameError
  useEffect(checkDisableCreateButton, [])
  useEffect(checkDisableCreateButton, [name])

  return (
    <React.Fragment>
      <Dialog open={open}>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              margin: "10px",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            {/* Field for the input variable name */}
            <Typography>Variable Name</Typography>
            <TextField value={name} onChange={onNameChange}></TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose("buttonClick")}>Cancel</Button>
          <Button disabled={disableCreateButton} onClick={onCreate}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  )
}

export { InputVariableFormDialog }
