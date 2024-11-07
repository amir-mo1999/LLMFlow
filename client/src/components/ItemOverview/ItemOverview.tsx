"use client"
import React, { useState, useEffect } from "react"
import Box from "@mui/material/Box"
import { AIFunction, Prompt, Project } from "@/api/apiSchemas"
import { PromptPaper, AIFunctionPaper, ProjectPaper } from "@/components"
import { SearchField } from "@/components"
import { getNonMatchingIndices } from "@/utils"

type Item = "Prompt" | "AI Function" | "Project"

interface ItemOverviewProps {
  itemType: Item
  onClick?: (_: number) => () => void
  items: AIFunction[] | Prompt[] | Project[]
  selectedIndx?: number
}

const ItemOverview: React.FC<ItemOverviewProps> = ({ itemType, onClick, items, selectedIndx }) => {
  let componentToRender: React.ReactElement
  const [searchValue, setSearchValue] = useState("")
  const [nonMatchingIndices, setNonMatchingIndices] = useState<number[]>([])

  if (!items) componentToRender = <></>
  useEffect(() => {
    const newNonMatchingIndices = getNonMatchingIndices(items, searchValue, itemType)
    setNonMatchingIndices(newNonMatchingIndices)
  }, [searchValue, items, itemType])

  switch (itemType) {
    case "AI Function":
      componentToRender = (
        <>
          {items.map((aiFunction, indx) => {
            return (
              <AIFunctionPaper
                sx={{ display: nonMatchingIndices.includes(indx) ? "none" : "normal" }}
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
      componentToRender = (
        <>
          {items.map((project, indx) => {
            return (
              <ProjectPaper
                sx={{ display: nonMatchingIndices.includes(indx) ? "none" : "normal" }}
                key={indx}
                selected={indx === selectedIndx}
                project={project as Project}
                onClick={onClick ? onClick(indx) : undefined}
              ></ProjectPaper>
            )
          })}
        </>
      )
      break
    case "Prompt":
      componentToRender = (
        <>
          {items.map((prompt, indx) => {
            return (
              <PromptPaper
                sx={{ display: nonMatchingIndices.includes(indx) ? "none" : "normal" }}
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
    <>
      <SearchField
        value={searchValue}
        setValue={setSearchValue}
        placeholder={itemType}
      ></SearchField>
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
    </>
  )
}

export default ItemOverview
