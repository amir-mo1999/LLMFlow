import { Dispatch, SetStateAction } from "react"
import { PromptT } from "@/types"
import TextField from "@mui/material/TextField"

interface SingleShotPromptFormProps {
  prompt: PromptT
  setPrompt: Dispatch<SetStateAction<PromptT>>
}

const SingleShotPromptForm: React.FC<SingleShotPromptFormProps> = ({ prompt, setPrompt }) => {
  return "SingleShotPromptForm"
}

export default SingleShotPromptForm
