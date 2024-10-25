"use client"
import { EvaluateSummary } from "@/api/apiSchemas"
import React from "react"
import Box from "@mui/material/Box"
import ResultCard from "./ResultCard"

interface EvalOverviewProps {
  evalResult: EvaluateSummary
}

const EvalOverview: React.FC<EvalOverviewProps> = ({ evalResult }) => {
  return (
    <Box>
      {/* Loop over results */}
      {evalResult.results.map((result, indx) => {
        return <ResultCard key={indx} result={result}></ResultCard>
      })}
    </Box>
  )
}

export default EvalOverview
