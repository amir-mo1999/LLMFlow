"use client"

import React from "react"
import FieldRow from "./FieldRow"
import Box from "@mui/material/Box"

import { JsonSchemaInput } from "@/api/apiSchemas"

interface JsonSchemaEditorProps {
  schema: JsonSchemaInput
  setSchema?: (schema: JsonSchemaInput) => void
  displayOnly?: boolean
}

const JsonSchemaEditor: React.FC<JsonSchemaEditorProps> = ({
  schema,
  setSchema = () => {},
  displayOnly = false,
}) => {
  return (
    <Box display="flex" flexDirection="column" sx={{ gap: 2, width: "100%" }}>
      <FieldRow
        schema={schema}
        setSchema={setSchema}
        displayOnly={displayOnly}
        showAddProperty
        disableTitleEdit
        isRoot
      ></FieldRow>
    </Box>
  )
}

export default JsonSchemaEditor
