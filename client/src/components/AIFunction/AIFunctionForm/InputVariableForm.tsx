"use client"
import React from "react"
import Box from "@mui/material/Box"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import { AIFunctionRouteInput } from "@/api/apiSchemas"

interface InputVariableFormProps {
  inputVariables: AIFunctionRouteInput["input_variables"]
  setInputVariables: React.Dispatch<React.SetStateAction<AIFunctionRouteInput["input_variables"]>>
}

const InputVariableForm: React.FC<InputVariableFormProps> = ({
  inputVariables,
  setInputVariables,
}) => {
  const handleNameChange = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedVariables = [...inputVariables]
    const newName = event.target.value.replace(" ", "")
    updatedVariables[index].name = newName
    setInputVariables(updatedVariables)
  }

  const handleAddVariable = () => {
    setInputVariables([...inputVariables, { name: "" }])
  }

  const handleDeleteVariable = (index: number) => () => {
    const updatedVariables = inputVariables.filter((_, i) => i !== index)
    setInputVariables(updatedVariables)
  }

  return (
    <Box>
      {inputVariables.map((inputVar, index) => (
        <Box key={index} display="flex" alignItems="center" mb={2}>
          <TextField value={inputVar.name} onChange={handleNameChange(index)} fullWidth />
          <Button onClick={handleDeleteVariable(index)}>×</Button>
        </Box>
      ))}
      <Button onClick={handleAddVariable}>+</Button>
    </Box>
  )
}

export default InputVariableForm
