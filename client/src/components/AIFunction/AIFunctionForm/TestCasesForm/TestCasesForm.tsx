// TestCasesForm.tsx
import React, { useEffect, useState } from "react"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import TestCasesFormDialog from "./TestCasesFormDialog"
import { AIFunctionRouteInput, InputVariable, TestCaseInput } from "@/api/apiSchemas"

interface TestCasesFormProps {
  inputVariables: InputVariable[]
  testCases: TestCaseInput[]
  setTestCases: React.Dispatch<React.SetStateAction<TestCaseInput[]>>
}

const TestCasesForm: React.FC<TestCasesFormProps> = ({
  inputVariables,
  testCases,
  setTestCases,
}) => {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)

  const handleOpenDialog = () => {
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
  }

  const handleAddTestCase = (testCase: TestCaseInput) => {
    setTestCases([...testCases, testCase])
  }

  const handleDeleteTestCase = (index: number) => () => {
    const updatedTestCases = testCases.filter((_, i) => i !== index)
    setTestCases(updatedTestCases)
  }

  return (
    <Box>
      {testCases.length >= 0 ? (
        testCases.map((testCase, index) => (
          <Box key={index} display="flex" alignItems="center" mb={2}>
            <Box flexGrow={1}>
              {inputVariables.map((variable, varIndex) => (
                <Typography key={varIndex}>
                  <strong>{variable.name}:</strong> {testCase.vars[variable.name]}
                </Typography>
              ))}
            </Box>
            <Button onClick={handleDeleteTestCase(index)}>×</Button>
          </Box>
        ))
      ) : (
        <></>
      )}
      <Button onClick={handleOpenDialog} variant="contained" color="primary">
        Add Test Case
      </Button>

      <TestCasesFormDialog
        open={dialogOpen}
        handleClose={handleCloseDialog}
        handleAddTestCase={handleAddTestCase}
        inputVariables={inputVariables}
      />
    </Box>
  )
}

export default TestCasesForm
