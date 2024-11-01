"use client"
import React from "react"
import Box from "@mui/material/Box"
import { AIFunction, Prompt, Project } from "@/api/apiSchemas"
import { PromptPaper, AIFunctionPaper } from "@/components"

type Item = "Prompt" | "AIFunction" | "Project"

interface ItemOverviewProps {
  itemType: Item
  onClick?: (indx: number) => () => void
  items: AIFunction[] | Prompt[] | Project[]
  selectedIndx?: number
}

const ItemOverview: React.FC<ItemOverviewProps> = ({ itemType, onClick, items, selectedIndx }) => {
  let componentToRender: React.ReactElement

  if (!items) componentToRender = <></>

  switch (itemType) {
    case "AIFunction":
      componentToRender = (
        <>
          {items.map((aiFunction, indx) => {
            return (
              <AIFunctionPaper
                key={indx}
                selected={indx === selectedIndx}
                aiFunction={aiFunction as AIFunction}
                onClick={onClick ? onClick(indx) : undefined}
              ></AIFunctionPaper>
            )
          })}
        </>
      )
      break
    case "Project":
      componentToRender = <></>
      break
    case "Prompt":
      componentToRender = (
        <>
          {items.map((prompt, indx) => {
            return (
              <PromptPaper
                key={indx}
                selected={indx === selectedIndx}
                prompt={prompt as Prompt}
                onClick={onClick ? onClick(indx) : undefined}
              ></PromptPaper>
            )
          })}
        </>
      )
      break
  }

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
      {componentToRender}
    </Box>
  )
}

export default ItemOverview
