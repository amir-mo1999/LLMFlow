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
import DeleteIcon from "@mui/icons-material/Delete"

interface FieldRowProps {
  schema: JsonSchemaInput
  setSchema?: (schema: JsonSchemaInput) => void
  displayOnly?: boolean
  disableTitleEdit?: boolean
  disableTypeEdit?: boolean
  showAddProperty?: boolean
  showAdvanced?: boolean
  showDelete?: boolean
  onDelete?: () => void
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
  setSchema = () => {},
  displayOnly = false,
  disableTitleEdit = false,
  disableTypeEdit = false,
  showAddProperty = false,
  showAdvanced = false,
  showDelete = false,
  onDelete,
  indent = 0,
}) => {
  console.log("local", schema)
  const [type, setType] = useState<JsonSchemaInput["type"]>(schema.type)
  const [title, setTitle] = useState<string>(schema.title ? schema.title : "")
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  useEffect(() => {
    setType(schema.type)
  }, [schema])
  const updateSchema = (updates: Partial<JsonSchemaInput>) => {
    const newSchema = { ...schema, ...updates }
    setSchema(newSchema)
  }

  const handleTypeChange = (event: SelectChangeEvent) => {
    const newType = event.target.value as JsonSchemaInput["type"]
    setType(newType)
    updateSchema({ type: newType })
  }

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = event.target.value
    setTitle(newTitle)
    updateSchema({ title: newTitle })
  }

  const handleAddProperty = () => {
    if (type === "object") {
      const newProperties = {
        ...(schema.properties || {}),
        [`newProperty${Object.keys(schema.properties || {}).length}`]: {
          type: "string",
          title: `newProperty${Object.keys(schema.properties || {}).length}`,
        },
      }
      //@ts-ignore
      updateSchema({ properties: newProperties })
    }
  }
  const handleDelete = () => {
    if (onDelete) {
      onDelete()
    }
  }

  const renderChildProperties = () => {
    if (type === "object" && schema.properties) {
      return Object.entries(schema.properties).map(([key, propSchema]) => (
        <FieldRow
          key={key}
          schema={propSchema}
          showDelete
          showAddProperty
          setSchema={(newPropSchema) => {
            const newProperties = { ...schema.properties, [key]: newPropSchema }
            updateSchema({ properties: newProperties })
          }}
          displayOnly={displayOnly}
          indent={indent + 2}
          onDelete={() => {
            const { [key]: _, ...rest } = schema.properties || {}
            updateSchema({ properties: rest })
          }}
        />
      ))
    }
    return null
  }

  return (
    <>
      <Box display="flex" sx={{ marginLeft: indent, marginBottom: 1 }}>
        <TextField
          size="small"
          value={title}
          onChange={handleTitleChange}
          disabled={displayOnly || disableTitleEdit ? true : false}
        >
          newProperty
        </TextField>

        <Select
          value={type}
          onChange={handleTypeChange}
          size="small"
          disabled={displayOnly || disableTypeEdit ? true : false}
        >
          {["string", "number", "integer", "array", "object", "boolean"].map((type, indx) => (
            <MenuItem key={indx} value={type}>
              {type}
            </MenuItem>
          ))}
        </Select>

        {showAddProperty && type === "object" && !displayOnly && (
          <Tooltip title="Add property" placement="top">
            <IconButton color="primary" onClick={handleAddProperty}>
              <AddIcon />
            </IconButton>
          </Tooltip>
        )}

        {showAdvanced && !displayOnly && (
          <Tooltip title="Advanced Settings" placement="top">
            <IconButton color="primary" size="small">
              <SettingsIcon />
            </IconButton>
          </Tooltip>
        )}

        {showDelete && !displayOnly && (
          <Tooltip title="Delete" placement="top">
            <IconButton color="error" onClick={handleDelete}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {renderChildProperties()}
    </>
  )
}

export default FieldRow
