import examples from "@/examples/aiFunctions.json"
import { AIFunctionRouteInput, JsonSchemaInput } from "@/api/apiSchemas"

export function splitArrayIntoChunks<T>(array: T[], chunkSize: number): T[][] {
  const result: Array<Array<any>> = []
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize))
  }
  return result
}

export function formatDateTime(dateTimeString: string) {
  // Parse the datetime string to a Date object
  const date = new Date(dateTimeString)

  // Define arrays for month and weekday names
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  // Get individual components from the Date object
  const year = date.getFullYear()
  const month = monthNames[date.getMonth()]
  const day = date.getDate()
  let hours = date.getHours()
  const minutes = date.getMinutes().toString().padStart(2, "0")

  // Determine AM/PM period
  const ampm = hours >= 12 ? "PM" : "AM"
  hours = hours % 12
  hours = hours ? hours : 12 // the hour '0' should be '12'

  // Format the date and time in a readable format
  const formattedDate = `${month} ${day}, ${year}`
  const formattedTime = `${hours}:${minutes} ${ampm}`

  return `${formattedDate}, ${formattedTime}`
}

export function parseJsonSchema(schema: JsonSchemaInput): JsonSchemaInput {
  // Base case: if schema is not an object, return it as is
  if (typeof schema !== "object" || schema === null) {
    return schema
  }

  // Deep copy the schema to avoid mutating the original
  const newSchema: JsonSchemaInput = JSON.parse(JSON.stringify(schema))

  // Remove the 'title' field from the current schema
  delete newSchema.title

  // Process 'properties' if present
  if (newSchema.properties && typeof newSchema.properties === "object") {
    const newProperties: { [key: string]: JsonSchemaInput } = {}
    for (const [key, prop] of Object.entries(newSchema.properties)) {
      if (typeof prop === "object" && prop !== null) {
        const newKey = prop.title ? prop.title : key
        // Recursively process the property schema
        const processedProp = parseJsonSchema(prop)
        newProperties[newKey] = processedProp
      } else {
        // If the property schema is not an object, keep it as is
        newProperties[key] = prop
      }
    }
    newSchema.properties = newProperties
  }

  return newSchema
}

export function addTitlesToSchema(schema: JsonSchemaInput, rootTitle: string = "root"): JsonSchemaInput {
  // Base case: if schema is not an object, return it as is
  if (typeof schema !== "object" || schema === null) {
    return schema
  }

  // Create a shallow copy to avoid mutating the original schema
  const newSchema: JsonSchemaInput = { ...schema }

  // If this is the root schema, set its title
  // You can customize the root title as needed
  if (!newSchema.title) {
    newSchema.title = rootTitle
  } else {
    // Overwrite existing root title to match the desired root title
    newSchema.title = rootTitle
  }

  // Process 'properties' if present
  if (newSchema.properties && typeof newSchema.properties === "object") {
    const newProperties: { [key: string]: JsonSchemaInput } = {}
    for (const [key, prop] of Object.entries(newSchema.properties)) {
      if (typeof prop === "object" && prop !== null) {
        // Set the 'title' to the key name
        newProperties[key] = {
          ...prop,
          title: key,
          // Recursively process the property's schema
          ...addTitlesToSchema(prop, key), // Pass the key as rootTitle for nested objects if desired
        }
      } else {
        // If the property schema is not an object, keep it as is
        newProperties[key] = prop
      }
    }
    newSchema.properties = newProperties
  }

  return newSchema
}
