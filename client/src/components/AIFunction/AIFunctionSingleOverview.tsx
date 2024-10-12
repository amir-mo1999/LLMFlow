"use client"
import React, { useState } from "react"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import Divider from "@mui/material/Divider"
import { useDeleteAiFunction } from "@/api/apiComponents"
import AssertionsOverview from "./AssertionsOverview"
import { AIFunction } from "@/api/apiSchemas"
import Chip from "@mui/material/Chip"
import TestCasesOverview from "./TestCasesOverview"
import JsonSchemaEditor from "../JsonSchemaEditor"

interface AIFunctionSingleOverviewProps {
  onDeleteAIFunction: () => void
  aiFunction: AIFunction
}

const AIFunctionSingleOverview: React.FC<AIFunctionSingleOverviewProps> = ({
  onDeleteAIFunction,
  aiFunction,
}) => {
  const { mutate: deleteAIFunction } = useDeleteAiFunction({})

  const onClickDelete = () => {
    onDeleteAIFunction()
    deleteAIFunction({ pathParams: { aiFunctionId: aiFunction._id as string } })
  }

  if (!aiFunction) {
    return <></>
  }

  return (
    <Box sx={{ width: "100%", display: "flex", flexDirection: "column" }}>
      {/* AI Function Name */}
      <Typography variant="h4" gutterBottom>
        {aiFunction.name}
      </Typography>
      {/* Description */}
      <Typography variant="body1" gutterBottom>
        {aiFunction.description}
      </Typography>
      <Divider sx={{ marginY: 2 }}></Divider>
      {/* Input Variables */}
      <Box marginBottom={1}>
        <Typography variant="h5" sx={{ paddingBottom: 1 }}>
          Input Variables
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {aiFunction.input_variables.map((inputVar, indx) => (
            <Chip key={indx} label={inputVar.name} variant="outlined" size="medium"></Chip>
          ))}
        </Box>
      </Box>
      <Divider sx={{ marginY: 2 }}></Divider>
      <JsonSchemaEditor schema={aiFunction.output_schema} displayOnly></JsonSchemaEditor>
      <Divider sx={{ marginY: 2 }}></Divider>

      {/* Output Assertions */}
      <Box marginBottom={1}>
        <Typography variant="h5" paddingBottom={1}>
          Output Assertions
        </Typography>
        {aiFunction.assert.length === 0 ? (
          <Typography variant="body2">No output assertions defined.</Typography>
        ) : (
          <AssertionsOverview assertions={aiFunction.assert} displayOnly></AssertionsOverview>
        )}
      </Box>
      <Divider sx={{ marginY: 2 }}></Divider>
      <Box marginBottom={1}>
        <Typography variant="h5" paddingBottom={1}>
          Test Cases
        </Typography>
        <TestCasesOverview testCases={aiFunction.test_cases} displayOnly></TestCasesOverview>
      </Box>

      <Divider sx={{ marginY: 2 }}></Divider>
      <Button variant="contained" color="error" onClick={onClickDelete}>
        Delete AI Function
      </Button>
    </Box>
  )
}

export default AIFunctionSingleOverview
