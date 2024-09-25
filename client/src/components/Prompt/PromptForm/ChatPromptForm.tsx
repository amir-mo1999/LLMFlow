import { Dispatch, SetStateAction } from "react"
import { PromptMessage } from "@/api/apiSchemas"

interface ChatPromptFormProps {
  messages: PromptMessage[]
  setMessages: Dispatch<SetStateAction<PromptMessage[]>>
}

const ChatPromptForm: React.FC<ChatPromptFormProps> = ({ messages, setMessages }) => {
  return "ChatPromptForm"
}

export default ChatPromptForm
