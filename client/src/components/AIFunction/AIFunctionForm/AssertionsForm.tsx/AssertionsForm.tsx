import React, { useState, useEffect } from "react"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import AssertionFormDialog from "./AssertionsFormDialog"
import { Assertion } from "@/api/apiSchemas"
import AddIcon from "@mui/icons-material/Add"
import AssertionsOverview from "../../AssertionsOverview"

interface AssertionsFormProps {
  assertions: Assertion[]
  setAssertions: (assertions: Assertion[]) => void
}

const AssertionsForm: React.FC<AssertionsFormProps> = ({ assertions, setAssertions }) => {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [currentIndex, setCurrentIndex] = useState<number | null>(null)
  const [currentAssertion, setCurrentAssertion] = useState<Assertion | undefined>(undefined)

  const handleOpenAddDialog = () => {
    setIsEditing(false)
    setCurrentAssertion(undefined)
    setDialogOpen(true)
  }

  const handleOpenEditDialog = (index: number) => {
    console.log("opening", index)
    setCurrentIndex(index)
    setCurrentAssertion(assertions[index])
    setIsEditing(true)
    setDialogOpen(true)
  }

  useEffect(() => console.log(currentAssertion), [currentAssertion])

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

  const handleDeleteAssertion = (index: number) => {
    const updatedAssertions = assertions.filter((_, i) => i !== index)
    setAssertions(updatedAssertions)
  }

  return (
    <Box sx={{ display: "flex", width: "100%", flexDirection: "column" }}>
      <AssertionsOverview
        assertions={assertions}
        onClick={handleOpenEditDialog}
        onDelete={handleDeleteAssertion}
      ></AssertionsOverview>
      <Button onClick={handleOpenAddDialog}>
        <AddIcon />
      </Button>

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
