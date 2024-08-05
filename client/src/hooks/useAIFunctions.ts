import { useState, useEffect } from "react"
import { AIFunctionT } from "@/types"
import { api } from "@/network"
import { useSession } from "next-auth/react"

const useAIFunctions = () => {
  const [AIFunctions, setAIFunctions] = useState<Array<AIFunctionT>>([])

  const { data: session } = useSession()

  const access_token = session?.user.access_token as string

  useEffect(() => {
    api
      .getAIFunction(access_token)
      .then((response) => {
        return response.json()
      })
      .then((data) => setAIFunctions(data["ai_function_list"]))
  }, [])

  return AIFunctions
}

export { useAIFunctions }
