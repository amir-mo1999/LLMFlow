import { Dispatch, SetStateAction } from "react"
import { PromptT } from "@/types"

interface ChatPromptFormProps {
  prompt: PromptT
  setPrompt: Dispatch<SetStateAction<PromptT>>
}

const ChatPromptForm: React.FC<ChatPromptFormProps> = ({ prompt, setPrompt }) => {
  return "ChatPromptForm"
}

export default ChatPromptForm
