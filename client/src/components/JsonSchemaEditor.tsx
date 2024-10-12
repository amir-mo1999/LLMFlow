"use client"

import React from "react"
import { useState } from "react"
import { JsonSchemaInput } from "@/api/apiSchemas"

interface JsonSchemaEditorProps {
  schema: JsonSchemaInput
  setSchema?: (schema: JsonSchemaInput) => void
  displayOnly?: boolean
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

const JsonSchemaEditor: React.FC<JsonSchemaEditorProps> = ({
  schema,
  setSchema = () => {},
  displayOnly = false,
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

  return <></>
}
