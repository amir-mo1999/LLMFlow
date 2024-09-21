import React from "react"

interface AIFunctionSingleOverviewProps {
  aiFunctionID: string
}

const AIFunctionSingleOverview: React.FC<AIFunctionSingleOverviewProps> = ({ aiFunctionID }) => {
  return <>{aiFunctionID}</>
}

export default AIFunctionSingleOverview
