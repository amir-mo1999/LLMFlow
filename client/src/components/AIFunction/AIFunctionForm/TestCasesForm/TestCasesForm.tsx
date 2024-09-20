// TestCasesForm.tsx
import React, { useState } from "react"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import TestCasesFormDialog from "./TestCasesFormDialog"
import AssertionsForm from "../AssertionsForm.tsx/AssertionsForm"
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
    setCurrentTestCaseIndex(undefined)
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

  const handleDeleteTestCase = (index: number) => (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation() // Prevent triggering the edit dialog
    const updatedTestCases = testCases.filter((_, i) => i !== index)
    setTestCases(updatedTestCases)
  }

  // Handler to update assertions for a specific Test Case
  const handleSetTestCaseAssertions = (index: number, newAssertions: Assertion[]) => {
    const updatedTestCases = [...testCases]
    updatedTestCases[index].assert = newAssertions
    setTestCases(updatedTestCases)
  }

  return (
    <Box>
      {testCases.length > 0 ? (
        testCases.map((testCase, index) => (
          <Box
            key={index}
            display="flex"
            flexDirection="column"
            alignItems="flex-start"
            mb={4}
            style={{
              cursor: "pointer",
              border: "1px solid #ccc",
              padding: "16px",
              borderRadius: "8px",
            }}
          >
            {/* Display Test Case Variables */}
            <Box mb={2} onClick={() => handleOpenEditDialog(index)}>
              {inputVariables.map((variable, varIndex) => (
                <Typography key={varIndex}>
                  <strong>{variable.name}:</strong> {testCase.vars[variable.name]}
                </Typography>
              ))}
            </Box>

            {/* Display AssertionsForm for this Test Case */}
            <Box width="100%">
              <Typography variant="subtitle1" gutterBottom>
                Assertions:
              </Typography>
              <AssertionsForm
                assertions={testCase.assert || []}
                setAssertions={(newAssertions) => handleSetTestCaseAssertions(index, newAssertions)}
              />
            </Box>

            {/* Delete Button */}
            <Box alignSelf="flex-end">
              <Button onClick={handleDeleteTestCase(index)} aria-label="Delete Test Case">
                ×
              </Button>
            </Box>
          </Box>
        ))
      ) : (
        <></>
      )}

      {/* Add Test Case Button */}
      <Button onClick={handleOpenAddDialog} variant="contained" color="primary">
        Add Test Case
      </Button>

      {/* TestCasesFormDialog for Adding/Editing Test Cases */}
      <TestCasesFormDialog
        open={dialogOpen}
        handleClose={handleCloseDialog}
        handleAddTestCase={handleAddTestCase}
        handleUpdateTestCase={
          isEditing && currentTestCaseIndex !== undefined ? handleUpdateTestCase : undefined
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
