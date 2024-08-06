import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import { AIFunctionT } from "@/types"

interface PromptFormProps {
  aiFunction: AIFunctionT
}

const PromptForm: React.FC<PromptFormProps> = ({ aiFunction }) => {
  return (
    <>
      <Typography>Prompt</Typography>
      <TextField multiline minRows={10} maxRows={20}></TextField>
    </>
  )
}

export default PromptForm
