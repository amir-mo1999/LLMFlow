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
  typeInit?: JsonSchemaInput["type"]
  disableTypeEdit?: boolean
  indent?: number
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
  typeInit = "string",
  disableTypeEdit = false,
  indent = 0,
}) => {
  const [type, setType] = useState<JsonSchemaInput["type"]>(typeInit)
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

  const isRoot = fieldNameInit === "root" ? true : false

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

  const onDeleteField = () => {}

  return (
    <>
      <Box display="flex" sx={{ marginLeft: indent, marginBottom: 1 }}>
        <TextField
          size="small"
          value={fieldName}
          onChange={onNameChange}
          disabled={!canEditFieldName}
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

        <Tooltip title="Add property">
          <IconButton color="primary" sx={{ display: showAddProperty ? "normal" : "none" }}>
            <AddIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {type === "array" ? (
        <>
          <FieldRow
            schema={schema}
            setSchema={setSchema}
            fieldNameInit="items"
            displayOnly={displayOnly}
            typeInit="string"
            indent={indent + 4}
          ></FieldRow>
          <FieldRow
            schema={schema}
            setSchema={setSchema}
            fieldNameInit="contains"
            displayOnly={displayOnly}
            typeInit="string"
            indent={indent + 4}
          ></FieldRow>
        </>
      ) : (
        <></>
      )}

      {type === "object" &&
      (canEditFieldName || isRoot || ["items", "contains"].includes(fieldNameInit)) ? (
        <>
          <FieldRow
            schema={schema}
            setSchema={setSchema}
            fieldNameInit="properties"
            displayOnly={displayOnly}
            disableTypeEdit
            typeInit="object"
            indent={indent + 4}
          ></FieldRow>
          <FieldRow
            schema={schema}
            setSchema={setSchema}
            fieldNameInit="patternProperties"
            displayOnly={displayOnly}
            disableTypeEdit
            typeInit="object"
            indent={indent + 4}
          ></FieldRow>
          <FieldRow
            schema={schema}
            setSchema={setSchema}
            fieldNameInit="additionalProperties"
            displayOnly={displayOnly}
            disableTypeEdit
            typeInit="object"
            indent={indent + 4}
          ></FieldRow>
        </>
      ) : (
        <></>
      )}
    </>
  )
}

export default FieldRow
