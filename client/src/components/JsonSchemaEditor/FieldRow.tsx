import React, { useState, useEffect } from "react"
import Box from "@mui/material/Box"
import { JsonSchemaInput } from "@/api/apiSchemas"
import Select, { SelectChangeEvent } from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"
import TextField from "@mui/material/TextField"
import Tooltip from "@mui/material/Tooltip"
import IconButton from "@mui/material/IconButton"
import AddIcon from "@mui/icons-material/Add"
import SettingsIcon from "@mui/icons-material/Settings"

interface FieldRowProps {
  schema: JsonSchemaInput
  setSchema?: (schema: JsonSchemaInput) => void
  displayOnly?: boolean
  canDelete?: boolean
  disableTitleEdit?: boolean
  disableTypeEdit?: boolean
  indent?: number
  keys?: string[]
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
  setSchema = () => {},
  displayOnly = false,
  canDelete = true,
  disableTitleEdit = false,
  disableTypeEdit = false,
  indent = 0,
  keys = [],
}) => {
  const [type, setType] = useState<JsonSchemaInput["type"]>(schema.type)
  const [title, setTitle] = useState<string>(schema.title ? schema.title : "")
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

  const onTypeChange = (e: SelectChangeEvent) => {
    setType(e.target.value as JsonSchemaInput["type"])
  }

  return (
    <>
      <Box display="flex" sx={{ marginLeft: indent, marginBottom: 1 }}>
        <TextField
          size="small"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={disableTitleEdit}
        >
          newProperty
        </TextField>

        <Select value={type} onChange={onTypeChange} size="small" disabled={disableTypeEdit}>
          {["string", "number", "integer", "array", "object", "boolean"].map((type, indx) => (
            <MenuItem key={indx} value={type}>
              {type}
            </MenuItem>
          ))}
        </Select>

        <Tooltip title="Add property" placement="top">
          <IconButton color="primary">
            <AddIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Advanced Settings" placement="top">
          <IconButton color="primary" size="small">
            <SettingsIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </>
  )
}

export default FieldRow
