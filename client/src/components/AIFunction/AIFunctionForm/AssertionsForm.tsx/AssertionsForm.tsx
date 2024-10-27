import React, { useState } from "react"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import AssertionFormDialog from "./AssertionsFormDialog"
import { Assertion } from "@/api/apiSchemas"
import AddIcon from "@mui/icons-material/Add"
import AssertionsOverview from "../../AssertionsOverview"
import Typography, { TypographyOwnProps } from "@mui/material/Typography"

interface AssertionsFormProps {
  assertions: Assertion[]
  jsonAssertions?: Assertion[]
  setAssertions: (assertions: Assertion[]) => void
  headerVariant?: TypographyOwnProps["variant"]
}

const AssertionsForm: React.FC<AssertionsFormProps> = ({
  assertions,
  jsonAssertions = [],
  setAssertions,
  headerVariant = "h5",
}) => {
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
    const f = () => {
      setCurrentIndex(index)
      setCurrentAssertion(assertions[index])
      setIsEditing(true)
      setDialogOpen(true)
    }
    return f
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

  const handleDeleteAssertion = (index: number) => {
    const f = () => {
      const updatedAssertions = assertions.filter((_, i) => i !== index)
      setAssertions(updatedAssertions)
    }
    return f
  }

  return (
    <Box sx={{ display: "flex", width: "100%", flexDirection: "column" }}>
      <Box sx={{ display: "flex", flexDirection: "row", gap: 2, marginBottom: 1 }}>
        <Typography variant={headerVariant}>Assertions</Typography>

        <Button onClick={handleOpenAddDialog} color="primary">
          <AddIcon />
        </Button>
      </Box>
      <AssertionsOverview
        assertions={[...jsonAssertions, ...assertions]}
        onClick={handleOpenEditDialog}
        onDelete={handleDeleteAssertion}
      ></AssertionsOverview>

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
