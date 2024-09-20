// TestCasesForm.tsx
import React, { useEffect, useState } from "react"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import TestCasesFormDialog from "./TestCasesFormDialog"
import { TestCaseInput, InputVariable, Assertion } from "@/api/apiSchemas"

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
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [currentTestCase, setCurrentTestCase] = useState<TestCaseInput | undefined>(undefined)
  const [currentTestCaseIndex, setCurrentTestCaseIndex] = useState<number | undefined>(undefined)

  const handleOpenAddDialog = () => {
    setIsEditing(false)
    setCurrentTestCase(undefined)
    setDialogOpen(true)
  }

  const handleOpenEditDialog = (index: number) => {
    setIsEditing(true)
    setCurrentTestCase(testCases[index])
    setCurrentTestCaseIndex(index)
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setCurrentTestCase(undefined)
    setCurrentTestCaseIndex(undefined)
  }

  const handleAddTestCase = (testCase: TestCaseInput) => {
    setTestCases([...testCases, testCase])
  }

  const handleUpdateTestCase = (index: number, updatedTestCase: TestCaseInput) => {
    const updatedTestCases = [...testCases]
    updatedTestCases[index] = updatedTestCase
    setTestCases(updatedTestCases)
  }

  const handleDeleteTestCase = (index: number) => () => {
    const updatedTestCases = testCases.filter((_, i) => i !== index)
    setTestCases(updatedTestCases)
  }

  return (
    <Box>
      {testCases.length > 0 ? (
        testCases.map((testCase, index) => (
          <Box
            key={index}
            display="flex"
            alignItems="center"
            mb={2}
            onClick={() => handleOpenEditDialog(index)}
            style={{
              cursor: "pointer",
              border: "1px solid #ccc",
              padding: "8px",
              borderRadius: "4px",
            }}
          >
            <Box flexGrow={1}>
              {inputVariables.map((variable, varIndex) => (
                <Typography key={varIndex}>
                  <strong>{variable.name}:</strong> {testCase.vars[variable.name]}
                </Typography>
              ))}
            </Box>
            <Button
              onClick={(e) => {
                e.stopPropagation()
                handleDeleteTestCase(index)
              }}
            >
              ×
            </Button>
          </Box>
        ))
      ) : (
        <></>
      )}
      <Button onClick={handleOpenAddDialog} variant="contained" color="primary">
        Add Test Case
      </Button>

      <TestCasesFormDialog
        open={dialogOpen}
        handleClose={handleCloseDialog}
        handleAddTestCase={handleAddTestCase}
        handleUpdateTestCase={
          currentTestCaseIndex !== undefined && currentTestCase ? handleUpdateTestCase : undefined
        }
        inputVariables={inputVariables}
        initialTestCase={currentTestCase}
        isEditing={isEditing}
        index={currentTestCaseIndex}
      />
    </Box>
  )
}

export default TestCasesForm
