import { TestCaseInput, Assertion } from "@/api/apiSchemas"
import { SxProps } from "@mui/material"
import React from "react"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import AssertionsOverview from "./AssertionsOverview"
import theme from "@/theme"
import AssertionsForm from "./AIFunctionForm/AssertionsForm.tsx/AssertionsForm"
import IconButton from "@mui/material/IconButton"
import ClearIcon from "@mui/icons-material/Clear"
import InputVariableOverview from "./InputVariableOverview"

interface TestCaseCardProps {
  testCase: TestCaseInput
  displayOnly?: boolean
  sx?: SxProps
  onClickVars?: () => void
  setAssertions?: (assertions: Assertion[]) => void
  onDelete?: () => void
}

const TestCaseCard: React.FC<TestCaseCardProps> = ({
  testCase,
  displayOnly = false,
  sx,
  onClickVars = () => {},
  setAssertions = () => {},
  onDelete = () => {},
}) => {
  return (
    <Box
      sx={{
        backgroundColor: "rgba(80, 60, 128, 0.03)", // Purple with 80% opacity
        padding: 2,
        marginBottom: 2,
        position: "relative",
        borderLeft: 7,
        borderColor: theme.palette.primary.main,
        borderRadius: 1,
        ...sx,
      }}
    >
      <IconButton
        onClick={(e) => {
          e.stopPropagation()
          onDelete()
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
      <Box sx={{ mb: 2 }} onClick={() => onClickVars()}>
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
                setAssertions={setAssertions}
                headerVariant="h6"
              />
            )
          ) : (
            <></>
          )}
        </Box>
      </Box>
    </Box>
  )
}
export default TestCaseCard
