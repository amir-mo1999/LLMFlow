"use client"

import React, { useState } from "react"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Paper from "@mui/material/Paper"
import Button from "@mui/material/Button"
import { ExpandLess, ExpandMore } from "@mui/icons-material"
import AssertionsOverview from "./AssertionsOverview"
import { Assertion } from "@/api/apiSchemas"
import theme from "@/theme"
import ScrollBox from "../ScrollBox"

// Define the structure of a TestCaseInput
export type TestCaseInput = {
  vars: {
    [key: string]: string
  }
  assert: Assertion[] | null
}

interface TestCasesOverviewProps {
  testCases: TestCaseInput[]
}

const TestCasesOverview: React.FC<TestCasesOverviewProps> = ({ testCases }) => {
  const [showAllTestCases, setShowAllTestCases] = useState(false)

  const toggleShowAllTestCases = () => {
    setShowAllTestCases((prev) => !prev)
  }

  const MAX_VISIBLE_TEST_CASES = 2

  if (!testCases || testCases.length === 0) {
    return (
      <Box>
        <Typography>No Test Cases available.</Typography>
      </Box>
    )
  }

  const testCasesToDisplay = showAllTestCases
    ? testCases
    : testCases.slice(0, MAX_VISIBLE_TEST_CASES)

  return (
    <ScrollBox>
      {testCasesToDisplay.map((testCase, index) => (
        <Box
          key={index}
          sx={{
            backgroundColor: "rgba(80, 60, 128, 0.05)", // Purple with 80% opacity
            padding: 2,
            marginBottom: 2,
            borderLeft: 7,
            borderColor: theme.palette.primary.main,
            borderRadius: 1,
          }}
        >
          {/* Test Case Header */}
          <Typography variant="h6" gutterBottom>
            Test Case {index + 1}
          </Typography>

          {/* Variables Section */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1">Variables</Typography>
            <Box sx={{ mt: 1 }}>
              {Object.entries(testCase.vars).map(([varName, varContent], varIndex) => (
                <Paper key={varIndex} sx={{ padding: 1, marginBottom: 1 }}>
                  <Typography variant="subtitle2">{varName}</Typography>
                  <Typography variant="body2">{varContent}</Typography>
                </Paper>
              ))}
            </Box>
          </Box>

          {/* Assertions Section */}
          <Box>
            <Typography variant="subtitle1">Assertions</Typography>
            <Box sx={{ mt: 1 }}>
              {testCase.assert && testCase.assert.length > 0 ? (
                <AssertionsOverview assertions={testCase.assert} displayOnly />
              ) : (
                <Typography variant="body2">No assertions defined for this Test Case.</Typography>
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
