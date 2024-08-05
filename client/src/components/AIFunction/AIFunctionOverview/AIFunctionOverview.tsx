"use client"

import { useAIFunctions } from "@/hooks"

interface AIFunctionOverviewProps {}

const AIFunctionOverview: React.FC<AIFunctionOverviewProps> = ({}) => {
  const aiFunctions = useAIFunctions()
  console.log("AI Functions", aiFunctions)
  return "AI Function Overview"
}

export default AIFunctionOverview
