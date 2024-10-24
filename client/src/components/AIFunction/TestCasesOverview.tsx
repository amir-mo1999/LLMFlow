"use client"

import React, { useState } from "react"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import AssertionsOverview from "./AssertionsOverview"
import theme from "@/theme"
import { TestCaseInput } from "@/api/apiSchemas"
import { SxProps } from "@mui/material"
import AssertionsForm from "./AIFunctionForm/AssertionsForm.tsx/AssertionsForm"
import { Assertion } from "@/api/apiSchemas"
import IconButton from "@mui/material/IconButton"
import ClearIcon from "@mui/icons-material/Clear"
import InputVariableOverview from "./InputVariableOverview"

interface TestCasesOverviewProps {
  testCases: TestCaseInput[]
  displayOnly?: boolean
  sx?: SxProps
  onClickVars?: (indx: number) => void
  setAssertions?: (indx: number, newAssertions: Assertion[]) => void
  onDelete?: (indx: number) => void
}

const TestCasesOverview: React.FC<TestCasesOverviewProps> = ({
  testCases,
  sx,
  displayOnly = false,
  onClickVars = () => {},
  setAssertions = () => {},
  onDelete = () => {},
}) => {
  const [showAllTestCases, setShowAllTestCases] = useState(false)

  if (!testCases || testCases.length === 0) {
    return <></>
  }

  return (
    <Box sx={{ ...sx }}>
      {testCases.map((testCase, index) => (
        <Box
          key={index}
          sx={{
            backgroundColor: "rgba(80, 60, 128, 0.03)", // Purple with 80% opacity
            padding: 2,
            marginBottom: 2,
            position: "relative",
            borderLeft: 7,
            borderColor: theme.palette.primary.main,
            borderRadius: 1,
          }}
        >
          <IconButton
            onClick={(e) => {
              e.stopPropagation()
              onDelete(index)
            }}
            size="small"
            sx={{
              display: displayOnly ? "none" : "normal",
              position: "absolute",
              top: 1,
              right: 1,
              color: theme.palette.primary.main,
            }}
          >
            <ClearIcon />
          </IconButton>

          {/* Variables Section */}
          <Box sx={{ mb: 2 }} onClick={() => onClickVars(index)}>
            <Typography variant="h6">Variables</Typography>
            <InputVariableOverview
              vars={testCase.vars}
              displayOnly={displayOnly}
            ></InputVariableOverview>
          </Box>

          {/* Assertions Section */}
          <Box>
            <Box sx={{ mt: 1 }}>
              {testCase.assert && testCase.assert !== null ? (
                displayOnly ? (
                  <Box>
                    <Typography variant="h6" marginBottom={1}>
                      Assertions
                    </Typography>
                    <AssertionsOverview assertions={testCase.assert} displayOnly />
                  </Box>
                ) : (
                  <AssertionsForm
                    assertions={testCase.assert}
                    setAssertions={(assertion) => setAssertions(index, assertion)}
                    headerVariant="h6"
                  />
                )
              ) : (
                <></>
              )}
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  )
}

export default TestCasesOverview
