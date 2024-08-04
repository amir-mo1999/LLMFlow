import * as React from "react"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import Box from "@mui/material/Box"
import Select, { SelectChangeEvent } from "@mui/material/Select"
import { useState, useEffect, Dispatch, SetStateAction } from "react"
import { OutputAssertionT } from "@/types"
import { Typography } from "@mui/material"
import MenuItem from "@mui/material/MenuItem"
import Tooltip from "@mui/material/Tooltip"
import IconButton from "@mui/material/IconButton"
import HelpIcon from "@mui/icons-material/Help"
import { OutputAssertion } from "@/models"

interface OutputAssertionsFormDialogProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  outputAssertions: Array<OutputAssertionT>
  setOutputAssertions: Dispatch<SetStateAction<Array<OutputAssertionT>>>
  indx: number
}

const OutputAssertionsFormDialog: React.FC<OutputAssertionsFormDialogProps> = ({
  open,
  setOpen,
  outputAssertions,
  setOutputAssertions,
  indx,
}) => {
  const addingNewAssertion = indx >= outputAssertions.length

  const [assertionType, setAssertionType] = useState<OutputAssertionT["type"]>(
    addingNewAssertion ? "" : outputAssertions[indx].type
  )
  const [assertionWeight, setAssertionWeight] = useState<OutputAssertionT["weight"]>(
    addingNewAssertion ? 1 : outputAssertions[indx].weight
  )

  function onAssertionTypeChange(e: SelectChangeEvent<OutputAssertionT["type"]>) {
    setAssertionType(e.target.value as OutputAssertionT["type"])
  }

  function onAssertionChangeWeight(e: SelectChangeEvent) {
    setAssertionWeight(parseFloat(e.target.value))
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
    const assertion = OutputAssertion.parse({ type: assertionType, weight: assertionWeight })
    const auxArray = outputAssertions
    if (indx >= outputAssertions.length) {
      auxArray.push(assertion)
    } else {
      auxArray[indx] = assertion
    }
    setOutputAssertions([...auxArray])
    setOpen(false)
  }

  function resetForm() {
    setAssertionType(addingNewAssertion ? "" : outputAssertions[indx].type)
    setAssertionWeight(addingNewAssertion ? 1 : outputAssertions[indx].weight)
  }
  useEffect(resetForm, [open])

  const [disableCreateButton, setDisableCreateButton] = useState<boolean>(true)
  function checkDisableCreateButton() {
    if (assertionType === "") {
      setDisableCreateButton(true)
    } else {
      setDisableCreateButton(false)
    }
  }
  useEffect(checkDisableCreateButton, [])
  useEffect(checkDisableCreateButton, [assertionType])

  const renderMenuItem = (
    value: OutputAssertionT["type"],
    valueAlias: string,
    tooltipText: string
  ) => {
    return (
      <MenuItem value={value}>
        <Box display="flex" justifyContent="space-between" width="100%" alignItems={"center"}>
          <Typography>{valueAlias}</Typography>
          <Tooltip placement="right" title={<Typography>{tooltipText}</Typography>}>
            <IconButton>
              <HelpIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </MenuItem>
    )
  }

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
            <Typography>Select Assertion Type</Typography>
            <Select value={assertionType} onChange={onAssertionTypeChange}>
              {renderMenuItem(
                "contains",
                "contains",
                "Assert that the output contains a given substring"
              )}
            </Select>
            <Typography>Weight</Typography>
            <Select
              labelId="select-label"
              id="select"
              value={assertionWeight.toString()}
              label="Select Value"
              onChange={onAssertionChangeWeight}
            >
              {Array.from({ length: 20 }, (_, i) => 1 - i * 0.05).map((value) => (
                <MenuItem key={value} value={value}>
                  {value.toFixed(2)}
                </MenuItem>
              ))}
            </Select>
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

export { OutputAssertionsFormDialog }
