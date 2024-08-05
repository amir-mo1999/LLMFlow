import { useState, useEffect } from "react"
import { AIFunctionT } from "@/types"
import { AIFunction } from "@/models"
import { api } from "@/network"
import { useSession } from "next-auth/react"
import { z } from "zod"

const datetimeSchema = z.string().refine(
  (val) => {
    const date = new Date(val)
    return !isNaN(date.getTime())
  },
  {
    message: "Invalid datetime format",
  }
)

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
