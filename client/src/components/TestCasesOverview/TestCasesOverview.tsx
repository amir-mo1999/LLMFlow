"use client"

import React from "react"
import Box from "@mui/material/Box"
import { TestCaseInput } from "@/api/apiSchemas"
import { SxProps } from "@mui/material"
import { Assertion } from "@/api/apiSchemas"
import TestCaseCard from "./TestCaseCard"

interface TestCasesOverviewProps {
  testCases: TestCaseInput[]
  displayOnly?: boolean
  sx?: SxProps
  onClickVars?: (index: number) => () => void
  setAssertions?: (index: number) => (assertions: Assertion[]) => void
  onDelete?: (index: number) => () => void
}

const TestCasesOverview: React.FC<TestCasesOverviewProps> = ({
  testCases,
  sx,
  displayOnly = false,
  onClickVars = () => () => {},
  setAssertions = () => () => {},
  onDelete = () => () => {},
}) => {
  if (!testCases || testCases.length === 0) {
    return <></>
  }

  return (
    <Box sx={{ ...sx, display: "flex", flexDirection: "column", gap: 2 }}>
      {testCases.map((testCase, index) => (
        <TestCaseCard
          key={index}
          indx={index}
          testCase={testCase}
          displayOnly={displayOnly}
          onClickVars={onClickVars(index)}
          setAssertions={setAssertions(index)}
          onDelete={onDelete(index)}
        ></TestCaseCard>
      ))}
    </Box>
  )
}

export default TestCasesOverview
