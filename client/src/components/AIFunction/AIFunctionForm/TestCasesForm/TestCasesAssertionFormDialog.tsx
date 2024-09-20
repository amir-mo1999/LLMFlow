import React, { useState, useEffect } from "react"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle"
import DialogContent from "@mui/material/DialogContent"
import DialogActions from "@mui/material/DialogActions"
import TextField from "@mui/material/TextField"
import { AIFunctionRouteInput, TestCaseInput, InputVariable, Assertion } from "@/api/apiSchemas"
import { Typography } from "@mui/material"

interface TestCasesFormDialogProps {
  open: boolean
  testCaseIndx: number
  handleClose: () => void
  handleAddAssertionToTestCase: (testCaseIndx: number, assertion: Assertion) => void
  handleDeleteAssertionFromTestCase: (testCaseIndx: number, assertionIndx: number) => void
  handleUpdateAssertionFromTestCase: (
    testCaseIndx: number,
    assertionIndx: number,
    assertion: Assertion
  ) => void
}

const TestCasesFormDialog: React.FC<TestCasesFormDialogProps> = ({
  open,
  handleClose,
  testCaseIndx,
  handleAddAssertionToTestCase,
  handleDeleteAssertionFromTestCase,
  handleUpdateAssertionFromTestCase,
}) => {
  const [assertions, setAssertions] = useState<Assertion[]>([])

  const handleChange = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setVars({
      ...vars,
      [name]: event.target.value,
    })
  }

  const onAdd = () => {
    handleAddTestCase({ vars: vars, assert: [] })
    handleClose()
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add Test Case</DialogTitle>
      <DialogContent>
        <Box mt={2}>
          {inputVariables.map((variable, index) => (
            <Box key={index} mb={2}>
              <Typography>{variable.name}</Typography>
              <TextField
                value={vars[variable.name] || ""}
                onChange={handleChange(variable.name)}
                fullWidth
              />
            </Box>
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
        <Button onClick={onAdd} variant="contained">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default TestCasesFormDialog
