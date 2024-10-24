"use client"

import React, { useState } from "react"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Paper from "@mui/material/Paper"
import Button from "@mui/material/Button"
import { ExpandLess, ExpandMore } from "@mui/icons-material"
import AssertionsOverview from "./AssertionsOverview"
import theme from "@/theme"
import ScrollBox from "../ScrollBox"
import { TestCaseInput } from "@/api/apiSchemas"
import { SxProps } from "@mui/material"
import AssertionsForm from "./AIFunctionForm/AssertionsForm.tsx/AssertionsForm"
import { Assertion } from "@/api/apiSchemas"
import IconButton from "@mui/material/IconButton"
import ClearIcon from "@mui/icons-material/Clear"
import Divider from "@mui/material/Divider"

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

  const toggleShowAllTestCases = () => {
    setShowAllTestCases((prev) => !prev)
  }

  const MAX_VISIBLE_TEST_CASES = 2

  if (!testCases || testCases.length === 0) {
    return <></>
  }

  const testCasesToDisplay = showAllTestCases
    ? testCases
    : testCases.slice(0, MAX_VISIBLE_TEST_CASES)

  return (
    <ScrollBox sx={{ ...sx }}>
      {testCasesToDisplay.map((testCase, index) => (
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
            <Box sx={{ mt: 1 }}>
              {Object.entries(testCase.vars).map(([varName, varContent], varIndex) => (
                <Paper
                  key={varIndex}
                  sx={{
                    padding: 1,
                    marginBottom: 1,
                    "&:hover": {
                      backgroundColor: displayOnly ? "white" : "",
                    },
                  }}
                >
                  <Typography fontWeight={700}>{varName}</Typography>
                  <Divider sx={{ marginBottom: 1 }} />
                  <Typography>{varContent}</Typography>
                </Paper>
              ))}
            </Box>
          </Box>

          {/* Assertions Section */}
          <Box>
            <Box sx={{ mt: 1 }}>
              {testCase.assert && testCase.assert !== null ? (
                displayOnly ? (
                  <AssertionsOverview assertions={testCase.assert} displayOnly />
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

      {/* Toggle Button for Showing More/Less Test Cases */}
      {testCases.length > MAX_VISIBLE_TEST_CASES && (
        <Box textAlign="center" mt={2}>
          <Button
            onClick={toggleShowAllTestCases}
            startIcon={showAllTestCases ? <ExpandLess /> : <ExpandMore />}
          >
            {showAllTestCases ? "Show Less" : "Show More"}
          </Button>
        </Box>
      )}
    </ScrollBox>
  )
}

export default TestCasesOverview
