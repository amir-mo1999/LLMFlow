"use client"
import React from "react"
import Box from "@mui/material/Box"
import { AIFunction } from "@/api/apiSchemas"
import AIFunctionPaper from "./AIFunctionPaper"

interface AIFunctionOverviewProps {
  onClick?: (indx: number) => () => void
  aiFunctions: AIFunction[]
}

const AIFunctionOverview: React.FC<AIFunctionOverviewProps> = ({ onClick, aiFunctions }) => {
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
      }}
    >
      {aiFunctions.map((aiFunction, indx) => {
        return (
          <AIFunctionPaper
            key={indx}
            aiFunction={aiFunction}
            onClick={onClick ? onClick(indx) : undefined}
            sx={{
              paddingX: "10px",
              paddingTop: "10px",
              width: "100%",
              height: 150,
            }}
          ></AIFunctionPaper>
        )
      })}
    </Box>
  )
}

export default AIFunctionOverview
