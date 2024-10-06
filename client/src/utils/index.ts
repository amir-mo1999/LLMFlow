import examples from "@/examples/aiFunctions.json"
import { AIFunctionRouteInput } from "@/api/apiSchemas"

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
