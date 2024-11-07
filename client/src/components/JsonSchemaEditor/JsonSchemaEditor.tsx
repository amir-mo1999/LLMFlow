"use client"

import React from "react"
import FieldRow from "./FieldRow"
import Box from "@mui/material/Box"
import { pick } from "@/utils"

import { JsonSchemaInput } from "@/api/apiSchemas"

const ObjectSettingsFields: Array<keyof Partial<JsonSchemaInput>> = [
  "properties",
  "patternProperties",
  "additionalProperties",
  "maxProperties",
  "minProperties",
  "required",
]
const ArraySettingsFields: Array<keyof Partial<JsonSchemaInput>> = [
  "items",
  "contains",
  "maxContains",
  "minContains",
  "maxItems",
  "minItems",
  "uniqueItems",
]

const StringSettingsFields: Array<keyof Partial<JsonSchemaInput>> = [
  "maxLength",
  "minLength",
  "pattern",
]

const NumberSettingsFields: Array<keyof Partial<JsonSchemaInput>> = [
  "multipleOf",
  "maximum",
  "exclusiveMaximum",
  "minimum",
  "exclusiveMinimum",
]

const settingsFieldsMapping: Record<
  JsonSchemaInput["type"],
  Array<keyof Partial<JsonSchemaInput>>
> = {
  string: StringSettingsFields,
  number: NumberSettingsFields,
  object: ObjectSettingsFields,
  array: ArraySettingsFields,
  boolean: [],
  integer: NumberSettingsFields,
  null: [],
}

interface JsonSchemaEditorProps {
  schema: JsonSchemaInput
  setSchema?: (_: JsonSchemaInput) => void
  displayOnly?: boolean
}

const JsonSchemaEditor: React.FC<JsonSchemaEditorProps> = ({
  schema,
  setSchema = () => {},
  displayOnly = false,
}) => {
  const settings = pick(schema, ...settingsFieldsMapping[schema.type])
  return (
    <Box display="flex" flexDirection="column" sx={{ gap: 2, width: "100%" }}>
      <FieldRow
        schema={schema}
        setSchema={setSchema}
        schemaSettings={settings}
        displayOnly={displayOnly}
        showAddProperty
        disableTitleEdit
        isRoot
      ></FieldRow>
    </Box>
  )
}

export default JsonSchemaEditor
