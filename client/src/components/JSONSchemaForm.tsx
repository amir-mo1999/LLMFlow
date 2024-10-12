"use client"

import React, { useState, useEffect } from "react"
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  IconButton,
  Paper,
} from "@mui/material"
import { Add, Delete } from "@mui/icons-material"

interface Field {
  name: string
  type: string
  required: boolean
}

interface JSONSchemaFormProps {
  JSONSchema: object | undefined | null
  setJSONSchema: React.Dispatch<React.SetStateAction<Object>>
  onGenerateAssertion?: () => void
}

const JSONSchemaForm: React.FC<JSONSchemaFormProps> = ({
  JSONSchema,
  setJSONSchema,
  onGenerateAssertion,
}) => {
  const [fields, setFields] = useState<Field[]>([])

  const addField = () => {
    setFields([...fields, { name: "", type: "string", required: false }])
  }

  const removeField = (index: number) => {
    const newFields = fields.filter((_, i) => i !== index)
    setFields(newFields)
  }

  const handleFieldChange = (index: number, key: keyof Field, value: string | boolean) => {
    const newFields = [...fields]
    //@ts-ignore
    newFields[index][key] = value as any
    setFields(newFields)
  }

  // Initialize fields from JSONSchema prop
  useEffect(() => {
    const schema = JSONSchema as any
    if (schema && schema.type === "object" && schema.properties) {
      const props = schema.properties
      const requiredFields: string[] = schema.required || []
      const initializedFields: Field[] = Object.keys(props).map((key) => ({
        name: key,
        type: props[key].type || "string",
        required: requiredFields.includes(key),
      }))
      setFields(initializedFields)
    } else {
      setFields([])
    }
  }, [])

  useEffect(() => {
    if (fields.length === 0 || fields.some((field) => field.name.trim() === "")) {
      setJSONSchema({})
      return
    }

    const requiredFields = fields.filter((field) => field.required).map((field) => field.name)

    const properties: { [key: string]: any } = {}
    fields.forEach((field) => {
      properties[field.name] = { type: field.type }
    })

    const generatedSchema = {
      $schema: "http://json-schema.org/draft-07/schema#",
      type: "object",
      properties,
      required: requiredFields.length > 0 ? requiredFields : undefined,
    }

    setJSONSchema(generatedSchema)
  }, [fields, setJSONSchema])

  return (
    <Paper sx={{ p: 3, mb: 4, "&:hover": { backgroundColor: "white" } }}>
      <Typography gutterBottom>Define Fields</Typography>

      {fields.map((field, index) => (
        <Box key={index} display="flex" alignItems="center" mb={2} gap={2}>
          <TextField
            label="Field Name"
            variant="outlined"
            value={field.name}
            onChange={(e) => handleFieldChange(index, "name", e.target.value)}
            required
            fullWidth
          />

          <FormControl variant="outlined" sx={{ minWidth: 120 }}>
            <InputLabel>Type</InputLabel>
            <Select
              label="Type"
              value={field.type}
              onChange={(e) => handleFieldChange(index, "type", e.target.value)}
            >
              <MenuItem value="string">String</MenuItem>
              <MenuItem value="number">Number</MenuItem>
              <MenuItem value="integer">Integer</MenuItem>
              <MenuItem value="boolean">Boolean</MenuItem>
              <MenuItem value="array">Array</MenuItem>
              <MenuItem value="object">Object</MenuItem>
            </Select>
          </FormControl>

          <FormControlLabel
            control={
              <Checkbox
                checked={field.required}
                onChange={(e) => handleFieldChange(index, "required", e.target.checked)}
              />
            }
            label="Required"
          />

          <IconButton aria-label="delete" onClick={() => removeField(index)} color="primary">
            <Delete />
          </IconButton>
        </Box>
      ))}

      <Button variant="contained" startIcon={<Add />} onClick={addField} sx={{ mt: 2 }}>
        Add Field
      </Button>
      {onGenerateAssertion ? (
        <Button
          variant="contained"
          sx={{ mt: 2, ml: 2 }}
          onClick={onGenerateAssertion}
          disabled={!JSONSchema ? true : Object.keys(JSONSchema).length === 0 ? true : false}
        >
          Generate Assertion
        </Button>
      ) : (
        <></>
      )}
    </Paper>
  )
}

export default JSONSchemaForm