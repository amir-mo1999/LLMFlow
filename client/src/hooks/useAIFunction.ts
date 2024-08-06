import { useState, useEffect } from "react"
import { AIFunctionT } from "@/types"
import { AIFunction } from "@/models"
import { api } from "@/network"
import { useSession } from "next-auth/react"

const useAIFunction = (aiFunctionID: string) => {
  const [aiFunction, setAIFunction] = useState<AIFunctionT>()

  const { data: session } = useSession()

  const access_token = session?.user.access_token as string

  useEffect(() => {
    api
      .getAIFunction(access_token, aiFunctionID)
      .then((response) => {
        return response.json()
      })
      .then((data) => setAIFunction(AIFunction.parse(data)))
  }, [])

  return aiFunction
}

export default useAIFunction
