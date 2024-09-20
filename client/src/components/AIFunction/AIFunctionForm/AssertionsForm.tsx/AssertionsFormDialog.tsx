// AssertionFormDialog.tsx
import React, { useState, useEffect, ReactNode } from "react"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle"
import DialogContent from "@mui/material/DialogContent"
import DialogActions from "@mui/material/DialogActions"
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import Select from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"
import { SelectChangeEvent } from "@mui/material/Select"
import { Assertion, BaseAssertionTypes, baseAssertionTypesArray } from "@/api/apiSchemas"

interface AssertionFormDialogProps {
  open: boolean
  handleClose: () => void
  handleAdd: (assertion: Assertion) => void
  handleUpdate?: (index: number, assertion: Assertion) => void
  initialAssertion?: Assertion
  isEditing?: boolean
  index?: number
}

const AssertionFormDialog: React.FC<AssertionFormDialogProps> = ({
  open,
  handleClose,
  handleAdd,
  handleUpdate,
  initialAssertion,
  isEditing = false,
  index,
}) => {
  const [type, setType] = useState<BaseAssertionTypes>("contains")

  useEffect(() => {
    if (initialAssertion) {
      setType(initialAssertion.type)
    } else {
      setType("contains")
    }
  }, [initialAssertion, open])

  const handleTypeChange = (event: SelectChangeEvent<string>, child: ReactNode) => {
    setType(event.target.value as BaseAssertionTypes)
  }

  const onAdd = () => {
    handleAdd({ type })
    handleClose()
  }

  const onUpdate = () => {
    if (handleUpdate && index !== undefined) {
      handleUpdate(index, { type })
      handleClose()
    }
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{isEditing ? "Edit Assertion" : "Add Assertion"}</DialogTitle>
      <DialogContent>
        <Box mt={2}>
          <FormControl fullWidth>
            <InputLabel id="assertion-type-label">Assertion Type</InputLabel>
            <Select
              labelId="assertion-type-label"
              value={type}
              onChange={handleTypeChange}
              label="Assertion Type"
            >
              {baseAssertionTypesArray.map((type, indx) => (
                <MenuItem key={indx} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
        {isEditing ? (
          <Button onClick={onUpdate} variant="contained">
            Save
          </Button>
        ) : (
          <Button onClick={onAdd} variant="contained">
            Add
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}

export default AssertionFormDialog
