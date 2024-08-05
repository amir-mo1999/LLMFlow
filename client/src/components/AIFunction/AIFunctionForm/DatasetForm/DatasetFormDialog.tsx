import { AIFunctionT } from "@/types"
import * as React from "react"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import Box from "@mui/material/Box"
import TextField from "@mui/material/TextField"
import Select, { SelectChangeEvent } from "@mui/material/Select"
import { useState, useEffect, Dispatch, SetStateAction } from "react"
import { OutputAssertionT } from "@/types"
import { Typography } from "@mui/material"
import MenuItem from "@mui/material/MenuItem"
import Tooltip from "@mui/material/Tooltip"
import IconButton from "@mui/material/IconButton"
import HelpIcon from "@mui/icons-material/Help"
import { OutputAssertion } from "@/models"
import { InputVariableT } from "@/types"

interface DatasetFormDialogProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  dataset: AIFunctionT["dataset"]
  inputVariables: Array<InputVariableT>
  setDataset: Dispatch<SetStateAction<AIFunctionT["dataset"]>>
  indx: number
}

const DatasetFormDialog: React.FC<DatasetFormDialogProps> = ({
  open,
  setOpen,
  dataset,
  inputVariables,
  setDataset,
  indx,
}) => {
  const addingNewRecord = indx >= dataset.length

  const [record, setRecord] = useState<Record<string, string>>(addingNewRecord ? {} : dataset[indx])

  function onRecordChange(variableName: string) {
    const f = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const aux = record
      aux[variableName] = e.target.value
      setRecord({ ...aux })
    }

    return f
  }

  function onClose(reason: string) {
    const f = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      if (reason !== "backdropClick") {
        setOpen(false)
      }
    }
    return f
  }

  function onCreate() {
    const aux = dataset

    if (addingNewRecord) {
      aux.push(record)
    } else {
      aux[indx] = record
    }
    setDataset([...aux])
    setOpen(false)
  }

  function resetForm() {
    if (addingNewRecord) {
      setRecord({})
    } else {
      setRecord(dataset[indx])
    }
  }
  useEffect(resetForm, [])
  useEffect(resetForm, [open])

  const [disableCreateButton, setDisableCreateButton] = useState<boolean>(true)
  function updateDisableCreateButton() {
    for (let i = 0; i < inputVariables.length; i++) {
      const variableName = inputVariables[i].name
      if (!(variableName in record)) {
        setDisableCreateButton(true)
        break
      }

      if (record[variableName] === "") {
        setDisableCreateButton(true)
        break
      }

      setDisableCreateButton(false)
    }
  }
  useEffect(updateDisableCreateButton, [record])

  return (
    <React.Fragment>
      <Dialog open={open} fullWidth maxWidth="xl">
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              margin: "10px",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            {inputVariables.map((variable, indx) => {
              return (
                <React.Fragment key={indx}>
                  <Typography>{variable.name}</Typography>
                  <TextField
                    multiline
                    minRows={10}
                    maxRows={10}
                    value={record[variable.name]}
                    onChange={onRecordChange(variable.name)}
                  ></TextField>
                </React.Fragment>
              )
            })}
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

export default DatasetFormDialog
