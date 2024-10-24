// TestCasesForm.tsx
import React, { useState } from "react"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import TestCasesFormDialog from "./TestCasesFormDialog"
import AssertionsForm from "../AssertionsForm.tsx/AssertionsForm"
import { TestCaseInput, InputVariable, Assertion } from "@/api/apiSchemas"
import TestCasesOverview from "../../TestCasesOverview"
import AddIcon from "@mui/icons-material/Add"

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

  const handleDeleteTestCase = (index: number) => {
    const updatedTestCases = testCases.filter((_, i) => i !== index)
    setTestCases(updatedTestCases)
    console.log("setting test cases")
  }

  // Handler to update assertions for a specific Test Case
  const handleSetTestCaseAssertions = (index: number, newAssertions: Assertion[]) => {
    const updatedTestCases = [...testCases]
    updatedTestCases[index].assert = newAssertions
    setTestCases(updatedTestCases)
  }

  return (
    <Box>
      <Box sx={{ display: "flex", flexDirection: "row", gap: 2, paddingBottom: 1 }}>
        <Typography variant="h5">Test Cases</Typography>
        <Button onClick={handleOpenAddDialog} color="primary">
          <AddIcon />
        </Button>
      </Box>

      <TestCasesOverview
        testCases={testCases}
        setAssertions={handleSetTestCaseAssertions}
        onClickVars={handleOpenEditDialog}
        onDelete={handleDeleteTestCase}
      ></TestCasesOverview>

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
