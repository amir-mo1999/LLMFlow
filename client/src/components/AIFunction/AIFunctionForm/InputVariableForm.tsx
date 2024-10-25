"use client"
import React from "react"
import Box from "@mui/material/Box"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import { AIFunctionRouteInput } from "@/api/apiSchemas"
import { SxProps } from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import ClearIcon from "@mui/icons-material/Clear"
import Typography from "@mui/material/Typography"

interface InputVariableFormProps {
  inputVariables: AIFunctionRouteInput["input_variables"]
  setInputVariables: React.Dispatch<React.SetStateAction<AIFunctionRouteInput["input_variables"]>>
  sx?: SxProps
}

const InputVariableForm: React.FC<InputVariableFormProps> = ({
  inputVariables,
  setInputVariables,
  sx,
}) => {
  const maxVarNameChars = 40
  const handleNameChange = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const newName = event.target.value.replace(" ", "")
    if (newName.length <= maxVarNameChars) {
      const updatedVariables = [...inputVariables]
      updatedVariables[index].name = newName
      setInputVariables(updatedVariables)
    }
  }

  const handleAddVariable = () => {
    setInputVariables([...inputVariables, { name: "" }])
  }

  const handleDeleteVariable = (index: number) => () => {
    const updatedVariables = inputVariables.filter((_, i) => i !== index)
    setInputVariables(updatedVariables)
  }

  return (
    <Box sx={{ ...sx }}>
      <Box sx={{ display: "flex", flexDirection: "row", gap: 2, paddingBottom: 1 }}>
        <Typography variant="h5">Variables</Typography>

        <Button onClick={handleAddVariable}>
          <AddIcon />
        </Button>
      </Box>
      {inputVariables.map((inputVar, index) => (
        <Box key={index} display="flex" alignItems="center" pb={1}>
          <TextField value={inputVar.name} onChange={handleNameChange(index)} fullWidth />
          <Button onClick={handleDeleteVariable(index)}>
            <ClearIcon />
          </Button>
        </Box>
      ))}
    </Box>
  )
}

export default InputVariableForm
