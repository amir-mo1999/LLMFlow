import { Dispatch, SetStateAction } from "react"
import { PromptRouteInputT } from "@/types"

interface ChatPromptFormProps {
  prompt: PromptRouteInputT
  setPrompt: Dispatch<SetStateAction<PromptRouteInputT>>
}

const ChatPromptForm: React.FC<ChatPromptFormProps> = ({ prompt, setPrompt }) => {
  return "ChatPromptForm"
}

export default ChatPromptForm
