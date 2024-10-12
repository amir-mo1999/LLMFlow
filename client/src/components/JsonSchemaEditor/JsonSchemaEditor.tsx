"use client"

import React from "react"
import FieldRow from "./FieldRow"
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
    <FieldRow
      schema={schema}
      setSchema={setSchema}
      displayOnly={displayOnly}
      canDelete={false}
      disableTitleEdit
    ></FieldRow>
  )
}

export default JsonSchemaEditor
