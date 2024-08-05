import { AIFunctionT } from "@/types"
import Typography from "@mui/material/Typography"

interface AIFunctionDetailedOverviewProps {
  aiFunction: AIFunctionT
}

function formatDateTime(dateTimeString: string) {
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
  const seconds = date.getSeconds().toString().padStart(2, "0")
  const milliseconds = date.getMilliseconds().toString().padStart(3, "0")

  // Determine AM/PM period
  const ampm = hours >= 12 ? "PM" : "AM"
  hours = hours % 12
  hours = hours ? hours : 12 // the hour '0' should be '12'

  // Format the date and time in a readable format
  const formattedDate = `${month} ${day}, ${year}`
  const formattedTime = `${hours}:${minutes} ${ampm}`

  return `${formattedDate}, ${formattedTime}`
}

const AIFunctionDetailedOverview: React.FC<AIFunctionDetailedOverviewProps> = ({ aiFunction }) => {
  return (
    <>
      <Typography variant="h5">{aiFunction.name}</Typography>
      <Typography variant="body1">{aiFunction.description}</Typography>
      <Typography variant="body1">{formatDateTime(aiFunction.creation_time)}</Typography>
      <Typography variant="body1">{aiFunction.username}</Typography>
    </>
  )
}

export default AIFunctionDetailedOverview
