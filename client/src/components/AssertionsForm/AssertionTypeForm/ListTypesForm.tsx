// ListTypesForm.tsx
import React, { useEffect, useState } from "react"
import Box from "@mui/material/Box"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import { Assertion } from "@/api/apiSchemas"
import ClearIcon from "@mui/icons-material/Clear"
import AddIcon from "@mui/icons-material/Add"

interface ListTypesFormProps {
  required?: boolean
  placeholder?: string
  open: boolean
  values: Assertion["value"]
  setValues: React.Dispatch<React.SetStateAction<Assertion["value"]>>
}

const ListTypesForm: React.FC<ListTypesFormProps> = ({
  required = false,
  open,
  values,
  setValues,
  placeholder,
}) => {
  const [valuesList, setValuesList] = useState<string[]>([])
  useEffect(() => {
    if (Array.isArray(values)) setValuesList(values)
  }, [open])

  useEffect(() => {
    setValues(valuesList)
  }, [valuesList])

  const handleValueChange = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedValues = [...valuesList]
    updatedValues[index] = event.target.value
    setValuesList(updatedValues)
  }

  const handleAddValue = () => {
    setValuesList([...valuesList, ""])
  }

  const handleDeleteValue = (index: number) => () => {
    const updatedValues = valuesList.filter((_, i) => i !== index)
    setValuesList(updatedValues)
  }

  // Ensure at least one text field is displayed
  const valuesToRender = valuesList.length > 0 ? valuesList : [""]

  return (
    <Box>
      {valuesToRender.map((value, index) => (
        <Box key={index} display="flex" alignItems="center" mb={2}>
          <TextField
            value={value}
            onChange={handleValueChange(index)}
            placeholder={placeholder}
            fullWidth
            required={required}
          />
          <Button onClick={handleDeleteValue(index)}>
            <ClearIcon />
          </Button>
        </Box>
      ))}
      <Button onClick={handleAddValue}>
        <AddIcon />
      </Button>
    </Box>
  )
}

export default ListTypesForm
