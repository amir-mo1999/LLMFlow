// TestCasesFormDialog.tsx
import React, { useState, useEffect } from "react"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle"
import DialogContent from "@mui/material/DialogContent"
import DialogActions from "@mui/material/DialogActions"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import { TestCaseInput, InputVariable } from "@/api/apiSchemas"

interface TestCasesFormDialogProps {
  open: boolean
  inputVariables: InputVariable[]
  handleClose: () => void
  handleAddTestCase: (testCase: TestCaseInput) => void
  handleUpdateTestCase?: (index: number, testCase: TestCaseInput) => void
  initialTestCase?: TestCaseInput
  isEditing?: boolean
  index?: number
}

const TestCasesFormDialog: React.FC<TestCasesFormDialogProps> = ({
  open,
  handleClose,
  handleAddTestCase,
  handleUpdateTestCase,
  inputVariables,
  initialTestCase,
  isEditing = false,
  index,
}) => {
  const [vars, setVars] = useState<Record<string, string>>({})

  useEffect(() => {
    if (open) {
      if (isEditing && initialTestCase) {
        setVars(initialTestCase.vars)
      } else {
        // Initialize with empty strings
        const initialVars: Record<string, string> = {}
        inputVariables.forEach((variable) => {
          initialVars[variable.name] = ""
        })
        setVars(initialVars)
      }
    }
  }, [open, isEditing, initialTestCase, inputVariables])

  const handleChange = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setVars({
      ...vars,
      [name]: event.target.value,
    })
  }

  const onSave = () => {
    const testCase: TestCaseInput = {
      vars: vars,
      assert: isEditing && initialTestCase ? initialTestCase.assert : [],
    }

    if (isEditing && handleUpdateTestCase !== undefined && index !== undefined) {
      handleUpdateTestCase(index, testCase)
    } else {
      handleAddTestCase(testCase)
    }

    handleClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>{isEditing ? "Edit Test Case" : "Add Test Case"}</DialogTitle>
      <DialogContent>
        <Box>
          {inputVariables.map((variable, idx) => (
            <Box key={idx} mb={2}>
              <Typography>{variable.name}</Typography>
              <TextField
                value={vars[variable.name] || ""}
                onChange={handleChange(variable.name)}
                fullWidth
                multiline
                minRows={5}
                maxRows={7}
              />
            </Box>
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
        <Button onClick={onSave} variant="contained">
          {isEditing ? "Save" : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default TestCasesFormDialog
