import React, { useState, useEffect } from "react"
import Box from "@mui/material/Box"
import { JsonSchemaInput } from "@/api/apiSchemas"
import Select, { SelectChangeEvent } from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"
import TextField from "@mui/material/TextField"
import Tooltip from "@mui/material/Tooltip"
import IconButton from "@mui/material/IconButton"
import AddIcon from "@mui/icons-material/Add"

interface FieldRowProps {
  schema: JsonSchemaInput
  setSchema?: (schema: JsonSchemaInput) => void
  displayOnly?: boolean
  canDelete?: boolean
  fieldNameInit?: string
}

type StringSchema = Pick<JsonSchemaInput, "maxLength" | "minLength" | "pattern">
type NumberSchema = Pick<
  JsonSchemaInput,
  "multipleOf" | "maximum" | "exclusiveMaximum" | "minimum" | "exclusiveMinimum"
>
type arraySchema = Pick<
  JsonSchemaInput,
  "items" | "contains" | "maxContains" | "minContains" | "maxItems" | "minItems" | "uniqueItems"
>
type objectSchema = Pick<
  JsonSchemaInput,
  | "properties"
  | "patternProperties"
  | "additionalProperties"
  | "maxProperties"
  | "minProperties"
  | "required"
>

const FieldRow: React.FC<FieldRowProps> = ({
  schema,
  fieldNameInit = "newField",
  setSchema = () => {},
  displayOnly = false,
  canDelete = true,
}) => {
  const [type, setType] = useState<JsonSchemaInput["type"]>(schema.type)
  const [stringSetting, setStringSettings] = useState<StringSchema>({
    maxLength: schema.maxLength,
    minLength: schema.minLength,
    pattern: schema.pattern,
  })
  const [numberSettings, setNumberSettings] = useState<NumberSchema>({
    multipleOf: schema.multipleOf,
    maximum: schema.maximum,
    exclusiveMaximum: schema.exclusiveMaximum,
    minimum: schema.minimum,
    exclusiveMinimum: schema.exclusiveMinimum,
  })
  const [arraySettings, setArraySettings] = useState<arraySchema>({
    items: schema.items,
    contains: schema.contains,
    maxContains: schema.maxContains,
    minContains: schema.minContains,
    maxItems: schema.maxItems,
    minItems: schema.minItems,
    uniqueItems: schema.uniqueItems,
  })
  const [objectSettings, setObjectSettings] = useState<objectSchema>({
    properties: schema.properties,
    patternProperties: schema.patternProperties,
    additionalProperties: schema.additionalProperties,
    maxProperties: schema.maxProperties,
    minProperties: schema.minProperties,
    required: schema.required,
  })

  const showAddProperty = displayOnly
    ? false
    : ["properties", "patternProperties", "additionalProperties"].includes(fieldNameInit)
      ? true
      : false

  const [fieldName, setFieldName] = useState<string>(fieldNameInit)
  const onNameChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFieldName(e.target.value)
  }
  const canEditFieldName = displayOnly
    ? false
    : [
          "items",
          "contains",
          "properties",
          "patternProperties",
          "additionalProperties",
          "root",
        ].includes(fieldNameInit)
      ? false
      : true

  const onTypeChange = (e: SelectChangeEvent) => {
    setType(e.target.value as JsonSchemaInput["type"])
  }

  return (
    <Box display="flex">
      <TextField
        size="small"
        value={fieldName}
        onChange={onNameChange}
        disabled={!canEditFieldName}
      >
        newProperty
      </TextField>

      <Select value={type} onChange={onTypeChange} size="small">
        {["string", "number", "integer", "array", "object", "boolean"].map((type, indx) => (
          <MenuItem key={indx} value={type}>
            {type}
          </MenuItem>
        ))}
      </Select>

      <Tooltip title="Add property">
        <IconButton color="primary" sx={{ display: showAddProperty ? "normal" : "none" }}>
          <AddIcon />
        </IconButton>
      </Tooltip>
    </Box>
  )
}

export default FieldRow
