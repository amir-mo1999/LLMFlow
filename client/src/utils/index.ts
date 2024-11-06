import {
  AIFunction,
  AIFunctionRouteInput,
  EvaluateSummary,
  JsonSchemaInput,
  ProjectPatchInput,
  Project,
  AIFunctionPatchInput,
  ProjectRouteInput,
  Provider,
} from "@/api/apiSchemas"
import _ from "lodash"
import { BaseAssertionTypes } from "@/api/apiSchemas"

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

export function addTitlesToSchema(
  schema: JsonSchemaInput,
  rootTitle: string = "root"
): JsonSchemaInput {
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

export function getMeanScore(evalSummary: EvaluateSummary) {
  let meanScore =
    evalSummary.results.reduce((acc, result) => acc + (result.score as number), 0) /
    evalSummary.results.length

  meanScore = Math.round(meanScore * 100) / 100
  return meanScore
}

export function getTotalCost(evalSummary: EvaluateSummary) {
  let totalCost = evalSummary.results.reduce((acc, result) => acc + (result.cost as number), 0)

  totalCost = Math.round(totalCost * 100000000) / 100000000
  return totalCost
}

export function getMeanLatency(evalSummary: EvaluateSummary) {
  let meanLatency =
    evalSummary.results.reduce((acc, result) => acc + (result.latencyMs as number), 0) /
    evalSummary.results.length
  meanLatency = Math.round(meanLatency)
  return meanLatency
}

/**
/**
 * Compares two objects and returns an object containing only the fields
 * that have different values in objectB compared to objectA.
 *
 * @param objectA - The original object.
 * @param objectB - The object to compare against.
 * @returns An object with the fields from objectB that have different values.
 */
export function getAIFunctionDiff(aiFunction: AIFunction, routeInput: AIFunctionRouteInput) {
  const newAIFunction: AIFunctionPatchInput = {}

  Object.keys(routeInput).forEach((key) => {
    //@ts-ignore
    if (!_.isEqual(routeInput[key], aiFunction[key])) {
      //@ts-ignore
      newAIFunction[key] = routeInput[key]
    }
  })

  return newAIFunction
}

export function getProjectDiff(project: Project, routeInput: ProjectRouteInput) {
  const newProject: ProjectPatchInput = {}

  Object.keys(routeInput).forEach((key) => {
    //@ts-ignore
    if (!_.isEqual(routeInput[key], project[key])) {
      //@ts-ignore
      newProject[key] = routeInput[key]
    }
  })

  return newProject
}

export const providersArray: Provider[] = ["openai:gpt-4o-mini", "openai:gpt-4"]

export const baseAssertionTypesArray: BaseAssertionTypes[] = [
  "contains",
  "contains-all",
  "contains-any",
  "contains-sql",
  "contains-xml",
  "cost",
  "equals",
  "icontains",
  "icontains-all",
  "icontains-any",
  "is-sql",
  "is-xml",
  "javascript",
  "latency",
  "levenshtein",
  "perplexity-score",
  "perplexity",
  "python",
  "regex",
  "rouge-n",
  "starts-with",
]

export function pick<T, K extends keyof T>(obj: T, ...keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>
  keys.forEach((key) => {
    //@ts-ignore
    if (key in obj) {
      result[key] = obj[key]
    }
  })
  return result
}
