"use client"
import React from "react"
import Box from "@mui/material/Box"
import { AIFunction } from "@/api/apiSchemas"
import AIFunctionPaper from "./AIFunctionPaper"

interface AIFunctionOverviewProps {
  onClick?: (indx: number) => () => void
  aiFunctions: AIFunction[]
  selectedIndx?: number
}

const AIFunctionOverview: React.FC<AIFunctionOverviewProps> = ({
  onClick,
  aiFunctions,
  selectedIndx,
}) => {
  if (!aiFunctions) return <></>

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        paddingY: 2,
        marginBottom: 5,
      }}
    >
      {aiFunctions.map((aiFunction, indx) => {
        return (
          <AIFunctionPaper
            key={indx}
            selected={indx === selectedIndx}
            aiFunction={aiFunction}
            onClick={onClick ? onClick(indx) : undefined}
          ></AIFunctionPaper>
        )
      })}
    </Box>
  )
}

export default AIFunctionOverview
