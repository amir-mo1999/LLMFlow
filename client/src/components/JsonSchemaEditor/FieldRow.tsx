import React, { useState, useEffect } from "react"
import Box from "@mui/material/Box"
import { JsonSchemaInput } from "@/api/apiSchemas"
import Select, { SelectChangeEvent } from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"
import TextField from "@mui/material/TextField"
import Tooltip from "@mui/material/Tooltip"
import IconButton from "@mui/material/IconButton"
import Badge from "@mui/material/Badge"
import AddIcon from "@mui/icons-material/Add"
import ClearIcon from "@mui/icons-material/Clear"
import theme from "@/theme"
import { StringDialog } from "./Dialogs"
import SettingsIcon from "@mui/icons-material/Settings"

export type StringSchema = Pick<JsonSchemaInput, "maxLength" | "minLength" | "pattern">
export type NumberSchema = Pick<
  JsonSchemaInput,
  "multipleOf" | "maximum" | "exclusiveMaximum" | "minimum" | "exclusiveMinimum"
>
export type ArraySchema = Pick<
  JsonSchemaInput,
  "items" | "contains" | "maxContains" | "minContains" | "maxItems" | "minItems" | "uniqueItems"
>
export type ObjectSchema = Pick<
  JsonSchemaInput,
  | "properties"
  | "patternProperties"
  | "additionalProperties"
  | "maxProperties"
  | "minProperties"
  | "required"
>

interface FieldRowProps {
  schema: JsonSchemaInput
  schemaSettings?: StringSchema | NumberSchema | ArraySchema | ObjectSchema
  setSchema?: (schema: JsonSchemaInput) => void
  displayOnly?: boolean
  disableTitleEdit?: boolean
  disableTypeEdit?: boolean
  showAddProperty?: boolean
  showDelete?: boolean
  onDelete?: () => void
  indent?: number
  isRoot?: boolean
}

const FieldRow: React.FC<FieldRowProps> = ({
  schema,
  schemaSettings = {},
  setSchema = () => {},
  displayOnly = false,
  disableTitleEdit = false,
  disableTypeEdit = false,
  showAddProperty = false,
  showDelete = false,
  onDelete,
  indent = 0,
  isRoot = false,
}) => {
  const maxFieldTitleChars = 40

  const [type, setType] = useState<JsonSchemaInput["type"]>(
    isRoot ? (["object", "array"].includes(schema.type) ? schema.type : "object") : schema.type
  )
  const [title, setTitle] = useState<string>(schema.title ? schema.title : "")
  const [settings, setSettings] = useState(schemaSettings)
  const [openDialog, setOpenDialog] = useState(false)

  useEffect(() => {
    setType(schema.type)
  }, [schema])

  const updateSchema = (updates: Partial<JsonSchemaInput>) => {
    const newSchema = { ...schema, ...updates }
    setSchema(newSchema)
  }

  useEffect(() => {
    const newSchema: JsonSchemaInput = { type: type, title: title, ...settings }
    setSchema(newSchema)
  }, [settings])

  const handleTypeChange = (event: SelectChangeEvent) => {
    const newType = event.target.value as JsonSchemaInput["type"]
    setType(newType)
    setSettings({})
    updateSchema({ type: newType })
  }

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = event.target.value.replace(" ", "")
    if (newTitle.length <= maxFieldTitleChars) {
      setTitle(newTitle)
      updateSchema({ title: newTitle })
    }
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

  const onSubmitSettings = (settings: StringSchema | NumberSchema | ArraySchema | ObjectSchema) => {
    setOpenDialog(false)
    setSettings(settings)
  }

  const onCloseDialog = () => {
    setOpenDialog(false)
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
      <Box display="flex" sx={{ marginLeft: indent }}>
        <TextField
          size="small"
          value={title}
          onChange={handleTitleChange}
          disabled={displayOnly || disableTitleEdit ? true : false}
          sx={{
            input: {
              "&.Mui-disabled": {
                WebkitTextFillColor: theme.palette.text.primary,
              },
            },
          }}
        >
          newProperty
        </TextField>

        <Select
          value={type}
          onChange={handleTypeChange}
          size="small"
          disabled={displayOnly || disableTypeEdit ? true : false}
          sx={{
            "& .MuiSelect-select.MuiInputBase-input.MuiOutlinedInput-input.Mui-disabled": {
              WebkitTextFillColor: theme.palette.text.primary,
            },
          }}
        >
          {["string", "number", "integer", "array", "object", "boolean"].map((type, indx) => (
            <MenuItem
              key={indx}
              value={type}
              sx={{
                display:
                  isRoot && ["string", "number", "integer", "boolean"].includes(type)
                    ? "none"
                    : "normal",
              }}
            >
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

        {!displayOnly && (
          <Tooltip
            title="tooltip"
            placement="top"
            sx={{ display: type === "string" ? "normal" : "none" }}
          >
            <IconButton onClick={() => setOpenDialog(true)}>
              <Badge
                variant="dot"
                sx={{}}
                color="primary"
                invisible={Object.keys(settings).length === 0 ? true : false}
              >
                <SettingsIcon />
              </Badge>
            </IconButton>
          </Tooltip>
        )}

        {showDelete && !displayOnly && (
          <Tooltip title="Delete" placement="top">
            <IconButton color="error" onClick={handleDelete}>
              <ClearIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      <StringDialog
        stringSettings={settings as StringSchema}
        open={type === "string" && openDialog ? true : false}
        onSubmit={onSubmitSettings}
        onClose={onCloseDialog}
      ></StringDialog>

      {renderChildProperties()}
    </>
  )
}

export default FieldRow
