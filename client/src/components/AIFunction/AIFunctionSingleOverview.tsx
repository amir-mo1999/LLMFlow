"use client"
import React from "react"
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
import { addTitlesToSchema } from "@/utils"
import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from "@mui/icons-material/Edit"
import AddIcon from "@mui/icons-material/Add"

interface AIFunctionSingleOverviewProps {
  onDeleteAIFunction: () => void
  aiFunction: AIFunction
  onClickEdit?: (aiFunctionID: string) => void
  onClickAddPrompt?: (aiFunctionID: string) => void
}

const options: Intl.DateTimeFormatOptions = {
  timeZone: "Europe/Berlin",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
}

const AIFunctionSingleOverview: React.FC<AIFunctionSingleOverviewProps> = ({
  onDeleteAIFunction,
  aiFunction,
  onClickEdit = () => {},
  onClickAddPrompt,
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
      <Typography variant="h4">{aiFunction.name}</Typography>

      {/* Creation Time */}
      <Typography gutterBottom>
        {new Date(aiFunction.creation_time).toLocaleString("de-DE", options)}
      </Typography>

      {/* Description */}
      <Typography variant="body1">{aiFunction.description}</Typography>
      <Divider sx={{ marginY: 2 }}></Divider>
      {/* Input Variables */}
      <Typography variant="h5" sx={{ paddingBottom: 1 }}>
        Variables
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        {aiFunction.input_variables.map((inputVar, indx) => (
          <Chip
            key={indx}
            label={inputVar.name}
            sx={{ fontSize: "1rem" }}
            color="primary"
            variant="outlined"
            size="medium"
          ></Chip>
        ))}
      </Box>

      {/* Json Schema */}
      <Divider sx={{ marginY: 2 }}></Divider>
      <Box>
        <Typography variant="h5" paddingBottom={1}>
          Output Type
        </Typography>
        {aiFunction.output_schema.type === "string" ? (
          <Chip
            label="string"
            sx={{ fontSize: "1rem" }}
            color="primary"
            variant="outlined"
            size="medium"
          />
        ) : (
          <>
            <Chip
              label="json"
              sx={{ fontSize: "1rem", marginBottom: 1 }}
              color="primary"
              variant="outlined"
              size="medium"
            />
            <Typography variant="h6" paddingBottom={1}>
              JSON Schema
            </Typography>
            <JsonSchemaEditor
              schema={addTitlesToSchema(aiFunction.output_schema)}
              displayOnly
            ></JsonSchemaEditor>
          </>
        )}
      </Box>

      {/* Output Assertions */}
      <Divider sx={{ marginY: 2 }}></Divider>
      <Typography variant="h5" paddingBottom={1}>
        Assertions
      </Typography>
      {aiFunction.assert.length === 0 ? (
        <Typography variant="body2">No output assertions defined.</Typography>
      ) : (
        <AssertionsOverview assertions={aiFunction.assert} displayOnly></AssertionsOverview>
      )}

      <Divider sx={{ marginY: 2 }}></Divider>
      {/* Test Cases */}
      <Typography variant="h5" paddingBottom={1}>
        Test Cases
      </Typography>
      {aiFunction.test_cases.length === 0 ? (
        <Typography variant="body2">No test cases defined.</Typography>
      ) : (
        <TestCasesOverview testCases={aiFunction.test_cases} displayOnly></TestCasesOverview>
      )}

      <Divider sx={{ marginY: 2 }}></Divider>
      <Box>
        <Button
          variant="contained"
          sx={{ mr: 5 }}
          onClick={() => onClickEdit(aiFunction._id as string)}
          startIcon={<EditIcon sx={{ mb: 0.4 }} />}
        >
          Edit
        </Button>
        <Button
          variant="contained"
          sx={{ mr: 5, display: onClickAddPrompt ? "normal" : "none" }}
          onClick={() => onClickAddPrompt?.(aiFunction._id as string)}
          startIcon={<AddIcon sx={{ mb: 0.4 }} />}
        >
          Add Prompt
        </Button>
        <Button
          variant="contained"
          color="error"
          startIcon={<DeleteIcon sx={{ mb: 0.4 }} />}
          onClick={onClickDelete}
        >
          Delete
        </Button>
      </Box>
    </Box>
  )
}

export default AIFunctionSingleOverview
