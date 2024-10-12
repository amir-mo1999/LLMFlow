import React, { useState, useEffect } from "react"
import Box from "@mui/material/Box"
import { JsonSchemaInput } from "@/api/apiSchemas"
import Select, { SelectChangeEvent } from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"
import TextField from "@mui/material/TextField"
import Tooltip from "@mui/material/Tooltip"
import Checkbox from "@mui/material/Checkbox"

import IconButton from "@mui/material/IconButton"
import AddIcon from "@mui/icons-material/Add"
import SettingsIcon from "@mui/icons-material/Settings"

function getValueFromNestedObject(obj: Record<string, any>, keys: string[]): any {
  return keys.reduce((acc, key) => {
    if (acc && key in acc) {
      return acc[key]
    }
    return undefined
  }, obj)
}

interface FieldRowProps {
  schema: JsonSchemaInput
  setSchema?: (schema: JsonSchemaInput) => void
  displayOnly?: boolean
  canDelete?: boolean
  fieldNameInit?: string
  typeInit?: JsonSchemaInput["type"]
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
  fieldNameInit = "newField",
  setSchema = () => {},
  displayOnly = false,
  canDelete = true,
  typeInit = "string",
  disableTypeEdit = false,
  indent = 0,
  keys = [],
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

  const isRoot = fieldNameInit === "root" ? true : false

  const showAddProperty = displayOnly
    ? false
    : ["properties", "patternProperties", "additionalProperties"].includes(fieldNameInit)
      ? true
      : false

  const showAdvancedSttings = ["properties", "patternProperties", "additionalProperties"].includes(
    fieldNameInit
  )
    ? false
    : true

  const onTypeChange = (e: SelectChangeEvent) => {
    setType(e.target.value as JsonSchemaInput["type"])
  }

  const onAddProperty = () => {}
  const onDeleteProperty = () => {}

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

        <Tooltip title="Add property" placement="top">
          <IconButton color="primary" sx={{ display: showAddProperty ? "normal" : "none" }}>
            <AddIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Advanced Settings" placement="top">
          <IconButton
            color="primary"
            size="small"
            sx={{ display: showAdvancedSttings ? "normal" : "none" }}
          >
            <SettingsIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {type === "array" ? (
        arraySettings.contains ? (
          <FieldRow
            schema={schema}
            setSchema={setSchema}
            fieldNameInit="contains"
            displayOnly={displayOnly}
            typeInit="string"
            indent={indent + 4}
            keys={keys.concat(["contains"])}
          ></FieldRow>
        ) : (
          <FieldRow
            schema={schema}
            setSchema={setSchema}
            fieldNameInit="items"
            displayOnly={displayOnly}
            typeInit="string"
            indent={indent + 4}
            keys={keys.concat(["items"])}
          ></FieldRow>
        )
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
            keys={keys.concat(["properties"])}
          ></FieldRow>
          {objectSettings.additionalProperties ? (
            <FieldRow
              schema={schema}
              setSchema={setSchema}
              fieldNameInit="additionalProperties"
              displayOnly={displayOnly}
              disableTypeEdit
              typeInit="object"
              indent={indent + 4}
              keys={keys.concat(["additionalProperties"])}
            ></FieldRow>
          ) : (
            <></>
          )}
        </>
      ) : (
        <></>
      )}
    </>
  )
}

export default FieldRow
