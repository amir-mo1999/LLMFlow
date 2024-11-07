// TestCasesForm.tsx
import React, { useState, useEffect } from "react"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import TestCasesFormDialog from "./TestCasesFormDialog"
import { TestCaseInput, InputVariable, Assertion } from "@/api/apiSchemas"
import AddIcon from "@mui/icons-material/Add"
import { TestCasesOverview } from "@/components"

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
    const f = () => {
      setIsEditing(true)
      setCurrentTestCase(testCases[index])
      setCurrentTestCaseIndex(index)
      setDialogOpen(true)
    }
    return f
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
    const f = () => {
      const updatedTestCases = testCases.filter((_, i) => i !== index)
      setTestCases(updatedTestCases)
    }
    return f
  }

  // Handler to update assertions for a specific Test Case
  const handleSetTestCaseAssertions = (index: number) => {
    const f = (assertions: Assertion[]) => {
      const updatedTestCases = [...testCases]
      updatedTestCases[index].assert = assertions
      setTestCases(updatedTestCases)
    }
    return f
  }

  useEffect(() => {
    const newTestCases = [...testCases]
    newTestCases.forEach((testCase) => {
      const newVars: TestCaseInput["vars"] = {}
      // get the variable names and contents from the test case variables
      const varNames = Object.keys(testCase.vars)
      const varContents = Object.values(testCase.vars)

      // get all input variable names
      const inputVarNames: string[] = inputVariables.reduce((varNames, inputVar) => {
        varNames.push(inputVar.name)
        return varNames
      }, [] as string[])

      inputVarNames.forEach((varName) => {
        if (varNames.includes(varName)) {
          newVars[varName] = varContents[varNames.indexOf(varName)]
        } else {
          newVars[varName] = "Click to change value"
        }
      })

      testCase.vars = { ...newVars }
    })
    setTestCases(newTestCases)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputVariables, setTestCases])

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
