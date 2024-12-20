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
const stringSettingsKeys = ["maxLength", "minLength", "pattern"]
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

type Settings = StringSchema | NumberSchema | ArraySchema | ObjectSchema

interface FieldRowProps {
  schema: JsonSchemaInput
  schemaSettings?: Settings
  setSchema?: (_: JsonSchemaInput) => void
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
  const [settings, setSettings] = useState<Settings>(schema)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings])

  const handleTypeChange = (event: SelectChangeEvent) => {
    const newType = event.target.value as JsonSchemaInput["type"]
    setType(newType)
    setSettings({})
    updateSchema({ type: newType, items: undefined, properties: undefined })
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
      //@ts-expect-error: idk
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

  const setItemsSchema = (inputSchema: JsonSchemaInput) => {
    const newSchema = { ...schema }
    newSchema.items = inputSchema
    setSchema({ ...newSchema })
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
            // eslint-disable-next-line
            const { [key]: _, ...rest } = schema.properties || {}
            updateSchema({ properties: rest })
          }}
        />
      ))
    }
    if (type === "array") {
      return (
        <FieldRow
          showAddProperty
          schema={schema.items ? schema.items : { title: "items", type: "string" }}
          disableTitleEdit
          indent={indent + 2}
          displayOnly={displayOnly}
          setSchema={setItemsSchema}
        />
      )
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
            title="Advanced Settings"
            placement="top"
            sx={{ display: type === "string" ? "normal" : "none" }}
          >
            <IconButton onClick={() => setOpenDialog(true)}>
              <Badge
                variant="dot"
                sx={{}}
                color="primary"
                invisible={
                  stringSettingsKeys.some((key) => Object.hasOwn(settings, key)) ? false : true
                }
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
