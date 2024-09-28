import React, { useState, useEffect, ReactNode } from "react"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle"
import DialogContent from "@mui/material/DialogContent"
import DialogActions from "@mui/material/DialogActions"
import Select from "@mui/material/Select"
import Typography from "@mui/material/Typography"
import MenuItem from "@mui/material/MenuItem"
import { SelectChangeEvent } from "@mui/material/Select"
import { Assertion, BaseAssertionTypes, baseAssertionTypesArray } from "@/api/apiSchemas"
import AssertionTypeForm from "./AssertionTypeForm/AssertionTypeForm"

interface AssertionFormDialogProps {
  open: boolean
  handleClose: () => void
  handleAdd: (assertion: Assertion) => void
  handleUpdate?: (index: number, assertion: Assertion) => void
  assertion?: Assertion
  isEditing?: boolean
  index?: number
}

const AssertionFormDialog: React.FC<AssertionFormDialogProps> = ({
  open,
  handleClose,
  handleAdd,
  handleUpdate,
  assertion,
  isEditing = false,
  index,
}) => {
  const [type, setType] = useState<BaseAssertionTypes>("contains")
  const [weight, setWeight] = useState<number>(1)
  const [value, setValue] = useState<Assertion["value"]>(null)
  const [threshold, setThreshold] = useState<Assertion["threshold"]>(null)

  const resetForm = () => {
    setType("contains")
    setWeight(1)
    setValue(null)
    setThreshold(null)
  }

  useEffect(() => {
    if (open) {
      if (assertion) {
        setType(assertion.type)
        if (assertion.weight) setWeight(assertion.weight)
        if (assertion.value) setValue(assertion.value)
        if (assertion.threshold) setThreshold(assertion.threshold)
      } else {
        resetForm()
      }
    }
  }, [assertion, open])

  const handleTypeChange = (event: SelectChangeEvent<string>, child: ReactNode) => {
    setType(event.target.value as BaseAssertionTypes)
  }

  const handleWeightChange = (event: SelectChangeEvent<string>, child: ReactNode) => {
    const n = Number(event.target.value)
    setWeight(n)
  }

  const onAdd = () => {
    const newAssertion: Assertion = { type: type, weight: weight }
    if (value) newAssertion["value"] = value
    if (threshold) newAssertion["threshold"] = threshold
    handleAdd(newAssertion)
    handleClose()
  }

  const onUpdate = () => {
    if (handleUpdate && index !== undefined) {
      const newAssertion: Assertion = { type: type, weight: weight }
      if (value) newAssertion["value"] = value
      if (threshold) newAssertion["threshold"] = threshold
      handleUpdate(index, newAssertion)
      handleClose()
    }
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{isEditing ? "Edit Assertion" : "Add Assertion"}</DialogTitle>
      <DialogContent>
        <Box mt={2}>
          <Typography>Type</Typography>
          <Select value={type} onChange={handleTypeChange}>
            {baseAssertionTypesArray.map((type, indx) => (
              <MenuItem key={indx} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
          <Typography>Weight</Typography>
          <Select value={weight.toString()} onChange={handleWeightChange}>
            {Array.from({ length: 10 }, (_, i) => i + 1).map((i) => (
              <MenuItem key={i} value={i}>
                {i}
              </MenuItem>
            ))}
          </Select>
          <AssertionTypeForm
            open={open}
            type={type}
            value={value}
            setValue={setValue}
            threshold={threshold}
            setThreshold={setThreshold}
          ></AssertionTypeForm>
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