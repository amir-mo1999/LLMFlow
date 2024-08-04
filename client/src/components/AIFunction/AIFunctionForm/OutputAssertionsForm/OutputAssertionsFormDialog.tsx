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

interface OutputAssertionsFormDialogProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  outputAssertions: Array<OutputAssertionT>
  setOutputAssertions: Dispatch<SetStateAction<Array<OutputAssertionT>>>
  indx: number
}

const renderMenuItem = (
  value: OutputAssertionT["type"],
  valueAlias: string,
  tooltipHTML: React.ReactNode
) => {
  return (
    <MenuItem value={value}>
      <Box display="flex" justifyContent="space-between" width="100%" alignItems={"center"}>
        <Typography>{valueAlias}</Typography>
        <Tooltip placement="right" title={tooltipHTML}>
          <IconButton>
            <HelpIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </MenuItem>
  )
}

const OutputAssertionsFormDialog: React.FC<OutputAssertionsFormDialogProps> = ({
  open,
  setOpen,
  outputAssertions,
  setOutputAssertions,
  indx,
}) => {
  const addingNewAssertion = indx >= outputAssertions.length

  const [assertionType, setAssertionType] = useState<OutputAssertionT["type"]>("")

  function onAssertionTypeChange(e: SelectChangeEvent<OutputAssertionT["type"]>) {
    setAssertionType(e.target.value as OutputAssertionT["type"])
  }

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
    const auxArray = outputAssertions
    if (indx >= outputAssertions.length) {
    } else {
    }
    setOutputAssertions([...auxArray])
    setOpen(false)
  }

  // variable for checking if the create button should be disabled
  const [disableCreateButton, setDisableCreateButton] = useState<boolean>(false)

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
                <Typography>Assert that the output contains a substring</Typography>
              )}
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
