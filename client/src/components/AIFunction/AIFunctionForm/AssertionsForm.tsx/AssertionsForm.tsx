// AssertionsForm.tsx
import React, { useState, useEffect } from "react"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import AssertionFormDialog from "./AssertionsFormDialog"
import { AIFunctionRouteInput } from "@/api/apiSchemas"
import { Assertion } from "@/api/apiSchemas"

interface AssertionsFormProps {
  assertions: AIFunctionRouteInput["assert"]
  setAssertions: React.Dispatch<React.SetStateAction<AIFunctionRouteInput["assert"]>>
}

const AssertionsForm: React.FC<AssertionsFormProps> = ({ assertions, setAssertions }) => {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [currentIndex, setCurrentIndex] = useState<number | null>(null)
  const [currentAssertion, setCurrentAssertion] = useState<Assertion | undefined>(undefined)

  useEffect(() => console.log("current assertion", currentAssertion), [currentAssertion])

  const handleOpenAddDialog = () => {
    setIsEditing(false)
    setCurrentAssertion(undefined)
    setDialogOpen(true)
  }

  const handleOpenEditDialog = (index: number) => {
    setCurrentIndex(index)
    setCurrentAssertion(assertions[index])
    setIsEditing(true)
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setCurrentAssertion(undefined)
    setCurrentIndex(null)
  }

  const handleAddAssertion = (assertion: Assertion) => {
    setAssertions([...assertions, assertion])
  }

  const handleUpdateAssertion = (index: number, assertion: Assertion) => {
    const updatedAssertions = [...assertions]
    updatedAssertions[index] = assertion
    setAssertions(updatedAssertions)
  }

  const handleDeleteAssertion = (index: number) => () => {
    const updatedAssertions = assertions.filter((_, i) => i !== index)
    setAssertions(updatedAssertions)
  }

  return (
    <Box>
      {assertions.map((assertion, index) => (
        <Box key={index} display="flex" alignItems="center" mb={2}>
          <Typography
            onClick={() => handleOpenEditDialog(index)}
            style={{ cursor: "pointer", flexGrow: 1 }}
          >
            {assertion.type} weight {assertion.weight?.toString()}
          </Typography>
          <Button onClick={handleDeleteAssertion(index)}>×</Button>
        </Box>
      ))}
      <Button onClick={handleOpenAddDialog}>+</Button>

      <AssertionFormDialog
        open={dialogOpen}
        handleClose={handleCloseDialog}
        handleAdd={handleAddAssertion}
        handleUpdate={handleUpdateAssertion}
        assertion={currentAssertion}
        isEditing={isEditing}
        index={currentIndex !== null ? currentIndex : undefined}
      />
    </Box>
  )
}

export default AssertionsForm
