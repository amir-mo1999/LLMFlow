import { AIFunctionT } from "@/types"
import Typography from "@mui/material/Typography"
import { formatDateTime } from "@/utils"

interface AIFunctionDetailedOverviewProps {
  aiFunction: AIFunctionT
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
